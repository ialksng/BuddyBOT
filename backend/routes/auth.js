import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { signup, login, forgotPassword } from "../controllers/authController.js";

const router = express.Router();

// ----------------------
// 🧩 Normal Auth Routes
// ----------------------
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

// ----------------------
// 🌐 Google OAuth Routes
// ----------------------

// Step 1: Redirect to Google login
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
      // Generate JWT
      const token = jwt.sign(
        { id: req.user._id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Dynamically choose frontend URL
      const frontendURL =
        process.env.NODE_ENV === "production"
          ? "https://buddy-bot-p4ko.onrender.com"
          : "http://localhost:5173";

      // Redirect to frontend chat page with token
      res.redirect(`${frontendURL}/chat?token=${token}`);
    } catch (err) {
      console.error("❌ Google OAuth callback error:", err);
      const frontendURL =
        process.env.NODE_ENV === "production"
          ? "https://buddy-bot-p4ko.onrender.com"
          : "http://localhost:5173";
      res.redirect(`${frontendURL}/login?error=google`);
    }
  }
);

export default router;
