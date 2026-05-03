const Contact = require('../models/Contact');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, error: 'Please provide all fields' });
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      data: contact,
      message: 'Your message has been sent successfully!'
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact
// @access  Private/Admin
exports.getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort('-createdAt');
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
