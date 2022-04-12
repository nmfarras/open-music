const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor(songService) {
    this._pool = new Pool();
    this._songService = songService;
  }

  async getSongsInPlaylistById(id) {
    const query = {
      text: `SELECT p.id, p.name, u.username, 
      json_agg(json_build_object('id', s.id, 'title' , s.title, 'performer', s.performer)) AS songs
      FROM playlists p
      JOIN users u
      ON p.owner = u.id
      JOIN playlistsongs ps
      ON p.id = ps.playlist_id
      JOIN songs s
      ON ps.song_id = s.id
      GROUP BY p.id,u.username
      HAVING p.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows[0];
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
