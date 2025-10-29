import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { signup, login, forgotPassword } from "../controllers/authController.js";

const router = express.Router();

// Normal signup/login routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

// ==========================
// 🌐 Google OAuth
// ==========================

// Step 1: Redirect to Google for login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Handle Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    try {
      const token = jwt.sign(
        { id: req.user._id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // ✅ Redirect to frontend with token
      res.redirect(`${process.env.CLIENT_URL}/chat?token=${token}`);
    } catch (err) {
      console.error("Google callback error:", err);
      res.redirect(`${process.env.CLIENT_URL}/login?error=google`);
    }
  }
);

export default router;
