const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3001;
const FASTAPI_URL = "http://localhost:8000/analyze"; // FastAPI server URL

// Enable CORS and middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(morgan("dev"));

// Configure Multer for file uploads
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Root route to confirm server is running
app.get("/", (req, res) => {
  res.send("🚀 Node.js server is running! Use POST /upload to send an image.");
});

// ✅ Corrected Route for Uploads
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file received." });
    }
    if (!req.body.domain) {
      return res.status(400).json({ error: "Domain is required." });
    }

    // Prepare FormData for FastAPI
    const formData = new FormData();
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    formData.append("domain", req.body.domain);

    // Send request to FastAPI server
    const response = await axios.post(FASTAPI_URL, formData, {
      headers: { ...formData.getHeaders() },
      timeout: 30000,
    });

    res.json(response.data);
  } catch (error) {
    console.error("🚨 Server error:", error);
    if (error.response) {
      return res.status(error.response.status).json({ error: error.response.data });
    }
    res.status(500).json({ error: "FastAPI may be unreachable. Verify the server is running." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Node.js server is running at http://localhost:${PORT}`);
});
