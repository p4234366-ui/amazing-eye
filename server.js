const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const USERS_FILE = path.join(__dirname, 'users.json');

// Signup
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  let users = [];

  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE));
  }

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists!' });
  }

  users.push({ username, email, password });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.json({ message: 'User registered successfully!' });
});

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!fs.existsSync(USERS_FILE)) return res.status(400).json({ message: 'No users found!' });

  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return res.status(400).json({ message: 'Invalid credentials!' });

  res.json({ message: `Welcome back, ${user.username}!` });
});

// Server start
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
