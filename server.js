// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));


// POST endpoint to handle form submission
app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email content
 const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_TO,
  subject: `New Contact Form Submission: ${subject}`,
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #0d6efd; margin-bottom: 10px;">📩 New Contact Form Submission</h2>
      <hr style="border-top: 1px solid #eee; margin: 10px 0;">
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <div style="background-color: #f9f9f9; padding: 10px; border-radius: 5px;">
        ${message.replace(/\n/g, '<br>')}
      </div>
      <hr style="border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 0.9em; color: #888;">This email was sent automatically from your portfolio contact form.</p>
    </div>
  `
};


  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'An error occurred while sending the message.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(` Server is running on: http://localhost:${PORT}`);
});
