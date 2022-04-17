const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserAlbumLikesService {
  constructor(albumsService) {
    this._pool = new Pool();
    this._albumsService = albumsService;
  }

  async addUserAlbumLike(userId, albumId) {
    // await this._albumsService.getAlbumById(albumId);
    let query = {
      text: `SELECT ual.* 
      FROM user_album_likes ual 
      WHERE ual.user_id = $1 AND ual.album_id = $2`,
      values: [userId, albumId],
    };
    let result = await this._pool.query(query);
    console.log(!result.rows[0]);
    console.log(result.rows[0]);

    if (!result.rows[0]) {
      // await this._albumsService.addUserAlbumLike(userId, albumId);
      const id = `like-${nanoid(16)}`;

      query = {
        text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
        values: [id, userId, albumId],
      };

      result = await this._pool.query(query);

      if (!result.rows[0]) {
        throw new InvariantError('Menyukai album gagal ditambahkan');
      }

      return 'Suka berhasil ditambah';
    }

    query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }

    // await this._albumsService.deleteUserAlbumLike(userId, albumId);
    return 'Suka berhasil dihapus';
  }
}

module.exports = UserAlbumLikesService;
