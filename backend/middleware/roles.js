// const permit = (...allowedRoles) => {
//   return (req, res, next) => {
//     const role = req.user?.role;
//     if (!role || !allowedRoles.includes(role)) {
//       return res.status(403).json({ message: "Forbidden: insufficient privileges" });
//     }
//     next();
//   };
// };

// // module.exports = { permit };
// const permit = (...allowedRoles) => {
//   return (req, res, next) => {
//     const role = req.user?.role;
//     if (!role || !allowedRoles.includes(role)) {
//       return res.status(403).json({ message: "Forbidden: insufficient privileges" });
//     }
//     next();
//   };
// };

// module.exports = { permit };
// middleware/roles.js
const permit = (...roles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Access denied. Insufficient permissions.",
        requiredRoles: roles,
        userRole: req.user.role 
      });
    }
    
    // User has required role, proceed to next middleware
    next();
  };
};

module.exports = { permit };