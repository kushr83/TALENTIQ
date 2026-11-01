import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api";

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
  "Docker",
  "Kubernetes",
  "AWS",
  "Nginx",
  "Communication",
  "Problem Solving",
  "System Design",
  "Jenkins",
  "Android Studio",
  "DevOps",
];

const LEARNING_RECOMMENDATIONS = {
  Python: {
    topic: "Python fundamentals",
    practice: "Practice functions, lists, dictionaries, and file handling.",
    project: "Build a student marks analysis tool.",
  },
  SQL: {
    topic: "SQL and database queries",
    practice: "Practice JOINs, GROUP BY, subqueries, and aggregate functions.",
    project: "Build a searchable student database.",
  },
  "Machine Learning": {
    topic: "Machine Learning fundamentals",
    practice: "Learn train-test splits, classification, regression, and evaluation metrics.",
    project: "Build a house-price prediction model.",
  },
  "Artificial Intelligence": {
    topic: "Artificial Intelligence basics",
    practice: "Study search algorithms, problem-solving methods, and intelligent agents.",
    project: "Build a pathfinding solver.",
  },
  "Data Analysis": {
    topic: "Data analysis",
    practice: "Learn data cleaning, exploratory analysis, and visualization.",
    project: "Analyze a public dataset and create a report.",
  },
  NumPy: {
    topic: "NumPy",
    practice: "Practice arrays, indexing, vectorized operations, and matrices.",
    project: "Create a numerical analysis notebook.",
  },
  Pandas: {
    topic: "Pandas",
    practice: "Practice DataFrames, filtering, missing values, and grouping.",
    project: "Clean and analyze a CSV dataset.",
  },
  "Scikit-learn": {
    topic: "Scikit-learn",
    practice: "Learn preprocessing, pipelines, model training, and evaluation.",
    project: "Train and compare two classification models.",
  },
  "Data Structures": {
    topic: "Data Structures",
    practice: "Practice arrays, linked lists, stacks, queues, trees, and hash maps.",
    project: "Build a contact manager using suitable data structures.",
  },
  Algorithms: {
    topic: "Algorithms",
    practice: "Practice searching, sorting, recursion, and time complexity.",
    project: "Compare sorting algorithms on different input sizes.",
  },
  OOP: {
    topic: "Object-Oriented Programming",
    practice: "Practice classes, objects, inheritance, polymorphism, and encapsulation.",
    project: "Build a library management application.",
  },
  "REST API": {
    topic: "REST API development",
    practice: "Learn HTTP methods, status codes, routing, and request validation.",
    project: "Build a CRUD API for managing tasks.",
  },
  Flask: {
    topic: "Flask web development",
    practice: "Learn routes, request handling, and API responses.",
    project: "Create a Flask API for an ML model.",
  },
  Git: {
    topic: "Git version control",
    practice: "Practice commits, branches, merges, and resolving conflicts.",
    project: "Maintain a project with a clean Git history.",
  },
  GitHub: {
    topic: "GitHub collaboration",
    practice: "Learn repositories, README files, issues, and pull requests.",
    project: "Publish a project with setup instructions.",
  },
  Docker: {
    topic: "Docker fundamentals",
    practice: "Learn images, containers, Dockerfiles, and port mapping.",
    project: "Containerize a small web application.",
  },
  AWS: {
    topic: "AWS fundamentals",
    practice: "Understand IAM, compute, storage, and cloud deployment.",
    project: "Deploy a small application using an AWS service.",
  },
  Communication: {
    topic: "Technical communication",
    practice: "Practice explaining technical decisions clearly.",
    project: "Record a walkthrough of one of your projects.",
  },
  "Problem Solving": {
    topic: "Problem-solving skills",
    practice: "Solve coding problems and explain your approach and complexity.",
    project: "Maintain a collection of solved problems with explanations.",
  },
  Java: {
    topic: "Java programming",
    practice: "Practice classes, collections, exceptions, and file handling.",
    project: "Build a student management application.",
  },
  "C++": {
    topic: "C++ programming",
    practice: "Practice STL, classes, pointers, and problem-solving.",
    project: "Build a console-based inventory manager.",
  },
  React: {
    topic: "React development",
    practice: "Practice components, props, state, hooks, and routing.",
    project: "Build a responsive task management interface.",
  },
  "Node.js": {
    topic: "Node.js backend development",
    practice: "Learn modules, asynchronous programming, and API development.",
    project: "Build a REST API for a task manager.",
  },
  PostgreSQL: {
    topic: "PostgreSQL",
    practice: "Practice joins, constraints, indexes, and transactions.",
    project: "Build a relational database for a small application.",
  },
  MongoDB: {
    topic: "MongoDB",
    practice: "Practice documents, queries, indexes, and aggregation.",
    project: "Build a product catalogue API.",
  },
  Linux: {
    topic: "Linux fundamentals",
    practice: "Practice shell commands, permissions, processes, and files.",
    project: "Write shell scripts to automate routine tasks.",
  },
  "Deep Learning": {
    topic: "Deep Learning",
    practice: "Learn neural networks, loss functions, optimization, and evaluation.",
    project: "Train a small image classification model.",
  },
  "Natural Language Processing": {
    topic: "Natural Language Processing",
    practice: "Study tokenization, text preprocessing, and text classification.",
    project: "Build a simple sentiment analysis model.",
  },
  Statistics: {
    topic: "Statistics",
    practice: "Practice probability, distributions, hypothesis testing, and correlation.",
    project: "Analyze a dataset using descriptive statistics.",
  },
  TensorFlow: {
    topic: "TensorFlow",
    practice: "Learn tensors, model construction, training, and evaluation.",
    project: "Train a basic neural network.",
  },
  PyTorch: {
    topic: "PyTorch",
    practice: "Practice tensors, autograd, model training, and evaluation.",
    project: "Build an image classification model.",
  },
  "System Design": {
    topic: "System design fundamentals",
    practice: "Study APIs, caching, databases, scalability, and reliability.",
    project: "Design a URL-shortening service.",
  },
  HTML: {
    topic: "HTML fundamentals",
    practice: "Practice semantic elements, forms, and accessible page structure.",
    project: "Build a structured personal portfolio.",
  },
  CSS: {
    topic: "CSS fundamentals",
    practice: "Practice Flexbox, Grid, responsive design, and accessibility.",
    project: "Create a responsive portfolio page.",
  },
};

const LEARNING_RESOURCES = {
  Python: {
    label: "Python Official Tutorial",
    url: "https://docs.python.org/3/tutorial/",
  },
  SQL: {
    label: "SQL Tutorial",
    url: "https://www.w3schools.com/sql/",
  },
  "Machine Learning": {
    label: "Google Machine Learning Crash Course",
    url: "https://developers.google.com/machine-learning/crash-course",
  },
  "Artificial Intelligence": {
    label: "CS50 Introduction to AI",
    url: "https://cs50.harvard.edu/ai/",
  },
  NumPy: {
    label: "NumPy Quickstart",
    url: "https://numpy.org/doc/stable/user/quickstart.html",
  },
  Pandas: {
    label: "Pandas Getting Started",
    url: "https://pandas.pydata.org/docs/getting_started/",
  },
  "Scikit-learn": {
    label: "Scikit-learn Tutorials",
    url: "https://scikit-learn.org/stable/tutorial/",
  },
  "Data Structures": {
    label: "Data Structures",
    url: "https://www.geeksforgeeks.org/data-structures/",
  },
  Algorithms: {
    label: "VisuAlgo",
    url: "https://visualgo.net/en",
  },
  OOP: {
    label: "Object-Oriented Programming",
    url: "https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/tutorials/oop",
  },
  "REST API": {
    label: "MDN HTTP Overview",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
  },
  Flask: {
    label: "Flask Documentation",
    url: "https://flask.palletsprojects.com/en/stable/tutorial/",
  },
  Git: {
    label: "Pro Git Book",
    url: "https://git-scm.com/book/en/v2",
  },
  GitHub: {
    label: "GitHub Skills",
    url: "https://skills.github.com/",
  },
  Docker: {
    label: "Docker Get Started",
    url: "https://docs.docker.com/get-started/",
  },
  AWS: {
    label: "AWS Skill Builder",
    url: "https://skillbuilder.aws/",
  },
  Communication: {
    label: "Communication Skills Courses",
    url: "https://www.coursera.org/courses?query=communication%20skills",
  },
  "Problem Solving": {
    label: "HackerRank Algorithms",
    url: "https://www.hackerrank.com/domains/algorithms",
  },
  Java: {
    label: "Java Documentation",
    url: "https://dev.java/learn/",
  },
  "C++": {
    label: "C++ Reference",
    url: "https://en.cppreference.com/w/",
  },
  React: {
    label: "React Documentation",
    url: "https://react.dev/learn",
  },
  "Node.js": {
    label: "Node.js Documentation",
    url: "https://nodejs.org/en/learn",
  },
  PostgreSQL: {
    label: "PostgreSQL Documentation",
    url: "https://www.postgresql.org/docs/",
  },
  MongoDB: {
    label: "MongoDB University",
    url: "https://learn.mongodb.com/",
  },
  Linux: {
    label: "Linux Journey",
    url: "https://linuxjourney.com/",
  },
  "Deep Learning": {
    label: "Deep Learning Specialization Resources",
    url: "https://www.deeplearning.ai/",
  },
  "Natural Language Processing": {
    label: "Hugging Face NLP Course",
    url: "https://huggingface.co/learn/nlp-course",
  },
  TensorFlow: {
    label: "TensorFlow Tutorials",
    url: "https://www.tensorflow.org/tutorials",
  },
  PyTorch: {
    label: "PyTorch Tutorials",
    url: "https://pytorch.org/tutorials/",
  },
  HTML: {
    label: "MDN HTML Guide",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",
  },
  CSS: {
    label: "MDN CSS Guide",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics",
  },
};

const DEFAULT_RECOMMENDATION = {
  topic: "Build practical familiarity",
  practice: "Read the official documentation and complete a beginner tutorial.",
  project: "Build a small project demonstrating this skill.",
};

const DEFAULT_RESOURCE = {
  label: "Find learning resources",
  url: "https://www.freecodecamp.org/learn/",
};

const VALID_PROGRESS_STATUSES = [
  "Not Started",
  "In Progress",
  "Completed",
];

// Matches whole skill names while avoiding matches inside unrelated words.
function containsSkill(text, skill) {
  const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // C and C++ need separate handling because + is a meaningful character.
  if (skill === "C") {
    return /(^|[^a-z0-9+#])c(?=$|[^a-z0-9+#])/i.test(text);
  }

  const pattern = new RegExp(
    `(^|[^a-z0-9+#])${escaped}(?=$|[^a-z0-9+#])`,
    "i"
  );

  return pattern.test(text);
}

function findSkills(text) {
  const normalizedText = text.toLowerCase().replace(/\s+/g, " ");

  return SKILL_KEYWORDS.filter((skill) =>
    containsSkill(normalizedText, skill.toLowerCase())
  );
}

function getToken() {
  return localStorage.getItem("token");
}

async function readJsonResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      `The server returned an unexpected response (${response.status}).`
    );
  }

  return response.json();
}

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resume, setResume] = useState(null);

  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState(null);

  const [learningProgress, setLearningProgress] = useState({});
  const [progressLoading, setProgressLoading] = useState(true);
  const [savingSkills, setSavingSkills] = useState({});
  const [progressMessage, setProgressMessage] = useState("");
  const [progressError, setProgressError] = useState(false);

  // Load the logged-in user's saved learning progress.
  useEffect(() => {
    let cancelled = false;

    async function fetchLearningProgress() {
      const token = getToken();

      if (!token) {
        if (!cancelled) {
          setProgressMessage("Log in to load and save learning progress.");
          setProgressError(true);
          setProgressLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/learning-progress`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await readJsonResponse(response);

        if (!response.ok) {
          throw new Error(
            data.message || "Could not load learning progress."
          );
        }

        if (!Array.isArray(data.progress)) {
          throw new Error("The server returned an invalid progress response.");
        }

        const savedProgress = {};

        data.progress.forEach((item) => {
          if (
            typeof item.skill === "string" &&
            VALID_PROGRESS_STATUSES.includes(item.status)
          ) {
            savedProgress[item.skill] = item.status;
          }
        });

        if (!cancelled) {
          setLearningProgress(savedProgress);
          setProgressMessage("");
          setProgressError(false);
        }
      } catch (error) {
        console.error("Load learning progress error:", error);

        if (!cancelled) {
          setProgressMessage(
            error.message || "Could not load saved learning progress."
          );
          setProgressError(true);
        }
      } finally {
        if (!cancelled) {
          setProgressLoading(false);
        }
      }
    }

    fetchLearningProgress();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    setFile(null);
    setResume(null);
    setMatchResult(null);
    setMessage("");

    if (!selectedFile) return;

    if (
      selectedFile.type !== "application/pdf" ||
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setMessage("Please select a valid PDF file.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setMessage("Your PDF must be 50 MB or smaller.");
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage("Please select a PDF resume first.");
      return;
    }

    const token = getToken();

    if (!token) {
      setMessage("Please log in before uploading your resume.");
      return;
    }

    setLoading(true);
    setMessage("");
    setResume(null);
    setMatchResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch(`${API_BASE_URL}/resume/analyze`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.message || "Unable to analyze your resume.");
      }

      if (!data.resume || !Array.isArray(data.resume.skills)) {
        throw new Error("The server returned an invalid resume analysis.");
      }

      setResume(data.resume);
      setMessage(data.message || "Resume analyzed successfully.");
    } catch (error) {
      console.error("Resume upload error:", error);
      setMessage(error.message || "Unable to analyze your resume.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate the keyword-based match and show exactly how it was derived.
  const handleJobMatch = (event) => {
    event.preventDefault();
    setMatchResult(null);
    setMessage("");

    if (!resume) {
      setMessage("Analyze your resume before matching a job description.");
      return;
    }

    const description = jobDescription.trim();

    if (!description) {
      setMessage("Please paste a job description.");
      return;
    }

    if (description.length < 30) {
      setMessage(
        "Please enter a more complete job description so its skills can be identified."
      );
      return;
    }

    const requiredSkills = findSkills(description);

    if (requiredSkills.length === 0) {
      setMessage(
        "No recognized skills were found. Try a description mentioning skills such as C++, Python, SQL, React, or AWS."
      );
      return;
    }

    const resumeSkills = new Set(
      resume.skills.map((skill) => skill.toLowerCase())
    );

    const matchedSkills = requiredSkills.filter((skill) =>
      resumeSkills.has(skill.toLowerCase())
    );

    const missingSkills = requiredSkills.filter(
      (skill) => !resumeSkills.has(skill.toLowerCase())
    );

    const percentage = Math.round(
      (matchedSkills.length / requiredSkills.length) * 100
    );

    setMatchResult({
      requiredSkills,
      matchedSkills,
      missingSkills,
      percentage,
      descriptionLength: description.length,
    });
  };

  const completedMissingSkills = useMemo(() => {
    if (!matchResult) return 0;

    return matchResult.missingSkills.filter(
      (skill) => learningProgress[skill] === "Completed"
    ).length;
  }, [matchResult, learningProgress]);

  const learningCompletion = useMemo(() => {
    if (!matchResult || matchResult.missingSkills.length === 0) {
      return 0;
    }

    return Math.round(
      (completedMissingSkills / matchResult.missingSkills.length) * 100
    );
  }, [matchResult, completedMissingSkills]);

  const handleProgressChange = async (skill, status) => {
    const token = getToken();

    if (!token) {
      setProgressMessage("Please log in to save learning progress.");
      setProgressError(true);
      return;
    }

    if (!VALID_PROGRESS_STATUSES.includes(status)) {
      setProgressMessage("Please select a valid learning status.");
      setProgressError(true);
      return;
    }

    const previousStatus = learningProgress[skill];

    // Update the UI immediately, then save to PostgreSQL.
    setLearningProgress((previous) => ({
      ...previous,
      [skill]: status,
    }));

    setSavingSkills((previous) => ({
      ...previous,
      [skill]: true,
    }));

    setProgressMessage("");
    setProgressError(false);

    try {
      const response = await fetch(`${API_BASE_URL}/learning-progress`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ skill, status }),
      });

      const data = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.message || "Could not save learning progress.");
      }

      if (
        data.progress &&
        data.progress.skill &&
        data.progress.status
      ) {
        setLearningProgress((previous) => ({
          ...previous,
          [data.progress.skill]: data.progress.status,
        }));
      }

      setProgressMessage(`Saved learning status for ${skill}.`);
      setProgressError(false);
    } catch (error) {
      console.error("Save learning progress error:", error);

      // Roll back the UI only if this request is still the latest one
      // for this skill; avoid replacing a newer user selection.
      setLearningProgress((previous) => {
        if (previous[skill] !== status) {
          return previous;
        }

        const updated = { ...previous };

        if (previousStatus === undefined) {
          delete updated[skill];
        } else {
          updated[skill] = previousStatus;
        }

        return updated;
      });

      setProgressMessage(
        error.message || "Could not save progress. Please try again."
      );
      setProgressError(true);
    } finally {
      setSavingSkills((previous) => ({
        ...previous,
        [skill]: false,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between border-b border-slate-800 px-6 py-5 md:px-10">
        <Link to="/" className="text-2xl font-bold">
          Talent<span className="text-blue-500">IQ</span>
        </Link>

        <Link
          to="/dashboard"
          className="text-slate-300 transition hover:text-white"
        >
          Back to Dashboard
        </Link>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <p className="mb-3 text-blue-400">RESUME INTELLIGENCE</p>

        <h1 className="text-3xl font-bold md:text-4xl">
          Understand your resume
        </h1>

        <p className="mb-8 mt-3 text-slate-400">
          Analyze your PDF resume, compare it with a job description, and
          identify skills to develop.
        </p>

        {/* Resume upload */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
          <h2 className="mb-5 text-xl font-semibold">Upload your resume</h2>

          <form onSubmit={handleUpload}>
            <label
              htmlFor="resume"
              className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-500/60 bg-slate-950 px-6 py-8 text-center transition hover:border-blue-400 hover:bg-blue-500/5"
            >
              <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/15 text-blue-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 16V4" />
                  <path d="m7 9 5-5 5 5" />
                  <path d="M20 16.5v2A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-2" />
                </svg>
              </span>

              <span className="text-lg font-semibold">
                Upload Resume PDF
              </span>

              <span className="mt-2 text-sm text-slate-400">
                Click here to browse files on your device
              </span>

              <span className="mt-1 text-xs text-slate-500">
                PDF format · Maximum 50 MB
              </span>
            </label>

            <input
              id="resume"
              name="resume"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="sr-only"
            />

            {file && (
              <p className="mt-3 break-words text-sm text-slate-400">
                Selected: {file.name}
              </p>
            )}

            <button
              type="submit"
              disabled={!file || loading}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>
          </form>

          {message && (
            <p role="status" aria-live="polite" className="mt-5 text-sm text-blue-300">
              {message}
            </p>
          )}
        </section>

        {resume && (
          <>
            {/* Resume analysis results */}
            <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
              <h2 className="text-2xl font-semibold">
                Resume Analysis Results
              </h2>

              <div className="my-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">File</p>
                  <p className="mt-2 break-words">{resume.fileName}</p>
                </div>

                <div className="rounded-lg bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">Pages</p>
                  <p className="mt-2 text-2xl font-bold">{resume.pages}</p>
                </div>

                <div className="rounded-lg bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">Characters</p>
                  <p className="mt-2 text-2xl font-bold">
                    {resume.characterCount}
                  </p>
                </div>
              </div>

              <h3 className="mb-3 text-lg font-semibold">
                Detected Skills (
                {resume.skillsFound ?? resume.skills.length})
              </h3>

              {resume.skills.length > 0 ? (
                <div className="mb-4 flex flex-wrap gap-2">
                  {resume.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mb-4 text-sm text-slate-400">
                  No recognized skills were found in this resume.
                </p>
              )}

              <p className="text-xs text-slate-500">
                Keyword detection identifies mentioned skills; it does not
                verify proficiency or experience.
              </p>

              <details className="mt-8">
                <summary className="cursor-pointer font-semibold text-slate-200 hover:text-blue-300">
                  View extracted resume text
                </summary>

                <pre className="mt-4 max-h-[400px] overflow-y-auto whitespace-pre-wrap break-words rounded-xl border border-slate-800 bg-slate-950 p-5 text-sm leading-7 text-slate-300">
                  {resume.text}
                </pre>
              </details>
            </section>

            {/* Job description matching */}
            <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
              <p className="mb-2 text-sm text-blue-400">CAREER INTELLIGENCE</p>

              <h2 className="text-2xl font-semibold">
                Job Description Matching
              </h2>

              <p className="mb-5 mt-3 text-sm text-slate-400">
                Compare recognized skills in your resume with those mentioned
                in a job description.
              </p>

              <form onSubmit={handleJobMatch}>
                <label
                  htmlFor="jobDescription"
                  className="mb-3 block text-sm text-slate-300"
                >
                  Paste job description
                </label>

                <textarea
                  id="jobDescription"
                  rows={8}
                  maxLength={20000}
                  value={jobDescription}
                  onChange={(event) => {
                    setJobDescription(event.target.value);
                    setMatchResult(null);
                  }}
                  placeholder="Paste the job responsibilities, qualifications, and technical skills here..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                />

                <div className="mt-2 flex justify-between gap-3 text-xs text-slate-500">
                  <span>Maximum 20,000 characters</span>
                  <span>{jobDescription.length}/20,000</span>
                </div>

                <button
                  type="submit"
                  className="mt-5 rounded-lg bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-700"
                >
                  Calculate Skill Match
                </button>
              </form>

              {matchResult && (
                <div className="mt-8">
                  {/* Match score */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 md:p-6">
                    <p className="text-sm text-slate-400">
                      Keyword-based skill match
                    </p>

                    <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
                      <p className="text-5xl font-bold text-blue-400">
                        {matchResult.percentage}%
                      </p>

                      <p className="text-sm text-slate-400">
                        {matchResult.matchedSkills.length} of{" "}
                        {matchResult.requiredSkills.length} recognized skills
                        matched
                      </p>
                    </div>

                    <div
                      className="mt-5 h-3 w-full overflow-hidden rounded-full bg-slate-800"
                      role="progressbar"
                      aria-label="Keyword-based skill match percentage"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={matchResult.percentage}
                    >
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${matchResult.percentage}%` }}
                      />
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-lg bg-slate-900 p-4">
                        <p className="text-xs text-slate-400">Recognized</p>
                        <p className="mt-1 text-2xl font-semibold">
                          {matchResult.requiredSkills.length}
                        </p>
                      </div>

                      <div className="rounded-lg bg-slate-900 p-4">
                        <p className="text-xs text-green-400">Matched</p>
                        <p className="mt-1 text-2xl font-semibold text-green-300">
                          {matchResult.matchedSkills.length}
                        </p>
                      </div>

                      <div className="rounded-lg bg-slate-900 p-4">
                        <p className="text-xs text-amber-400">Missing</p>
                        <p className="mt-1 text-2xl font-semibold text-amber-300">
                          {matchResult.missingSkills.length}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-lg border border-slate-800 p-4">
                      <h3 className="font-medium">How the score is calculated</h3>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Matched recognized skills ÷ all recognized skills in
                        the job description × 100. Each recognized skill counts
                        equally. This does not measure experience, proficiency,
                        semantic similarity, or the importance of individual
                        requirements.
                      </p>

                      <p className="mt-3 text-sm font-medium text-slate-300">
                        {matchResult.matchedSkills.length} ÷{" "}
                        {matchResult.requiredSkills.length} × 100 ={" "}
                        {matchResult.percentage}%
                      </p>
                    </div>
                  </div>

                  {/* Matched and missing skills */}
                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <div className="rounded-xl border border-green-800/50 bg-slate-950 p-5">
                      <h3 className="mb-4 font-semibold text-green-400">
                        Matched Skills ({matchResult.matchedSkills.length})
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {matchResult.matchedSkills.length > 0 ? (
                          matchResult.matchedSkills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-300"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-slate-400">
                            No recognized skills matched.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-amber-800/50 bg-slate-950 p-5">
                      <h3 className="mb-4 font-semibold text-amber-400">
                        Missing Skills ({matchResult.missingSkills.length})
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {matchResult.missingSkills.length > 0 ? (
                          matchResult.missingSkills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-300"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-slate-400">
                            All recognized skills in this description were
                            found in the resume.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Learning roadmap */}
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold">
                      Your Learning Roadmap
                    </h3>

                    <p className="mb-5 mt-2 text-sm text-slate-400">
                      Suggested practice and projects for recognized skills
                      that were not detected in your resume.
                    </p>

                    <div className="mb-6 rounded-xl border border-slate-800 bg-slate-950 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-slate-300">
                          Missing skills completed
                        </span>

                        <span className="font-semibold text-blue-400">
                          {learningCompletion}%
                        </span>
                      </div>

                      <div
                        className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-800"
                        role="progressbar"
                        aria-label="Learning roadmap completion"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={learningCompletion}
                      >
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${learningCompletion}%` }}
                        />
                      </div>

                      <p className="mt-2 text-xs text-slate-400">
                        {completedMissingSkills} of{" "}
                        {matchResult.missingSkills.length} missing skills
                        marked Completed
                      </p>
                    </div>

                    {progressLoading && (
                      <p role="status" className="mb-4 text-sm text-slate-400">
                        Loading saved learning progress...
                      </p>
                    )}

                    {!progressLoading && progressMessage && (
                      <p
                        role="status"
                        aria-live="polite"
                        className={`mb-4 text-sm ${
                          progressError ? "text-amber-300" : "text-green-300"
                        }`}
                      >
                        {progressMessage}
                      </p>
                    )}

                    {matchResult.missingSkills.length > 0 ? (
                      <div className="space-y-4">
                        {matchResult.missingSkills.map((skill, index) => {
                          const recommendation =
                            LEARNING_RECOMMENDATIONS[skill] ||
                            DEFAULT_RECOMMENDATION;

                          const resource =
                            LEARNING_RESOURCES[skill] || DEFAULT_RESOURCE;

                          const status =
                            learningProgress[skill] || "Not Started";

                          return (
                            <article
                              key={skill}
                              className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 font-semibold text-blue-300">
                                  {index + 1}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <h4 className="font-semibold text-white">
                                    {skill}
                                  </h4>

                                  <p className="mt-2 text-sm text-blue-300">
                                    Learn: {recommendation.topic}
                                  </p>

                                  <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 inline-flex items-center gap-2 text-sm text-blue-400 underline underline-offset-4 hover:text-blue-300"
                                  >
                                    {resource.label}
                                    <span aria-hidden="true">↗</span>
                                  </a>

                                  <p className="mt-3 text-sm text-slate-400">
                                    <span className="font-medium text-slate-300">
                                      Practice:
                                    </span>{" "}
                                    {recommendation.practice}
                                  </p>

                                  <p className="mt-2 text-sm text-slate-400">
                                    <span className="font-medium text-slate-300">
                                      Project:
                                    </span>{" "}
                                    {recommendation.project}
                                  </p>

                                  <div className="mt-4">
                                    <label
                                      htmlFor={`progress-${index}`}
                                      className="mb-2 block text-sm text-slate-300"
                                    >
                                      Learning status
                                    </label>

                                    <select
                                      id={`progress-${index}`}
                                      value={status}
                                      disabled={
                                        progressLoading ||
                                        Boolean(savingSkills[skill])
                                      }
                                      onChange={(event) =>
                                        handleProgressChange(
                                          skill,
                                          event.target.value
                                        )
                                      }
                                      className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm text-white focus:border-blue-500 focus:outline-none disabled:cursor-wait disabled:opacity-60"
                                    >
                                      {VALID_PROGRESS_STATUSES.map(
                                        (option) => (
                                          <option key={option} value={option}>
                                            {option}
                                          </option>
                                        )
                                      )}
                                    </select>

                                    {savingSkills[skill] && (
                                      <p
                                        role="status"
                                        className="mt-2 text-xs text-blue-300"
                                      >
                                        Saving progress...
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-green-800/50 bg-green-500/5 p-5">
                        <h4 className="font-semibold text-green-400">
                          No recognized skill gaps found
                        </h4>

                        <p className="mt-2 text-sm text-slate-400">
                          Your resume contains all the skills recognized in
                          this job description. Consider strengthening your
                          projects and practical experience.
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="mt-6 text-xs leading-5 text-slate-500">
                    TalentIQ currently uses keyword recognition. A skill may
                    be missed if it is described using different terminology.
                    This score is not an ATS score, a complete assessment of
                    candidate suitability, or a prediction of hiring success.
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default ResumeAnalyzer;