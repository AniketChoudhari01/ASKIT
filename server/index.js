import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectionToDB from "./dbConnection.js";
import router from "./routes/user.route.js";

const app = express();
app.use(express.json());
app.use(cookieParser()); // Required for reading cookies
const PORT = process.env.PORT || 5000;

config();

app.listen(PORT, async () => {
  await connectionToDB();
  console.log(`App is running at http://localhost:${PORT}`);
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Cookie can move easily
  })
);

app.use("/ping", function (req, res) {
  // to check whether our server is up or not with bare configurations
  res.send("/pong");
});

// app.all('*', (req, res) => {
// 	// random url
// 	res.status(404).send('OOPS!! 404 page not found')
// })

app.use("/", router);

// app.use(errorMiddleware);

export default app;
