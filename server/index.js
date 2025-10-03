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
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Cookie can move easily
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Use a secure, long string in production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set true if using HTTPS
  })
);
app.use(passport.initialize());
app.use(passport.session());
const PORT = process.env.PORT || 5000;

// (async () => {
//   await connectionToDB();
//   // await loadCachedFAQs();
//   app.listen(PORT, () => {
//     console.log(`App is running at http://localhost:${PORT}`);
//   });
// })();

app.listen(PORT, async () => {
  await connectionToDB();
  // await loadCachedFAQs();
  // console.log(`App is running at http://localhost:${PORT}`);
});

app.use("/ping", function (req, res) {
  // to check whether our server is up or not with bare configurations
  res.send("/pong");
});

app.use("/", router);

// app.use(errorMiddleware);

export default app;
