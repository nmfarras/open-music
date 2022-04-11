const routes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: handler.getPlaylistSongByPlaylistIdHandler,
    options: {
      auth: 'openmusicsapp_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: handler.postPlaylistSongByPlaylistIdHandler,
    options: {
      auth: 'openmusicsapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: handler.deletePlaylistSongByPlaylistIdHandler,
    options: {
      auth: 'openmusicsapp_jwt',
    },
  },
];

module.exports = routes;
