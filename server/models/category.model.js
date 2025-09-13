import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  photo: String,
  details: String,
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  products: [productSchema],
});

// 👇 force it to use "category" collection, not "categories"
const Category = mongoose.model("Category", categorySchema, "category");

export default Category;
