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
      throw new NotFoundError('Suka album gagal dihapus. Id tidak ditemukan');
    }

    // await this._albumsService.deleteUserAlbumLike(userId, albumId);
    return 'Suka berhasil dihapus';
  }

  async getUserAlbumLikeCount(albumId) {
    const query = {
      text: `SELECT COUNT(album_id) as likes
      FROM user_album_likes
      WHERE album_id = $1`,
      values: [albumId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      await this._albumsService.getAlbumById(albumId);
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows[0];
  }
}

module.exports = UserAlbumLikesService;
