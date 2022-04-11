/* eslint-disable camelcase */
const mapDBToModelPlaylistSong = ({
  id,
  playlist_id,
  song_id,
}) => ({
  id,
  playlistId: playlist_id,
  songId: song_id,
});

module.exports = { mapDBToModelPlaylistSong };
