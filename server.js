const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Dummy user data for login (For demo purposes)
const user = {
  username: 'user@example.com',
  password: 'password123' // Not using hashing for simplicity
};

let tempAuthCode = ''; // Temporary 2FA code (just for simulation)

// Login Endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Log the username and password
  console.log(`Login attempt - Username: ${username}, Password: ${password}`);

  // Check username and password
  if (username === user.username && password === user.password) {
    // Generate a fake 2FA code (for simulation purposes)
    tempAuthCode = '123456'; // A fake 2FA code for demo

    console.log('Login successful, redirecting to 2FA...');
    res.json({ message: 'Login successful. Please enter the 2FA code.' });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

// 2FA Verification Endpoint
app.post('/verify-2fa', (req, res) => {
  const { authCode } = req.body;

  // Log the submitted 2FA code
  console.log(`2FA code submitted: ${authCode}`);

  // Check if the submitted 2FA code is correct
  if (authCode === tempAuthCode) {
    console.log('2FA Verification successful! User logged in.');
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
