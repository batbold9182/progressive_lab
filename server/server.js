// server/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// ===== Middleware =====
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== MongoDB Connection =====
mongoose.connect("mongodb://127.0.0.1:27017/progressive_lab");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "❌ MongoDB connection error:"));
db.once("open", () => console.log("✅ Connected to MongoDB!"));

// ===== Schema =====
const PhotoSchema = new mongoose.Schema({
  lat: Number,
  lon: Number,
  imageUrl: String,
  timestamp: { type: String, default: () => new Date().toISOString() },
});

const Photo = mongoose.model("Photo", PhotoSchema);

// ===== Routes =====

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Upload photo
app.post("/upload", async (req, res) => {
  try {
    const { lat, lon, image } = req.body;

    const uploadsDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

    const filename = `photo_${Date.now()}.png`;
    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, image.replace(/^data:image\/png;base64,/, ""), "base64");

    const newPhoto = new Photo({
      lat,
      lon,
      imageUrl: `http://localhost:${PORT}/uploads/${filename}`,
    });

    await newPhoto.save();
    res.json({ success: true, entry: newPhoto });
  } catch (err) {
    console.error("❌ Error saving photo:", err);
    res.status(500).json({ success: false });
  }
});

// Get all photos
app.get("/photos", async (req, res) => {
  try {
    const photos = await Photo.find().sort({ _id: -1 });
    res.json(photos);
  } catch (err) {
    console.error("❌ Error loading photos:", err);
    res.status(500).json({ success: false });
  }
});

// ===== Start Server =====
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
