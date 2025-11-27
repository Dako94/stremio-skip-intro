const fetch = require("node-fetch");

// Configurabile: endpoint/mirror pubblico del DB Intro Hater:
// Esempi possibili: un Firebase Function, un reverse-proxy, o un JSON API mirror.
// Formato atteso di risposta: { start: <number>, end: <number> }
const INTRO_HATER_API = process.env.INTRO_HATER_API_BASE; // es. "https://your-mirror.example/api"

function isValidRange(start, end) {
  if (typeof start !== "number" || typeof end !== "number") return false;
  const dur = end - start;
  return start >= 0 && end > start && dur >= 5 && dur <= 180;
}

async function fetchIntroHater(imdbId, season, episode) {
  if (!INTRO_HATER_API) return null;
  const url = `${INTRO_HATER_API}/${imdbId}/${season}/${episode}`;
  try {
    const res = await fetch(url, { timeout: 5000 });
    if (!res.ok) return null;
    const data = await res.json();
    if (isValidRange(data?.start, data?.end)) {
      return { startSec: data.start, endSec: data.end, source: "introHater" };
    }
    return null;
  } catch (_) {
    return null;
  }
}

module.exports = { fetchIntroHater };
