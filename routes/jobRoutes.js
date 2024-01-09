const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(jobController.getAllJobs)
  .post(authController.protect, jobController.createJob);

router
  .route("/:id")
  .get(jobController.getJob)
  .put(authController.protect, jobController.updateJob)
  .delete(authController.protect, jobController.deleteJob);

module.exports = router;
