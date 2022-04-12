const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (server, {
    playlistSongActivitiesService, playlistSongsService, playlistsService, validator,
  }) => {
    const playlistSongsHandler = new PlaylistSongsHandler(
      playlistSongActivitiesService,
      playlistSongsService,
      playlistsService,
      validator,
    );
    server.route(routes(playlistSongsHandler));
  },
};
