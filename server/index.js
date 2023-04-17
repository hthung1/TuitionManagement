import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
// import posts from "./routers/posts.js";
// import mongoose from "mongoose";
import sinhvienRouter from "./routers/sinhvienRouter.js";
import loginRouter from "./routers/loginRouter.js";
import http from "http";
dotenv.config({ path: ".env" });

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const port = process.env.PORT || 5000;
const URL = process.env.MONGODB_URL;

// mongoose
//   .connect(URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected to DB");
//     app.listen(port, () => {
//       console.log(`Server is running on port: ${port}`);
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
app.use(express.json());
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
// app.use(
//   "/login",
//   createProxyMiddleware({ target: "localhost:3000", changeOrigin: true })
// );
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

app.use("/login", loginRouter);
app.use("/sinhvien", sinhvienRouter);
// app.use("/posts", posts);
