const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const crypto = require('crypto');
let responseStore = {};

app.use(bodyParser.urlencoded({ extended: true }));

function generateToken(email) {
  return crypto.createHash('sha256').update(email).digest('hex');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'viratbarath218@gmail.com',
    pass: 'qzhdmpmsajxiqyvs'
  }
});


app.get('/', async (req, res) => {
    const recipientEmail = 'barathkumar.b2411@gmail.com'; 
    const token = generateToken(recipientEmail);
    const mailOptions = {
        from: 'HACKER@gmail.com',
        to: recipientEmail,
        subject: 'Response Required',
        html: `
            <p>Do you accept?</p>
            <form action="http://localhost:${PORT}/response" method="post">
                <input type="hidden" name="token" value="${token}">
                <input type="hidden" name="answer" value="accept">
                <button type="submit">Accept</button>
            </form>
            <form action="http://localhost:${PORT}/response" method="post">
                <input type="hidden" name="token" value="${token}">
                <input type="hidden" name="answer" value="reject">
                <button type="submit">Reject</button>
            </form>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.send('Email sent');
    } catch (error) {
        res.send('Error sending email: ' + error.message);
    }
});

app.post('/response', (req, res) => {
    const token = req.body.token;
    const answer = req.body.answer;
  
    if (responseStore[token]) {
      res.send('Your response has already been taken.');
      return;
    }
  
    responseStore[token] = answer;
    console.log(`Response received for token ${token}: ${answer}`);
    res.send(`Thank you for your response: ${answer}`);
});

// app.get('/response', (req, res) => {
//     const email = req.query.email;
//     const answer = req.query.answer;
//     console.log(`Response received from ${email}: ${answer}`);
//     res.send(`Thank you for your response: ${answer}`);
// });

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
