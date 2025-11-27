const { addonBuilder } = require("stremio-addon-sdk");
const { fetchIntroByEpisode } = require("./lib/source");

const manifest = {
  id: "org.stremio.skipintro",
  version: "1.0.0",
  name: "Skip Intro",
  description: "Addon Stremio che usa IntroHater DB per mostrare pulsante Skip Intro",
  types: ["series"],
  catalogs: [],
  resources: ["stream"],
  idPrefixes: ["tt"]
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async ({ id }) => {
  // ID in formato "ttXXXXXXX:season:episode"
  const [imdbId, seasonStr, episodeStr] = String(id).split(":");
  const season = Number(seasonStr);
  const episode = Number(episodeStr);

  const intro = await fetchIntroByEpisode(imdbId, season, episode);

  const baseStream = {
    url: `magnet:?xt=urn:btih:SKIPINTRO-${id}`,
    title: "Skip Intro metadata",
    behaviorHints: { notHandled: true }
  };

  return {
    streams: [{
      ...baseStream,
      introSkip: intro // { startSec, endSec } oppure null
    }]
  };
});

module.exports = builder.getInterface();
