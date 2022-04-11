const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModelPlaylistSong } = require('../../utils/mapDBToModelPlaylistSong');

class PlaylistSongsService {
  constructor(songService) {
    this._pool = new Pool();
    this._songService = songService;
  }

  async getSongsInPlaylistById(id) {
    const query = {
      text: `SELECT playlists.*, users.username
          FROM playlists
          LEFT JOIN users ON users.id = playlists.owner
          WHERE playlists.id = $1`,
      values: [id],
    };
    // const query = {
    //   text: `SELECT playlists.*, users.username,
    //       json_args(s.id, s.title, s.performer) AS songs
    //       FROM playlists
    //       LEFT JOIN users ON users.id = playlists.owner
    //       WHERE playlists.id = $1`,
    //   values: [id],
    // };
    // const query = {
    //   text: `SELECT a.id, a.name, a.year,
    //   json_agg(s.*) AS songs
    //   FROM albums a LEFT JOIN songs s
    //   ON a.id=s.album_id GROUP BY a.id
    //   HAVING a.id = $1`,
    //   values: [id],
    // };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows.map(mapDBToModelPlaylistSong)[0];
  }

  async addPlaylistSong(playlistId, songId) {
    const id = nanoid(16);

    await this._songService.getSongById(songId);

    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }
    return result.rows[0].id;
  }

  async deletePlaylistSong(playlistId, songId) {
    await this._songService.getSongById(songId);

    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal dihapus dari playlist');
    }
  }
}

module.exports = PlaylistSongsService;
