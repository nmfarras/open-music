const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModelSongPlaylistActivity } = require('../../utils/mapDBToModelSongPlaylistActivity');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistActivityByPlaylistId(id) {
    const query = {
      text: `SELECT u.username,s.title,psa.action,psa.time
      FROM playlist_song_activities psa
      JOIN playlists p
      ON psa.playlist_id = p.id
      JOIN users u
      ON psa.user_id = u.id
      JOIN songs s
      ON psa.song_id = s.id
      GROUP BY psa.id,u.username,s.title
      HAVING psa.playlist_id = $1
      ORDER BY psa.time`,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows.map(mapDBToModelSongPlaylistActivity);
  }

  async addPlaylistActivityByPlaylistId(playlistId, songId, userId, action) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, playlistId, songId, userId, action],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Aktivitas terhadap lagu dalam playlist gagal ditambahkan.');
    }
    return result.rows[0].id;
  }
}

module.exports = PlaylistSongsService;
