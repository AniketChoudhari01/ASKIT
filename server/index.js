import { config } from "dotenv";
config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectionToDB from "./dbConnection.js";
import { router, loadCachedFAQs } from "./routes/user.route.js";
import passport from "./config/passport.js";
import session from "express-session";

const app = express();

const allowedOrigins = [
  "http://localhost:3000", // Local dev
  "https://askit-connect.vercel.app", // ✅ Correct Vercel URL
];

// ✅ Proper CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // use true in production with HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectionToDB();
  console.log(`Server running on port ${PORT}`);
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use("/", router);

export default app;
