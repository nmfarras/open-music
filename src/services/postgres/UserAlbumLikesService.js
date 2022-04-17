const { Pool } = require('pg');
// const { nanoid } = require('nanoid');
// const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserAlbumLikesService {
  constructor(albumsService, cacheService) {
    this._pool = new Pool();
    this._albumsService = albumsService;
    this._cacheService = cacheService;
  }

  async addUserAlbumLike(userId, albumId) {
    // await this._albumsService.getAlbumById(albumId);
    const query = {
      text: `SELECT ual.* 
      FROM user_album_likes ual 
      WHERE ual.user_id = $1 AND ual.album_id = $2`,
      values: [userId, albumId],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0]) {
      await this._albumsService.addUserAlbumLike(userId, albumId);

      return 'Suka berhasil ditambah';
    }

    await this._albumsService.deleteUserAlbumLike(userId, albumId);
    await this._cacheService.delete(`likes:${albumId}`);
    return 'Suka berhasil dihapus';
  }

  async getUserAlbumLikeCount(albumId) {
    try {
      // mendapatkan catatan dari cache
      const result = await this._cacheService.get(`likes:${albumId}`);
      return JSON.parse(result);
    } catch (error) {
      // bila gagal, diteruskan dengan mendapatkan catatan dari database
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

      const mappedResult = result.rows[0];

      // catatan akan disimpan pada cache sebelum fungsi getNotes dikembalikan
      await this._cacheService.set(`likes:${albumId}`, JSON.stringify(mappedResult));

      return mappedResult;
    }
  }
}

module.exports = UserAlbumLikesService;
