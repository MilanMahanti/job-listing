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
  const queryObj = { ...req.query };
  const query = Job.find();

  if (queryObj.jobPosition && typeof queryObj.jobPosition === "string") {
    const regex = new RegExp(queryObj.jobPosition, "i");
    query
      .find({
        jobPosition: { $regex: regex },
      })
      .collation({ locale: "en", strength: 2 });
  }

  if (queryObj.skills && typeof queryObj.skills === "string") {
    const skillsArr = queryObj.skills
      .split(",")
      .map((el) => el.trim().toLowerCase());
    query.find({
      skills: { $in: skillsArr.map((skill) => new RegExp(skill, "i")) },
    });
  }

  const jobs = await query;

  res.status(200).json({
    status: "success",
    results: jobs.length,
    data: { jobs },
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
