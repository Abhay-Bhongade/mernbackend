const express = require("express");
const { check } = require("express-validator");
const jwt = require("jsonwebtoken");
const usersControllers = require("../controllers/users/users-controllers");
const { decrypt, encrypt } = require("../utility/middleware/crypto");
const passport = require("passport");
const user = require("../models/users/user");
const dotenv = require("dotenv");
const HttpError = require("../utility/constant/http-error");
dotenv.config();

const router = express.Router();

router.post("/signup", decrypt, usersControllers.signup);

router.post("/login", decrypt, usersControllers.login);

router.get("/login/success", async (req, res) => {
  console.log("req in login", req);
  if (req.user || req.session.passport.user) {
    let userDetail = req.user || req.session.passport.user;
    let userExits;
    if (userDetail?.provider === "google") {
      userExits = await user.findOne({ email: userDetail?._json?.email });
      if (userExits) {
        let token;
        try {
          token = jwt.sign(
            {
              userId: userExits.id,
              email: userExits.email,
              role: userExits.role,
            },
            process.env.JWT_KEY,
            { expiresIn: "5d" }
          );
        } catch (err) {
          return next(new HttpError("Login failed", 500));
        }
        res.redirect(
          `${process.env.CLIENT_URL}?data=${encrypt({
            userId: userExits.id,
            email: userExits.email,
            role: userExits.role,
            ...(userExits.role === "vendor" && {
              roleType: userExits.roleType,
            }),
            token: token,
          })}`
        );
      } else {
        const createdUser = new user({
          firstName: userDetail?._json?.given_name,
          lastName: userDetail?._json?.family_name,
          userName: userDetail?._json?.name.split(" ").join(""),
          email: userDetail?._json?.email,
          country: "USA",
          password: "hashedPassword",
          provider: userDetail?.provider,
          role: "user",
        });
        let token;
        try {
          await createdUser.save();
          token = jwt.sign(
            { email: userDetail?._json?.email, role: "user" },
            process.env.JWT_KEY,
            { expiresIn: "5d" }
          );
        } catch (err) {
          return next(
            new HttpError("User Creation Failed.plese try again", 500)
          );
        }
        res.redirect(
          `${process.env.CLIENT_URL}?data=${encrypt({
            email: userDetail?._json?.email,
            role: "user",
            token: token,
          })}`
        );
      }
    } else {
      userExits = await user.findOne({
        firstName: userDetail?._json?.first_name,
        lastName: userDetail?._json?.last_name,
      });
      if (userExits) {
        let token;
        try {
          token = jwt.sign(
            {
              userId: userExits.id,
              userName: userExits.userName,
              role: userExits.role,
            },
            process.env.JWT_KEY,
            { expiresIn: "5d" }
          );
        } catch (err) {
          return next(new HttpError("Login failed", 500));
        }
        res.redirect(
          `${process.env.CLIENT_URL}?data=${encrypt({
            userId: userExits.id,
            userName: userExits.userName,
            role: userExits.role,
            ...(userExits.role === "vendor" && {
              roleType: userExits.roleType,
            }),
            token: token,
          })}`
        );
      } else {
        const createdUser = new user({
          firstName: userDetail?._json?.first_name,
          lastName: userDetail?._json?.last_name,
          userName: userDetail?._json?.name.split(" ").join(""),
          email: "email",
          country: "USA",
          password: "hashedPassword",
          provider: userDetail?.provider,
          role: "user",
        });
        let token;
        try {
          await createdUser.save();
          token = jwt.sign(
            {
              userName: userDetail?._json?.name.split(" ").join(""),
              role: "user",
            },
            process.env.JWT_KEY,
            { expiresIn: "5d" }
          );
        } catch (err) {
          return next(
            new HttpError("User Creation Failed.plese try again", 500)
          );
        }
        res.redirect(
          `${process.env.CLIENT_URL}?data=${encrypt({
            userName: userDetail?._json?.name.split(" ").join(""),
            role: "user",
            token: token,
          })}`
        );
      }
    }
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/api/users/login/success",
    failureRedirect: process.env.CLIENT_URL_LOGIN,
  })
);

router.get("/facebook", passport.authenticate("facebook", { scope: "email" }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/api/users/login/success",
    failureRedirect: process.env.CLIENT_URL_LOGIN,
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL_LOGIN);
});

module.exports = router;
