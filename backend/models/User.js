
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ["candidate", "recruiter"], default: "candidate" },
//   resumeLink: { type: String } // optional
// }, { timestamps: true });

// module.exports = mongoose.model("User", userSchema);
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [50, "Name cannot exceed 50 characters"],
    match: [/^[a-zA-Z\s\-\'\.]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"]
  },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [100, "Email cannot exceed 100 characters"],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"]
  },
  password: { 
    type: String, 
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    maxlength: [128, "Password cannot exceed 128 characters"]
    // Note: We don't validate password complexity here because it's hashed
  },
  role: { 
    type: String, 
    enum: {
      values: ["candidate", "recruiter"],
      message: "Role must be either 'candidate' or 'recruiter'"
    }, 
    default: "candidate" 
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
  }
}, { 
  timestamps: true 
});

// Index for faster email lookups
userSchema.index({ email: 1 });

// Pre-save middleware to ensure name doesn't have multiple consecutive spaces
userSchema.pre('save', function(next) {
  if (this.name) {
    // Replace multiple consecutive spaces with single space
    this.name = this.name.replace(/\s+/g, ' ').trim();
  }
  next();
});

// Instance method to get user without password
userSchema.methods.toSafeObject = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Static method to find user by email (case insensitive)
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase().trim() });
};

module.exports = mongoose.model("User", userSchema);
