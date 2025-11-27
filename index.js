const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

// Directory con i file JSON dei timestamp
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");

// La tua API key IntroHater
const API_KEY = "153dd04cc7a58e2155df63a89c45725640f81cdc5f3c96e6f15c351fe194ce44";

function isValidRange(start, end) {
  if (typeof start !== "number" || typeof end !== "number") return false;
  const dur = end - start;
  return start >= 0 && end > start && dur >= 5 && dur <= 180;
}

function readJson(filePath) {
  try {
    const txt = fs.readFileSync(filePath, "utf8");
    return JSON.parse(txt);
  } catch (_) {
    return null;
  }
}

// Endpoint: /:imdbId/:season/:episode?key=API_KEY
app.get("/:imdbId/:season/:episode", (req, res) => {
  const { imdbId, season, episode } = req.params;
  const { key } = req.query;

  // Controllo chiave
  if (key !== API_KEY) {
    return res.status(403).json({ error: "invalid_key" });
  }

  // File episodio
  const epFile = path.join(DATA_DIR, imdbId, String(season), `${episode}.json`);
  const epData = readJson(epFile);
  if (epData && isValidRange(epData.start, epData.end)) {
    return res.json({ start: epData.start, end: epData.end, source: "episode" });
  }

  // Fallback regola di stagione
  const seasonFile = path.join(DATA_DIR, imdbId, "season.json");
  const seasonData = readJson(seasonFile);
  const rule = seasonData?.[String(season)];
  if (rule && isValidRange(rule.start, rule.end)) {
    return res.json({ start: rule.start, end: rule.end, source: "season" });
  }

  return res.status(404).json({ error: "not_found" });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Skip Intro API running on port ${port}`));
