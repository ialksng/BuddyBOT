import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import session from "express-session";
import passport from "./config/passport.js";

// Routes
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

// ==========================
// 🌱 Load environment variables
// ==========================
dotenv.config();

// ==========================
// ⚙️ App setup
// ==========================
const app = express();
const PORT = process.env.PORT || 3000;

// ==========================
// 📁 For frontend build (React)
// ==========================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================
// 🔧 Middlewares
// ==========================
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ==========================
// 🧩 Session + Passport (for Google OAuth)
// ==========================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // only secure in production
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ==========================
// 🔒 JWT Verification Middleware
// ==========================
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

// ==========================
// 🚀 Routes
// ==========================
app.use("/api/auth", authRoutes);
app.use("/api/chat", verifyToken, chatRoutes);

// ==========================
// 📦 Connect to MongoDB
// ==========================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected with Database");
  } catch (err) {
    console.error("❌ Failed to connect with the Database:", err.message);
    process.exit(1);
  }
};

// ==========================
// 🏁 Serve Frontend (Production Build)
// ==========================
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
}

// ==========================
// 🚀 Start Server
// ==========================
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running on port ${PORT}`);
});
