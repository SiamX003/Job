// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, role, resumeLink } = req.body;
//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ message: "User already exists" });

//     const hashed = await bcrypt.hash(password, 10);
//     const user = new User({ name, email, password: hashed, role, resumeLink });
//     await user.save();
//     // optional: return token immediately
//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
//     res.status(201).json({ message: "User registered", token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const ok = await bcrypt.compare(password, user.password);
//     if (!ok) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
//     res.json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// exports.getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Validation helper functions
const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, message: "Name is required" };
  }
  
  // Remove extra spaces and check if empty
  const trimmedName = name.trim();
  if (!trimmedName) {
    return { isValid: false, message: "Name cannot be empty or just spaces" };
  }
  
  // Check length
  if (trimmedName.length < 2) {
    return { isValid: false, message: "Name must be at least 2 characters long" };
  }
  
  if (trimmedName.length > 50) {
    return { isValid: false, message: "Name cannot exceed 50 characters" };
  }
  
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-\'\.]+$/;
  if (!nameRegex.test(trimmedName)) {
    return { isValid: false, message: "Name can only contain letters, spaces, hyphens, and apostrophes" };
  }
  
  // Check for excessive spaces (no more than one consecutive space)
  if (/\s{2,}/.test(trimmedName)) {
    return { isValid: false, message: "Name cannot contain multiple consecutive spaces" };
  }
  
  return { isValid: true, cleanName: trimmedName };
};

const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, message: "Email is required" };
  }
  
  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail) {
    return { isValid: false, message: "Email cannot be empty" };
  }
  
  // Email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, message: "Please provide a valid email address" };
  }
  
  if (trimmedEmail.length > 100) {
    return { isValid: false, message: "Email cannot exceed 100 characters" };
  }
  
  return { isValid: true, cleanEmail: trimmedEmail };
};

const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: "Password is required" };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters long" };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: "Password cannot exceed 128 characters" };
  }
  
  // Check for at least one uppercase, one lowercase, one number, and one special character
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  if (!hasUppercase) {
    return { isValid: false, message: "Password must contain at least one uppercase letter" };
  }
  
  if (!hasLowercase) {
    return { isValid: false, message: "Password must contain at least one lowercase letter" };
  }
  
  if (!hasNumber) {
    return { isValid: false, message: "Password must contain at least one number" };
  }
  
  if (!hasSpecialChar) {
    return { isValid: false, message: "Password must contain at least one special character" };
  }
  
  return { isValid: true };
};

const validateRole = (role) => {
  const validRoles = ["candidate", "recruiter"];
  if (role && !validRoles.includes(role)) {
    return { isValid: false, message: "Role must be either 'candidate' or 'recruiter'" };
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

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, resumeLink } = req.body;
    
    // Validate name
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      return res.status(400).json({ message: nameValidation.message });
    }
    
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ message: emailValidation.message });
    }
    
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ message: passwordValidation.message });
    }
    
    // Validate role
    const roleValidation = validateRole(role);
    if (!roleValidation.isValid) {
      return res.status(400).json({ message: roleValidation.message });
    }
    
    // Validate resume link
    const resumeValidation = validateResumeLink(resumeLink);
    if (!resumeValidation.isValid) {
      return res.status(400).json({ message: resumeValidation.message });
    }
    
    // Check if user already exists
    const existing = await User.findOne({ email: emailValidation.cleanEmail });
    if (existing) {
      return res.status(400).json({ message: "User already exists with this email address" });
    }
    
    // Hash password
    const hashed = await bcrypt.hash(password, 12); // Increased rounds for better security
    
    // Create user with validated data
    const user = new User({ 
      name: nameValidation.cleanName,
      email: emailValidation.cleanEmail,
      password: hashed,
      role: role || "candidate", // Default to candidate if not provided
      resumeLink: resumeValidation.cleanLink || undefined
    });
    
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "24h" } // Extended to 24h for better UX
    );
    
    res.status(201).json({ 
      message: "User registered successfully", 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
    
  } catch (err) {
    console.error("Registration error:", err);
    
    // Handle specific MongoDB errors
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    
    res.status(500).json({ message: "Server error during registration", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Basic validation for login
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }
    
    const user = await User.findOne({ email: emailValidation.cleanEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "24h" }
    );
    
    res.json({ 
      message: "Login successful", 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
    
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
};





