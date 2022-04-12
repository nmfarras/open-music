/* eslint-disable camelcase */
const mapDBToModelSongPlaylistActivity = ({
  id,
  playlist_id,
  username,
  title,
  action,
  time,
}) => ({
  id,
  playlistId: playlist_id,
  username,
  title,
  action,
  time,
});

module.exports = { mapDBToModelSongPlaylistActivity };
