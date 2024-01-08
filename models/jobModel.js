const mongoose = require("mongoose");
const validator = require("validator");

const jobSchema = mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Name is required"],
    },
    logo: {
      type: String,
      validate: [validator.isURL, "Enter a valid URL"],
      required: [true, "Logo is required"],
    },
    jobPosition: {
      type: String,
      required: [true, "Job Positon is required"],
    },
    monthlySalary: {
      type: String,
      default: null,
      required: [true, "Monthly salary is required"],
    },
    jobType: {
      type: String,
      enum: ["Fulltime", "Part time", "Internship"],
      required: [true, "Job type is required"],
    },
    category: {
      type: String,
      enum: ["Remote", "Office"],
      required: [true, "Category is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    about: {
      type: String,
      required: [true, "About is required"],
    },
    skills: {
      type: [String],
      required: [true, "Skill are required"],
    },
    information: {
      type: String,
      required: [true, "Information is required"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const JobModel = mongoose.model("Job", jobSchema);
module.exports = JobModel;
