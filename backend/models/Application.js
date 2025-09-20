
// const mongoose = require("mongoose");

// const applicationSchema = new mongoose.Schema({
//   jobId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "Job", 
//     required: [true, "Job ID is required"],
//     index: true
//   },
//   candidateId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "User", 
//     required: [true, "Candidate ID is required"],
//     index: true
//   },
//   ///////commentedout because the cl was not saved/////
//   recruiterId: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "User",
//   index: true
// },
//   // recruiterId: {
//   //   type: mongoose.Schema.Types.ObjectId,
//   //   ref: "User",
//   //   required: [true, "Recruiter ID is required"],
//   //   index: true
//   // },
//   resumeLink: { 
//     type: String,
//     trim: true,
//     validate: {
//       validator: function(v) {
//         if (!v) return true; // Optional field
//         try {
//           new URL(v);
//           return true;
//         } catch (error) {
//           return false;
//         }
//       },
//       message: "Resume link must be a valid URL"
//     }
//   },
//   coverLetter: {
//     type: String,
//     trim: true,
//     maxlength: [2000, "Cover letter cannot exceed 2000 characters"]
//   },
//   status: { 
//     type: String, 
//     enum: {
//       values: ["applied", "reviewed", "accepted", "rejected", "withdrawn"],
//       message: "Status must be one of: applied, reviewed, accepted, rejected, withdrawn"
//     }, 
//     default: "applied",
//     index: true
//   },
//   notes: {
//     type: String,
//     trim: true,
//     maxlength: [1000, "Notes cannot exceed 1000 characters"]
//   },
//   appliedAt: {
//     type: Date,
//     default: Date.now
//   }
// }, { 
//   timestamps: true 
// });

// // Compound indexes for efficient queries
// applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true }); // Prevent duplicate applications
// applicationSchema.index({ candidateId: 1, createdAt: -1 }); // User's applications by date
// applicationSchema.index({ recruiterId: 1, status: 1 }); // Recruiter's applications by status
// applicationSchema.index({ jobId: 1, status: 1 }); // Job applications by status

// // Pre-save middleware
// applicationSchema.pre('save', function(next) {
//   // Set appliedAt only on first creation
//   if (this.isNew) {
//     this.appliedAt = new Date();
//   }
//   next();
// });

// // Instance methods
// applicationSchema.methods.canBeWithdrawn = function() {
//   return this.status === 'applied' || this.status === 'reviewed';
// };

// applicationSchema.methods.canBeUpdatedByRecruiter = function() {
//   return this.status !== 'withdrawn';
// };

// // Static methods
// applicationSchema.statics.findByCandidate = function(candidateId, populateFields = []) {
//   let query = this.find({ candidateId }).sort({ createdAt: -1 });
//   if (populateFields.length > 0) {
//     query = query.populate(populateFields);
//   }
//   return query;
// };

// applicationSchema.statics.findByJob = function(jobId, populateFields = []) {
//   let query = this.find({ jobId }).sort({ createdAt: -1 });
//   if (populateFields.length > 0) {
//     query = query.populate(populateFields);
//   }
//   return query;
// };

// applicationSchema.statics.findByRecruiter = function(recruiterId, status = null) {
//   const query = { recruiterId };
//   if (status) {
//     query.status = status;
//   }
//   return this.find(query)
//     .populate('candidateId', 'name email resumeLink')
//     .populate('jobId', 'title company location')
//     .sort({ createdAt: -1 });
// };

// applicationSchema.statics.getApplicationStats = function(recruiterId) {
//   return this.aggregate([
//     { $match: { recruiterId: new mongoose.Types.ObjectId(recruiterId) } },
//     { $group: { _id: '$status', count: { $sum: 1 } } },
//     { $project: { status: '$_id', count: 1, _id: 0 } }
//   ]);
// };

// module.exports = mongoose.model("Application", applicationSchema);
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Job", 
    required: [true, "Job ID is required"],
    index: true
  },
  candidateId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: [true, "Candidate ID is required"],
    index: true
  },
  recruiterId: { // MODIFIED: uncommented and renamed for consistency
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true
  },
  resumeLink: { 
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        try {
          new URL(v);
          return true;
        } catch (error) {
          return false;
        }
      },
      message: "Resume link must be a valid URL"
    }
  },
  coverLetter: {
    type: String,
    trim: true,
    maxlength: [2000, "Cover letter cannot exceed 2000 characters"]
  },
  status: { 
    type: String, 
    enum: ["applied", "reviewed", "accepted", "rejected", "withdrawn"], 
    default: "applied",
    index: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, "Notes cannot exceed 1000 characters"]
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

// Compound indexes for efficient queries
applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true }); // Prevent duplicate applications
applicationSchema.index({ candidateId: 1, createdAt: -1 }); // User's applications by date
applicationSchema.index({ recruiterId: 1, status: 1 }); // Recruiter's applications by status
applicationSchema.index({ jobId: 1, status: 1 }); // Job applications by status

// Pre-save middleware
applicationSchema.pre('save', function(next) {
  if (this.isNew) {
    this.appliedAt = new Date();
  }
  next();
});

// Instance methods
applicationSchema.methods.canBeWithdrawn = function() {
  return this.status === 'applied' || this.status === 'reviewed';
};

applicationSchema.methods.canBeUpdatedByRecruiter = function() {
  return this.status !== 'withdrawn';
};

// Static methods
applicationSchema.statics.findByCandidate = function(candidateId, populateFields = []) {
  let query = this.find({ candidateId }).sort({ createdAt: -1 });
  if (populateFields.length > 0) {
    query = query.populate(populateFields);
  }
  return query;
};

applicationSchema.statics.findByJob = function(jobId, populateFields = []) {
  let query = this.find({ jobId }).sort({ createdAt: -1 });
  if (populateFields.length > 0) {
    query = query.populate(populateFields);
  }
  return query;
};

applicationSchema.statics.findByRecruiter = function(recruiterId, status = null) {
  const query = { recruiterId };
  if (status) query.status = status;

  return this.find(query)
    .populate('candidateId', 'name email resumeLink') // MODIFIED
    .populate('jobId', 'title company location') // MODIFIED
    .sort({ createdAt: -1 });
};

applicationSchema.statics.getApplicationStats = function(recruiterId) {
  return this.aggregate([
    { $match: { recruiterId: new mongoose.Types.ObjectId(recruiterId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $project: { status: '$_id', count: 1, _id: 0 } }
  ]);
};

module.exports = mongoose.model("Application", applicationSchema);
