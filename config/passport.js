const usersModel = require("./../db/models/users");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

// Config .env file
dotenv.config();

// Get SECRET_KEY variable from .env
const SECRET = process.env.SECRET_KEY;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://mazad-server.herokuapp.com/auth/google/callback",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      const email = profile.email.toLowerCase();

      const user = await usersModel.findOne({ email }).populate("role");

      if (user) {
        if (user.auth == profile.provider && user.googleId == profile.id) {
          const payload = {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role.role,
          };

          const options = {
            expiresIn: "10h",
          };

          const token = jwt.sign(payload, SECRET, options);

          return done(null, { result: user, token });
        } else {
          return done(null, { message: "Email is already taken!!" });
        }
      } else {
        const newUser = new usersModel({
          email: email,
          name: profile.given_name,
          avatar: profile.picture,
          role: process.env.USER_ROLE,
          active: true,
          auth: profile.profile,
          googleId: profile.id,
        });

        newUser.save().then(async (result) => {
          const res = await usersModel
            .findOne({ _id: result._id })
            .populate("role");

          const payload = {
            id: res._id,
            email: res.email,
            name: res.name,
            role: res.role.role,
          };

          const options = {
            expiresIn: "10h",
          };

          const token = jwt.sign(payload, SECRET, options);

          return done(null, { result: res, token });
        });
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
