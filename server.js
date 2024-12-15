const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Enable CORS for all origins (if your frontend and backend are on different domains)
app.use(cors());

// Use body-parser to handle form data
app.use(bodyParser.urlencoded({ extended: true }));

// Handle login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Log the username and password for debugging
  console.log('Login Attempt:', { username, password });

  // Add your login logic here (e.g., check credentials in database)

  // After login is successful, redirect or show 2FA form
  res.redirect('/verify-2fa');
});

// Handle 2FA verification
app.post('/verify-2fa', (req, res) => {
  const { authCode } = req.body;

  // Log the 2FA code entered by the user
  console.log('2FA Code Entered:', authCode);

  // Add your 2FA verification logic here (e.g., check the code)

  // Respond with a success or failure message
  res.send('2FA Code Verified!');
});

// Start the server on the configured port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
