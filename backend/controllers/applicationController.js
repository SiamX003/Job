// const Application = require("../models/Application");
// const Job = require("../models/Job");

// exports.apply = async (req, res) => {
//   try {
//     const { jobId, resumeLink } = req.body;

//     const job = await Job.findById(jobId);
//     if (!job) return res.status(404).json({ message: "Job not found" });

//     // prevent duplicate application by same candidate for same job
//     const already = await Application.findOne({ jobId, candidateId: req.user.id });
//     if (already) return res.status(400).json({ message: "Already applied" });

//     const application = new Application({ jobId, candidateId: req.user.id, resumeLink });
//     await application.save();
//     res.status(201).json(application);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// exports.getApplicationsForJob = async (req, res) => {
//   try {
//     const apps = await Application.find({ jobId: req.params.jobId }).populate("candidateId", "name email resumeLink");
//     res.json(apps);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.getApplicationsForUser = async (req, res) => {
//   try {
//     const apps = await Application.find({ candidateId: req.params.userId }).populate("jobId");
//     res.json(apps);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const mongoose = require("mongoose");

// Validation helper functions
const validateObjectId = (id, fieldName) => {
  if (!id) {
    return { isValid: false, message: `${fieldName} is required` };
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { isValid: false, message: `Invalid ${fieldName.toLowerCase()} ID format` };
  }

  return { isValid: true };
};

const validateResumeLink = (resumeLink) => {
  if (!resumeLink) return { isValid: true }; // Optional field

  if (typeof resumeLink !== 'string') {
    return { isValid: false, message: "Resume link must be a valid string" };
  }

  const trimmedLink = resumeLink.trim();
  if (!trimmedLink) return { isValid: true }; // Empty after trim is okay

  // Basic URL validation
  try {
    new URL(trimmedLink);
    return { isValid: true, cleanLink: trimmedLink };
  } catch (error) {
    return { isValid: false, message: "Resume link must be a valid URL" };
  }
};

const validateCoverLetter = (coverLetter) => {
  if (!coverLetter) return { isValid: true }; // Optional field

  if (typeof coverLetter !== 'string') {
    return { isValid: false, message: "Cover letter must be a valid string" };
  }

  const trimmedLetter = coverLetter.trim();
  if (trimmedLetter.length > 2000) {
    return { isValid: false, message: "Cover letter cannot exceed 2000 characters" };
  }

  return { isValid: true, cleanCoverLetter: trimmedLetter || undefined };
};

exports.apply = async (req, res) => {
  try {
    const { jobId, resumeLink, coverLetter } = req.body;
    const candidateId = req.user.id;

    // Validate candidate role
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: "Only candidates can apply for jobs" });
    }

    // Validate jobId
    const jobIdValidation = validateObjectId(jobId, "Job ID");
    if (!jobIdValidation.isValid) {
      return res.status(400).json({ message: jobIdValidation.message });
    }

    // Validate resume link
    const resumeValidation = validateResumeLink(resumeLink);
    if (!resumeValidation.isValid) {
      return res.status(400).json({ message: resumeValidation.message });
    }

    // Validate cover letter
    const coverLetterValidation = validateCoverLetter(coverLetter);
    if (!coverLetterValidation.isValid) {
      return res.status(400).json({ message: coverLetterValidation.message });
    }

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if job is still active/open for applications
    if (job.status && job.status === 'closed') {
      return res.status(400).json({ message: "This job is no longer accepting applications" });
    }

    // Prevent candidates from applying to their own jobs (if they're also recruiters)
    if (job.recruiterId && job.recruiterId.toString() === candidateId) {
      return res.status(400).json({ message: "You cannot apply to your own job posting" });
    }

    // Check for duplicate application
    const existingApplication = await Application.findOne({
      jobId: jobId,
      candidateId: candidateId
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        applicationId: existingApplication._id,
        status: existingApplication.status
      });
    }

    // Get candidate's default resume if no resume provided
    let finalResumeLink = resumeValidation.cleanLink;
    if (!finalResumeLink) {
      const candidate = await User.findById(candidateId).select('resumeLink');
      finalResumeLink = candidate?.resumeLink;
    }

    // Create application
    const application = new Application({
      jobId: jobId,
      candidateId: candidateId,
      recruiterId: job.recruiterId, // Store recruiter ID for easier queries
      resumeLink: finalResumeLink,
      coverLetter: coverLetterValidation.cleanCoverLetter,
      status: 'applied'
    });

    await application.save();

    // Populate the response with job and candidate details
    await application.populate([
      { path: 'jobId', select: 'title company location' },
      { path: 'candidateId', select: 'name email' }
    ]);

    res.status(201).json({
      message: "Application submitted successfully",
      application: application
    });

  } catch (err) {
    console.error("Application error:", err);
    res.status(500).json({ message: "Server error during application submission", error: err.message });
  }
};

exports.getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const recruiterId = req.user.id;

    // Validate recruiter role
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: "Only recruiters can view job applications" });
    }

    // Validate jobId
    const jobIdValidation = validateObjectId(jobId, "Job ID");
    if (!jobIdValidation.isValid) {
      return res.status(400).json({ message: jobIdValidation.message });
    }

    // Check if job exists and belongs to this recruiter
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.recruiterId.toString() !== recruiterId) {
      return res.status(403).json({ message: "You can only view applications for your own job postings" });
    }

    // Get applications with candidate details
    const applications = await Application.find({ jobId: jobId })
      .populate("candidateId", "name email resumeLink")
      .populate("jobId", "title company")
      .sort({ createdAt: -1 }); // Most recent first

    res.json({
      message: "Applications retrieved successfully",
      jobTitle: job.title,
      totalApplications: applications.length,
      applications: applications
    });

  } catch (err) {
    console.error("Get applications error:", err);
    res.status(500).json({ message: "Server error while retrieving applications" });
  }
};

exports.getApplicationsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const requesterId = req.user.id;
    const requesterRole = req.user.role;

    // Validate userId
    const userIdValidation = validateObjectId(userId, "User ID");
    if (!userIdValidation.isValid) {
      return res.status(400).json({ message: userIdValidation.message });
    }

    // Security check: Users can only see their own applications
    // unless they're recruiters viewing applications for their jobs
    if (userId !== requesterId && requesterRole !== 'recruiter') {
      return res.status(403).json({ message: "You can only view your own applications" });
    }

    let query;
    let populateFields;

    if (requesterRole === 'candidate' || userId === requesterId) {
      // Candidate viewing their own applications
      query = { candidateId: userId };
      populateFields = [
        { path: "jobId", select: "title company location salary recruiterId" },
        { path: "recruiterId", select: "name email" }
      ];
    } else {
      // Recruiter viewing applications for their jobs
      query = {
        candidateId: userId,
        recruiterId: requesterId // Only show applications for recruiter's jobs
      };
      populateFields = [
        { path: "jobId", select: "title company location" },
        { path: "candidateId", select: "name email resumeLink" }
      ];
    }

    const applications = await Application.find(query)
      .populate(populateFields)
      .sort({ createdAt: -1 });

    res.json({
      message: "Applications retrieved successfully",
      totalApplications: applications.length,
      applications: applications
    });

  } catch (err) {
    console.error("Get user applications error:", err);
    res.status(500).json({ message: "Server error while retrieving user applications" });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, notes } = req.body;
    const recruiterId = req.user.id;

    // Validate recruiter role
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: "Only recruiters can update application status" });
    }

    // Validate applicationId
    const appIdValidation = validateObjectId(applicationId, "Application ID");
    if (!appIdValidation.isValid) {
      return res.status(400).json({ message: appIdValidation.message });
    }

    // Validate status
    const validStatuses = ['applied', 'reviewed', 'accepted', 'rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Status must be one of: " + validStatuses.join(', ')
      });
    }

    // Find application and verify ownership
    const application = await Application.findById(applicationId).populate('jobId');
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.jobId.recruiterId.toString() !== recruiterId) {
      return res.status(403).json({ message: "You can only update applications for your own job postings" });
    }

    // Validate notes if provided
    let cleanNotes = undefined;
    if (notes) {
      if (typeof notes !== 'string') {
        return res.status(400).json({ message: "Notes must be a valid string" });
      }
      cleanNotes = notes.trim();
      if (cleanNotes.length > 1000) {
        return res.status(400).json({ message: "Notes cannot exceed 1000 characters" });
      }
    }

    // Update application
    application.status = status;
    if (cleanNotes !== undefined) {
      application.notes = cleanNotes;
    }
    application.updatedAt = new Date();

    await application.save();

    // Populate response
    await application.populate([
      { path: 'candidateId', select: 'name email' },
      { path: 'jobId', select: 'title company' }
    ]);

    res.json({
      message: "Application status updated successfully",
      application: application
    });

  } catch (err) {
    console.error("Update application status error:", err);
    res.status(500).json({ message: "Server error while updating application status" });
  }
};

exports.withdrawApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const candidateId = req.user.id;

    // Validate candidate role
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: "Only candidates can withdraw applications" });
    }

    // Validate applicationId
    const appIdValidation = validateObjectId(applicationId, "Application ID");
    if (!appIdValidation.isValid) {
      return res.status(400).json({ message: appIdValidation.message });
    }

    // Find and verify ownership
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.candidateId.toString() !== candidateId) {
      return res.status(403).json({ message: "You can only withdraw your own applications" });
    }

    // Check if application can be withdrawn
    if (application.status === 'accepted' || application.status === 'rejected') {
      return res.status(400).json({
        message: `Cannot withdraw application that has already been ${application.status}`
      });
    }

    await Application.findByIdAndDelete(applicationId);

    res.json({
      message: "Application withdrawn successfully",
      applicationId: applicationId
    });

  } catch (err) {
    console.error("Withdraw application error:", err);
    res.status(500).json({ message: "Server error while withdrawing application" });
  }
  //////debugging bs
  // Add this at the very end of applicationController.js
  console.log("All exports:", Object.keys(exports));
};