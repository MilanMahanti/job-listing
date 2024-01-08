const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/appError");
const healthRouter = require("./routes/healthRoute");
const jobRouter = require("./routes/jobRoutes");
const userRouter = require("./routes/authRoutes");
const globalErrorHandler = require("./controllers/errorController");
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

if (process.env.NODE_ENV === "developement") {
  app.use(morgan("dev"));
}

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   console.log(req.cookies);
//   next();
// });

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/user", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError("Route not found", 404));
});

app.use(globalErrorHandler);

module.exports = app;
