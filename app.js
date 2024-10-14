// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateContent = require("./gemini.js");

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory user storage (for demonstration purposes)
// In a real application, use a database
const users = [];

// Initialize admin user with hashed password
const initializeAdminUser = async () => {
  const adminUsername = process.env.ADMIN_USERNAME;
  const plainPassword = process.env.ADMIN_PASSWORD;

  // Check if admin user already exists
  const existingAdmin = users.find(user => user.username === adminUsername);
  if (existingAdmin) {
    return;
  }

  // Hash the admin password
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // Store admin user
  users.push({
    username: adminUsername,
    password: hashedPassword,
  });

  console.log("Admin user initialized.");
};

// Call the initialization function
initializeAdminUser();

// Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Find user
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT
  const token = jwt.sign(
    { username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Token expires in 1 hour
  );

  res.status(200).json({ message: "Login successful", token });
});


// Protected Gemini Route
app.post("/gemini", generateContent);

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
