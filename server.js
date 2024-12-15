const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto'); // Para sa pag-generate ng 2FA code

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Dummy user data (For demo purposes)
const user = {
  username: 'user@example.com',
  password: 'password123' // Secure hashing should be done in production
};

let tempAuthCode = ''; // Temporary 2FA code storage (For demo purposes)

// Login Endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Log the username and password
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);

  // Check username and password
  if (username === user.username && password === user.password) {
    // Generate a temporary 2FA code
    tempAuthCode = crypto.randomInt(100000, 999999).toString(); // 6-digit code

    // For demonstration purposes, print the 2FA code to the console
    console.log(`Generated 2FA Code: ${tempAuthCode}`);
    
    // Return a response to the client indicating that the 2FA code is sent (or generated)
    res.json({ message: '2FA code sent (or generated)!' });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

// 2FA Verification Endpoint
app.post('/verify-2fa', (req, res) => {
  const { authCode } = req.body;

  // Log the submitted 2FA code
  console.log(`Submitted 2FA Code: ${authCode}`);

  // Check if the provided auth code matches the generated code
  if (authCode === tempAuthCode) {
    console.log('2FA Verified! Login successful.');
    res.json({ message: '2FA Verified! Login successful.' });
  } else {
    res.status(401).json({ error: 'Invalid 2FA code' });
  }
});

// Serve the HTML page (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
