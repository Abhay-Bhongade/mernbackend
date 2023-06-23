const GoogleStrategy = require("passport-google-oauth20").Strategy;
const facebookStrategy = require('passport-facebook').Strategy;
const passport = require("passport");
const dotenv = require('dotenv');
dotenv.config();

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: "/api/users/google/callback",
			scope: ["profile", "email"],
		},
		function (accessToken, refreshToken, profile, callback) {
			callback(null, profile);
		}
	)
);

passport.use(new facebookStrategy({

    // pull in our app id and secret from our auth.js file
    clientID        : process.env.FACEBOOK_CLIENT_ID,
    clientSecret    : process.env.FACEBOOK_SECRET_ID,
    callbackURL     : "/api/users/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email']

},// facebook will send back the token and profile
function(token, refreshToken, profile, done) {

    console.log(profile)
    return done(null,profile)
}));

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});