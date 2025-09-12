import ContactModel from "../models/contact.model.js";

// Save a new contact message
export async function createContactController(req, res) {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const newContact = new ContactModel({ name, email, message });
    await newContact.save();

    return res.status(201).json({ message: "Message received successfully", success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
}

// Get all contact messages (for admin)
export async function getAllContactsController(req, res) {
  try {
    const contacts = await ContactModel.find().sort({ createdAt: -1 });
    return res.json({ contacts });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
}
