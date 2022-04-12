const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
// const NotFoundError = require('../../exceptions/NotFoundError');
// const { mapDBToModelPlaylist } = require('../../utils/mapDBToModelPlaylist');
// const { mapDBToModelPlaylistSong } = require('../../utils/mapDBToModelPlaylistSong');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  // async getPlaylistActivityByPlaylistId(id) {
  //   const query = {
  //     text: `SELECT p.id, p.name, u.username,
  //     json_agg(json_build_object('id', s.id,
  //      'title' , s.title,
  //      'performer', s.performer))
  //       AS songs
  //     FROM playlists p
  //     JOIN users u
  //     ON p.owner = u.id
  //     JOIN playlistsongs ps
  //     ON p.id = ps.playlist_id
  //     JOIN songs s
  //     ON ps.song_id = s.id
  //     GROUP BY p.id,u.username
  //     HAVING p.id = $1`,
  //     values: [id],
  //   };
  //   const result = await this._pool.query(query);

  //   if (!result.rows.length) {
  //     throw new NotFoundError('Playlist tidak ditemukan');
  //   }

  //   return result.rows[0];
  // }

  async addPlaylistActivityByPlaylistId(playlistId, songId, userId, action) {
    const id = nanoid(16);
    const time = new Date().toISOString();
    // await this._songService.getSongById(songId);

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Aktivitas terhadap lagu dalam playlist gagal ditambahkan.');
    }
    return result.rows[0].id;
  }
}

module.exports = PlaylistSongsService;
