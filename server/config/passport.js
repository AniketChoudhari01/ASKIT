import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import mongoose from "mongoose";
import { User } from "../models/user-model.js";
import dotenv from "dotenv";
dotenv.config();
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (!user) {
          // User not fully registered — store temp profile in session
          return done(null, {
            temp: true,
            email,
            name: profile.displayName,
            googleId: profile.id,
            profilePicture: profile.photos[0]?.value || null,
          });
        }

        return done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  if (user.temp) {
    // Handle temporary Google user
    done(null, { temp: true, email: user.email });
  } else {
    // Handle fully registered user
    done(null, user._id);
  }
});

passport.deserializeUser(async (id, done) => {
  try {
    if (id.temp) {
      // Handle temporary Google user
      return done(null, id);
    }
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
