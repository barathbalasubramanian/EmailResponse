const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'viratbarath218@gmail.com',
    pass: 'qzhdmpmsajxiqyvs'
  }
});

app.get('/', async (req, res) => {
    const recipientEmail = 'barathkumar.b2411@gmail.com'; 
    
    const mailOptions = {
        from: 'HACKER@gmail.com',
        to: recipientEmail,
        subject: 'Response Required',
        html: `
        <p>Do you accept?</p>
        <a href="http://localhost:${PORT}/response?email=${recipientEmail}&answer=accept">Accept</a>
        <a href="http://localhost:${PORT}/response?email=${recipientEmail}&answer=reject">Reject</a>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.send('Email sent');
    } catch (error) {
        res.send('Error sending email: ' + error.message);
    }
});

app.get('/response', (req, res) => {
    const email = req.query.email;
    const answer = req.query.answer;
    console.log(`Response received from ${email}: ${answer}`);
    res.send(`Thank you for your response: ${answer}`);
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
