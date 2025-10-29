import "dotenv/config";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

// Determine environment (Render or local)
const isProduction = process.env.NODE_ENV === "production";
const callbackURL = isProduction
  ? "https://buddy-bot-p4ko.onrender.com/api/auth/google/callback"
  : "http://localhost:3000/api/auth/google/callback";

console.log(`🧭 Using Google OAuth callback URL: ${callbackURL}`);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails?.[0]?.value || "",
            password: "", // No password for Google users
            role: "student",
          });
          console.log(`🆕 New user created: ${user.email}`);
        } else {
          console.log(`👤 Existing user logged in: ${user.email}`);
        }

        return done(null, user);
      } catch (err) {
        console.error("❌ Error in Google OAuth:", err);
        return done(err, null);
      }
    }
  )
);

// Optional: for session-based auth
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
