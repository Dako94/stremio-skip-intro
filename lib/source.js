const fetch = require("node-fetch");

const MIRROR_BASE = process.env.SKIP_MIRROR_BASE || "https://raw.githubusercontent.com/your-org/skip-intro-db/main";

function isValidRange(start, end) {
  if (typeof start !== "number" || typeof end !== "number") return false;
  const dur = end - start;
  return start >= 0 && end > start && dur >= 5 && dur <= 180;
}

async function fetchJson(url) {
  try {
    const res = await fetch(url, { timeout: 5000 });
    if (!res.ok) return null;
    return await res.json();
  } catch (_) {
    return null;
  }
}

// Episodio specifico -> regola stagione -> null
async function fetchIntroByEpisode(imdbId, season, episode) {
  const epUrl = `${MIRROR_BASE}/${imdbId}/${season}/${episode}.json`;
  const dataEp = await fetchJson(epUrl);
  if (dataEp && isValidRange(dataEp.start, dataEp.end)) {
    return { startSec: dataEp.start, endSec: dataEp.end, source: "mirror-episode" };
  }

  const seasonUrl = `${MIRROR_BASE}/${imdbId}/season.json`;
  const seasonRules = await fetchJson(seasonUrl);
  const rule = seasonRules?.[String(season)];
  if (rule && isValidRange(rule.start, rule.end)) {
    return { startSec: rule.start, endSec: rule.end, source: "mirror-season" };
  }

  return null;
}

module.exports = { fetchIntroByEpisode };
