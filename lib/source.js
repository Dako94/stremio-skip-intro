const fetch = require("node-fetch");

// Qui usiamo la tua API key/hash per IntroHater
const INTRO_HATER_API = "https://intro-hater.example/api"; 
const API_KEY = "153dd04cc7a58e2155df63a89c45725640f81cdc5f3c96e6f15c351fe194ce44";

function isValidRange(start, end) {
  if (typeof start !== "number" || typeof end !== "number") return false;
  const dur = end - start;
  return start >= 0 && end > start && dur >= 5 && dur <= 180;
}

async function fetchIntroByEpisode(imdbId, season, episode) {
  const url = `${INTRO_HATER_API}/${imdbId}/${season}/${episode}?key=${API_KEY}`;
  try {
    const res = await fetch(url, { timeout: 5000 });
    if (!res.ok) return null;
    const data = await res.json();
    if (isValidRange(data.start, data.end)) {
      return { startSec: data.start, endSec: data.end, source: "introHater" };
    }
    return null;
  } catch (err) {
    console.error("Errore API IntroHater:", err);
    return null;
  }
}

module.exports = { fetchIntroByEpisode };
