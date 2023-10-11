const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const crypto = require('crypto');
let responseStore = {};

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', './views');

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

app.get("/" , (req,res) => {
    res.render("index")
})

app.post('/', async (req, res) => {
    const recipientEmail = req.body['email'];
    const token = generateToken(recipientEmail);
    const mailOptions = {
        from: 'HACKER@gmail.com',
        to: recipientEmail,
        subject: 'Response Required',
        html: `
            <p>Do you accept?</p>
            <form action="http://localhost:${PORT}/response" method="post">
                <input type="hidden" name="token" value="${token}">
                <input type="hidden" name="email" value="${recipientEmail}">
                <input type="hidden" name="answer" value="accept">
                <button type="submit">Accept</button>
            </form>
            <form action="http://localhost:${PORT}/response" method="post">
                <input type="hidden" name="token" value="${token}">
                <input type="hidden" name="email" value="${recipientEmail}">
                <input type="hidden" name="answer" value="reject">
                <button type="submit">Reject</button>
            </form>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email Send")
        res.send("Email send")
        return;
    } catch (error) {
        res.send('Error sending email: ' + error.message);
    }
});

app.post('/response', (req, res) => {
    const token = req.body.token;
    const answer = req.body.answer;
    const email = req.body.email;

    if (responseStore[token]) {
        res.send('Your response has already been taken.');
        console.log(`Response received for token ${email}: ${answer}`);
        return;
    }
    
    responseStore[token] = answer;
    console.log(`Response received for token ${email}: ${answer}`);
    res.send(`Thank you for your response: ${answer}`);
    return;
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
