/* eslint-disable camelcase */
const mapDBToModelSong = ({
  id,
  year,
  genre,
  performer,
  duration,
  album_id,
}) => ({
  id,
  year,
  genre,
  performer,
  duration,
  // albumId: album_id,
  album_id,
});

module.exports = { mapDBToModelSong };
