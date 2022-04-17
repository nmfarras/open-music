/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows;
  }

  async getAlbumById(id) {
    const query = {
      text: `SELECT a.*, 
      json_agg(s.*) AS songs 
      FROM albums a LEFT JOIN songs s 
      ON a.id=s.album_id GROUP BY a.id 
      HAVING a.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows[0];
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async editAlbumCoverById(id, coverUrl) {
    const query = {
      text: 'UPDATE albums SET "coverUrl" = $1 WHERE id = $2 RETURNING id',
      values: [coverUrl, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        'Gagal memperbarui cover album. Id tidak ditemukan',
      );
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  // async addUserAlbumLike(userId, albumId) {
  //   const id = `like-${nanoid(16)}`;

  //   const query = {
  //     text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
  //     values: [id, userId, albumId],
  //   };

  //   const result = await this._pool.query(query);

  //   if (!result.rows[0].id) {
  //     throw new InvariantError('Menyukai album gagal ditambahkan');
  //   }

  //   return result.rows[0].id;
  // }

  // async deleteUserAlbumLike(userId, albumId) {
  //   const query = {
  //     text: 'DELETE FROM albums WHERE user_id = $1 AND album_id = $2 RETURNING id',
  //     values: [userId, albumId],
  //   };

  //   const result = await this._pool.query(query);

  //   if (!result.rows.length) {
  //     throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
  //   }

  //   return result.rows;
  // }
}

module.exports = AlbumsService;
