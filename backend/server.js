const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware
app.use(cors());
app.use(express.json());

// PDF upload configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, callback) => {
    if (
      file.mimetype !== "application/pdf" ||
      !file.originalname.toLowerCase().endsWith(".pdf")
    ) {
      return callback(
        new Error("Only PDF resume files are allowed.")
      );
    }

    callback(null, true);
  },
});

// JWT authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({
      message: "Please log in to use Resume Intelligence.",
    });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Your session is invalid or expired. Please log in again.",
    });
  }
}

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "TalentIQ API is running successfully",
  });
});

// Database test route
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

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful!",
      token,
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

// Skills TalentIQ can recognize
const SKILL_KEYWORDS = [
  "C++",
  "C",
  "Python",
  "Java",
  "JavaScript",
  "TypeScript",
  "HTML",
  "CSS",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "FastAPI",
  "Flask",
  "Django",
  "SQL",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "DuckDB",
  "Git",
  "GitHub",
  "GitHub Actions",
  "Linux",
  "Data Structures",
  "Algorithms",
  "OOP",
  "Machine Learning",
  "Deep Learning",
  "Artificial Intelligence",
  "Natural Language Processing",
  "Data Analysis",
  "Statistics",
  "TensorFlow",
  "PyTorch",
  "Scikit-learn",
  "NumPy",
  "Pandas",
  "REST API",
  "Full-Stack Development",
  "WebRTC",
  "Docker",
  "Kubernetes",
  "AWS",
  "Nginx",
  "CI/CD",
  "Communication",
  "Problem Solving",
  "System Design",
  "Jenkins",
  "Apache Kafka",
  "Groq API",
  "Android Studio",
  "DevOps",
];

// RESUME ANALYSIS
app.post(
  "/api/resume/analyze",
  authenticateToken,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Please select a PDF resume to upload.",
        });
      }

      // Validate the actual PDF signature
      if (req.file.buffer.subarray(0, 5).toString() !== "%PDF-") {
        return res.status(400).json({
          message: "The uploaded file is not a valid PDF.",
        });
      }

      // Extract text from the PDF
      const pdfData = await pdfParse(req.file.buffer);
      const extractedText = pdfData.text.trim();

      if (!extractedText) {
        return res.status(422).json({
          message:
            "No readable text was found. The PDF may be scanned or image-based.",
        });
      }

      // Normalize text to simplify matching
      const normalizedText = extractedText
        .toLowerCase()
        .replace(/\s+/g, " ");

      // Detect skills using keyword matching
      const detectedSkills = SKILL_KEYWORDS.filter((skill) => {
        const normalizedSkill = skill.toLowerCase();

        // Match C without matching it inside other words
        if (normalizedSkill === "c") {
          return /(^|[^a-z0-9])c($|[^a-z0-9+#])/i.test(
            normalizedText
          );
        }

        // Escape special characters such as + and .
        const escapedSkill = normalizedSkill.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );

        // Match complete words or phrases
        const pattern = new RegExp(
          `(^|[^a-z0-9])${escapedSkill}(?=$|[^a-z0-9])`,
          "i"
        );

        return pattern.test(normalizedText);
      });

      // Return analysis results to the frontend
      return res.json({
        message: "Resume analyzed successfully!",
        resume: {
          fileName: req.file.originalname,
          pages: pdfData.numpages,
          characterCount: extractedText.length,
          text: extractedText,
          skills: detectedSkills,
          skillsFound: detectedSkills.length,
        },
      });
    } catch (error) {
      console.error("Resume processing error:", error);

      return res.status(422).json({
        message:
          "Unable to read this PDF. Please try another valid PDF resume.",
      });
    }
  }
);

// Handle upload errors
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "The resume must be 50 MB or smaller."
        : "The upload was rejected. Please upload one PDF at a time.";

    return res.status(400).json({ message });
  }

  if (error.message === "Only PDF resume files are allowed.") {
    return res.status(400).json({ message: error.message });
  }

  console.error("Server error:", error);

  return res.status(500).json({
    message: "An unexpected server error occurred.",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`TalentIQ backend running on http://localhost:${PORT}`);
});