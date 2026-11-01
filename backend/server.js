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

// ==================== POSTGRESQL CONNECTION ====================

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// ==================== MIDDLEWARE ====================

app.use(cors());
app.use(express.json());

// ==================== PDF UPLOAD CONFIGURATION ====================

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

// ==================== JWT AUTHENTICATION ====================

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({
      message: "Please log in to use TalentIQ.",
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

// ==================== HOME ROUTE ====================

app.get("/", (req, res) => {
  res.json({
    message: "TalentIQ API is running successfully",
  });
});

// ==================== DATABASE TEST ROUTE ====================

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    return res.json({
      message: "PostgreSQL connected successfully",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    return res.status(500).json({
      message: "Database connection failed",
    });
  }
});

// ==================== REGISTER ====================

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email, and password are required.",
    });
  }

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
      [name, email, hashedPassword, role || "user"]
    );

    return res.status(201).json({
      message: "Account created successfully!",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Something went wrong while creating the account.",
    });
  }
});

// ==================== LOGIN ====================

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }

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

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured in the .env file.");
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

    return res.json({
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

    return res.status(500).json({
      message: "Something went wrong while logging in.",
    });
  }
});

// ==================== RECOGNIZED SKILLS ====================

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

// ==================== RESUME ANALYSIS ====================

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

      // Validate the actual PDF signature.
      if (req.file.buffer.subarray(0, 5).toString() !== "%PDF-") {
        return res.status(400).json({
          message: "The uploaded file is not a valid PDF.",
        });
      }

      // Extract text from the PDF.
      const pdfData = await pdfParse(req.file.buffer);
      const extractedText = pdfData.text.trim();

      if (!extractedText) {
        return res.status(422).json({
          message:
            "No readable text was found. The PDF may be scanned or image-based.",
        });
      }

      // Normalize text to simplify matching.
      const normalizedText = extractedText
        .toLowerCase()
        .replace(/\s+/g, " ");

      // Detect skills using keyword matching.
      const detectedSkills = SKILL_KEYWORDS.filter((skill) => {
        const normalizedSkill = skill.toLowerCase();

        // Match C without matching it inside other words.
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

        // Match complete words or phrases.
        const pattern = new RegExp(
          `(^|[^a-z0-9])${escapedSkill}(?=$|[^a-z0-9])`,
          "i"
        );

        return pattern.test(normalizedText);
      });

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

// ==================== LEARNING PROGRESS: GET ====================

app.get(
  "/api/learning-progress",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.id;

      const result = await pool.query(
        `SELECT skill, status
         FROM learning_progress
         WHERE user_id = $1
         ORDER BY skill`,
        [userId]
      );

      return res.json({
        progress: result.rows,
      });
    } catch (error) {
      console.error("Fetch learning progress error:", error);

      return res.status(500).json({
        message: "Failed to fetch learning progress.",
      });
    }
  }
);

// ==================== LEARNING PROGRESS: SAVE / UPDATE ====================

app.put(
  "/api/learning-progress",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { skill, status } = req.body;

      const allowedStatuses = [
        "Not Started",
        "In Progress",
        "Completed",
      ];

      if (
        typeof skill !== "string" ||
        !skill.trim() ||
        skill.trim().length > 100 ||
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          message: "Please provide a valid skill and learning status.",
        });
      }

      const result = await pool.query(
        `INSERT INTO learning_progress
           (user_id, skill, status, updated_at)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
         ON CONFLICT (user_id, skill)
         DO UPDATE SET
           status = EXCLUDED.status,
           updated_at = CURRENT_TIMESTAMP
         RETURNING skill, status, updated_at`,
        [userId, skill.trim(), status]
      );

      return res.json({
        message: "Learning progress saved successfully.",
        progress: result.rows[0],
      });
    } catch (error) {
      console.error("Save learning progress error:", error);

      return res.status(500).json({
        message: "Failed to save learning progress.",
      });
    }
  }
);

// ==================== UPLOAD ERROR HANDLER ====================

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "The resume must be 50 MB or smaller."
        : "The upload was rejected. Please upload one PDF at a time.";

    return res.status(400).json({ message });
  }

  if (error.message === "Only PDF resume files are allowed.") {
    return res.status(400).json({
      message: error.message,
    });
  }

  console.error("Server error:", error);

  return res.status(500).json({
    message: "An unexpected server error occurred.",
  });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`TalentIQ backend running on http://localhost:${PORT}`);
});