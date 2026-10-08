const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;


// ===============================
// PostgreSQL Connection
// ===============================

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json());


// ===============================
// Test Route
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "TalentIQ API is running successfully",
  });
});


// ===============================
// Database Test Route
// ===============================

app.get("/api/test-db", async (req, res) => {

  try {

    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "PostgreSQL connected successfully",
      time: result.rows[0].now,
    });

  } catch (error) {

    console.error("Database connection error:", error);

    res.status(500).json({
      message: "Database connection failed",
    });

  }

});


// ===============================
// REGISTER
// ===============================

app.post("/api/auth/register", async (req, res) => {

  const { name, email, password, role } = req.body;

  try {

    // Check if email already exists
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {

      return res.status(409).json({
        message: "An account with this email already exists.",
      });

    }


    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    // Save user
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`,
      [name, email, hashedPassword, role]
    );


    res.status(201).json({
      message: "Account created successfully!",
      user: result.rows[0],
    });

  } catch (error) {

    console.error("Registration error:", error);

    res.status(500).json({
      message: "Something went wrong while creating the account.",
    });

  }

});


// ===============================
// LOGIN
// ===============================

app.post("/api/auth/login", async (req, res) => {

  const { email, password } = req.body;

  try {

    // Find user by email
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    // User does not exist
    if (result.rows.length === 0) {

      return res.status(401).json({
        message: "Invalid email or password.",
      });

    }


    const user = result.rows[0];


    // Compare entered password with hashed password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );


    // Password is incorrect
    if (!passwordMatch) {

      return res.status(401).json({
        message: "Invalid email or password.",
      });

    }


    // Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );


    // Successful login
    res.json({
      message: "Login successful!",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    console.error("Login error:", error);

    res.status(500).json({
      message: "Something went wrong while logging in.",
    });

  }

});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {

  console.log(
    `TalentIQ backend running on http://localhost:${PORT}`
  );

});