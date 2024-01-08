const { promisify } = require("util");

const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, statuscode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statuscode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, mobileNo, password } = req.body;
  const user = await User.create({ name, email, mobileNo, password });
  createAndSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new appError("Please provide a email and password", 400));

  const user = await User.findOne({ email });
  // console.log(user);
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new appError("Incorrect email or password", 401));

  createAndSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token)
    return next(
      new appError(
        "You are not logged in! Please log in first to get access.",
        401
      )
    );
  const { id } = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findById(id);
  if (!user) return next(new appError("No user found.", 401));
  req.user = user;
  next();
});
