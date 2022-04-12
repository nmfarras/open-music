/* eslint-disable camelcase */
const mapDBToModelPlaylist = ({
  id,
  name,
  owner,
}) => ({
  id,
  name,
  username: owner,
});

module.exports = { mapDBToModelPlaylist };
