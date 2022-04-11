/* eslint-disable camelcase */
const mapDBToModelPlaylist = ({
  id,
  name,
  title,
  owner,
}) => ({
  id,
  name,
  title,
  username: owner,
});

module.exports = { mapDBToModelPlaylist };
