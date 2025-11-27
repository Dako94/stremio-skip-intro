const { addonBuilder } = require("stremio-addon-sdk");
const { fetchIntroByEpisode } = require("./lib/source");

const manifest = {
  id: "org.stremio.skipintro",
  version: "1.0.0",
  name: "Skip Intro",
  description: "Mostra il pulsante Skip Intro, basandosi sul catalogo imdb",
  types: ["series"],
  catalogs: [],
  resources: ["stream"],
  idPrefixes: ["tt"]
};

const builder = new addonBuilder(manifest);

// Questo addon funge da “enhancer”: non fornisce lo stream,
// ma allega metadata introduttivi (introSkip) che la UI può usare.
builder.defineStreamHandler(async ({ id }) => {
  const [imdbId, seasonStr, episodeStr] = String(id).split(":");
  const season = Number(seasonStr);
  const episode = Number(episodeStr);

  const intro = await fetchIntroByEpisode(imdbId, season, episode);

  // Dummy stream per garantire l’iniezione di metadata (Stremio mostrerà altri stream reali in lista).
  const baseStream = {
    url: `magnet:?xt=urn:btih:SKIPINTRO-${imdbId}-${season}-${episode}`,
    title: "Skip Intro metadata",
    behaviorHints: { notHandled: true }
  };

  return Promise.resolve({
    streams: [{
      ...baseStream,
      introSkip: intro // { startSec, endSec, source } oppure null
    }]
  });
});

module.exports = builder.getInterface();
