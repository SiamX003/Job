// Recruiter-only access
export const recruiterOnly = (req, res, next) => {
  if (req.user?.role !== "recruiter") {
    return res.status(403).json({ message: "Access denied: Recruiters only" });
  }
  next();
};

// General role-based access
export const permit = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: Unauthorized role" });
    }
    next();
  };
};
