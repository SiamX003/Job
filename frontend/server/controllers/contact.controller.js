/*

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

*/

import Contact from "../models/Contact.js";

export const sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const contact = new Contact({ name, email, message });
    await contact.save();
    res
      .status(201)
      .json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




