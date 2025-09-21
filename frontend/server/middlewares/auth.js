import jwt from "jsonwebtoken";
import User from "../models/User.js"; // add `.js` because ESM requires full extension

const auth = async (req, res, next) => {
  try {
    const header = req.header("Authorization");
    if (!header) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user info to request
    req.user = { id: decoded.id, role: decoded.role };

    // optional: fetch full user document
    // req.userDoc = await User.findById(decoded.id).select("-password");

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

export default auth; // ✅ ESM export
