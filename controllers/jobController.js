const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const Job = require("../models/jobModel");

exports.createJob = catchAsync(async (req, res, next) => {
  req.body.createdBy = req.user.id;
  const job = await Job.create(req.body);
  res.status(201).json({
    status: "success",
    job,
  });
});

exports.getAllJobs = catchAsync(async (req, res, next) => {
  const jobs = await Job.find();

  res.status(200).json({
    status: "success",
    length: jobs.length,
    data: {
      jobs,
    },
  });
});

exports.getJob = catchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job)
    return next(
      new appError(
        `No job found with id ${req.params.id}.Try with different one.`,
        404
      )
    );
  res.status(200).json({
    status: "success",
    job,
  });
});

exports.updateJob = catchAsync(async (req, res, next) => {
  const newJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!newJob) {
    return next(
      new appError(`Can't get data for your requested id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    status: "success",
    newJob,
  });
});

exports.deleteJob = catchAsync(async (req, res, next) => {
  const doc = await Job.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(
      new appError(`Can't get data for your requested id ${req.params.id}`, 404)
    );
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
