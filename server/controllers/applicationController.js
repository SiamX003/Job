import Application from "../models/Application.js";
import Job from "../models/Job.js";

export const apply = async (req, res) => {
  try {
    const { jobId } = req.body;
    const application = new Application({ job: jobId, user: req.user.id });
    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getApplicationsForJob = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId }).populate("user");
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getApplicationsForUser = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.params.userId }).populate("job");
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
