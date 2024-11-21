const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.OWNER_EMAIL, 
    pass: process.env.OWNER_PASSWORD  
  }
});

const contactController = {
  submitContact: async (req, res) => {
    try {
      const { name, email, subject, message, timestamp } = req.body;

      
      const adminMailOptions = {
        from: process.env.OWNER_EMAIL,
        to: 'libinseban97@gmail.com', 
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <p><strong>Timestamp:</strong> ${new Date(timestamp).toLocaleString()}</p>
        `
      };

      const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thank you for contacting us',
        html: `
          <h2>Thank you for reaching out!</h2>
          <p>Dear ${name},</p>
          <p>We have received your message and will get back to you as soon as possible.</p>
          <p>Best regards,<br>Your Company Name</p>
        `
      };

      // Send both emails
      await transporter.sendMail(adminMailOptions);
      await transporter.sendMail(userMailOptions);

      res.status(200).json({ 
        success: true, 
        message: 'Contact form submitted successfully' 
      });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to submit contact form' 
      });
    }
  }
};

module.exports = {
    submitContact: contactController.submitContact
};