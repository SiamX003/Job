import { Router } from "express";
import Category from "../models/category.model.js";

const armRouter = Router();

armRouter.get("/", async (req, res) => {
  try {
    // Case-insensitive match for safety
    const category = await Category.findOne({ name: { $regex: /^Arm$/i } });

    if (!category) {
      return res.status(404).json({ message: "Arm category not found" });
    }

    res.json(category.products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default armRouter;
