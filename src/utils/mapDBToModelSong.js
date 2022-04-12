/* eslint-disable camelcase */
const mapDBToModelSong = ({
  id,
  year,
  title,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  year,
  title,
  performer,
  genre,
  duration,
  albumId: album_id,
});

module.exports = { mapDBToModelSong };
