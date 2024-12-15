const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

// Example route for login (don't use this for actual login in production)
app.post('/login', (req, res) => {
  const { username, password, code } = req.body;
  
  // Log the sensitive data for debugging (NOT recommended for production)
  console.log('Username:', username);
  console.log('Password:', password);
  console.log('Code:', code);

  // Simulate login process
  res.send('Logged in');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
