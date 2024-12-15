const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware para mag-handle ng URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (CSS)
app.use(express.static('public'));

// Root route upang ipakita ang form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Route para mag-handle ng POST request mula sa form
app.post('/submit', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Print the username and password sa terminal (Logs)
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);

  // Response sa user
  res.send('Login successful! Check your terminal for username and password.');
});

// Simulan ang server sa port 3000
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
