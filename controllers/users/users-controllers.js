const HttpError = require('../../utility/constant/http-error');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/users/user');
const { getOne, getAll, deleteOne } = require('../../repository/user-repo');
const { encrypt } = require('../../utility/middleware/crypto');
const { getOneVendor } = require('../../repository/vendor-repo');


const signup = async (req, res, next) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next(new HttpError('Invalid input enter.please enter valid input.'));
    }
    const { firstName, lastName, userName, email, password, country } = req.body;

    let existingUser;
    try {
        existingUser = await getOne({ email: email });
    }
    catch (err) {
        return next(new HttpError('Something went wrong.could not find Teacher', 500));
    }
    if (existingUser) {
        return next(new HttpError('Email is already registered.please use diffrent email', 401));
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError('Could not create Teacher,please try again.', 500);
        return next(error)
    }


    const createdUser = new User({
        firstName,
        lastName,
        userName,
        email,
        country,
        password: hashedPassword,
        role: "user",
    });
    //console.log(createdUser);
    let token;
    try {
        await createdUser.save();
        token = jwt.sign({ email: email, role: "user" },
            process.env.JWT_KEY,
            { expiresIn: '5d' });

    }
    catch (err) {
        return next(new HttpError('User Creation Failed.plese try again', 500));
    }
    res.status(200).json({ message: 'User Created successfully', data: encrypt({email: email, role: "user", token: token}) });
};

const login = async (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        return next(new HttpError('Invalid input enter.please enter valid input.', 401));
    }

    const { email, password } = req.body;
    let identifiedUser;
    try {
        vendorUser = await getOneVendor({$or:[{ email: email, disable: false },{ userName: email, disable: false }]});
        normalUser = await getOne({$or:[{ email: email, disable: false },{ userName: email, disable: false }]});
        identifiedUser = vendorUser ? vendorUser : normalUser;
    }
    catch (err) {
        return next(new HttpError('something went wrong.login failed.'));
    }


    if (!identifiedUser) {
        const error = new HttpError('User is not registered or enter wrong email,or sign up first.', 401);
        return next(error);
    }

    let isValidPassword;
    try {
        isValidPassword = await bcrypt.compare(password, identifiedUser.password);
    } catch (err) {
        return next(new HttpError('Password do not Match.', 500))
    }


    //console.log(identifiedUser.email);
    if (!isValidPassword) {
        const error = new HttpError('Password do not match.', 401);
        return next(error);
    }
    let token;
    try {
        token = jwt.sign({ userId: identifiedUser.id, email: identifiedUser.email, role: identifiedUser.role },
            process.env.JWT_KEY,
            { expiresIn: '5d' });
    } catch (err) {
        return next(new HttpError('Login failed', 500));
    }
    res.status(200).json({ message: "User/Vendor Login successfully", data: encrypt({ userId: identifiedUser.id, email: identifiedUser.email, role: identifiedUser.role, ...(identifiedUser.role === "vendor" && {roleType : identifiedUser.roleType}), token: token })});
};

exports.login = login;
exports.signup = signup;