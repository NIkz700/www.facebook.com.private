const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); // To parse form data
const app = express();

// Enable CORS for all origins (if you're using a different port for frontend and backend)
app.use(cors());

// Use body parser middleware to handle form submissions
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the static HTML (if the HTML is part of the same app, you can serve it)
app.use(express.static('public'));

// Handle login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login Attempt:', username, password);
  
  // Handle login logic here, e.g., check credentials from database

  // After successful login, respond with a 2FA form (or just redirect)
  res.redirect('/verify-2fa');
});

// Handle 2FA verification
app.post('/verify-2fa', (req, res) => {
  const { authCode } = req.body;
  console.log('2FA Code:', authCode);
  
  // Handle 2FA verification logic here

  // Respond with success or failure
  res.send('2FA verified successfully!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
