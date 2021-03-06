const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToModelAlbumsType1, mapDBToModelAlbumsType2 } = require('../../utils/map');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const SongsService = require('./SongsService');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
    this._table = 'albums';
    this._SongsService = new SongsService();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: `INSERT INTO ${this._table} VALUES($1, $2, $3, $4, $5) RETURNING id`,
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query(`SELECT * FROM ${this._table}`);

    if (result.rows.length > 0) {
      return result.rows.map(mapDBToModelAlbumsType1);
    }

    return result.rows;
  }

  async getAlbumById(id) {
    const query = {
      text: `SELECT * FROM ${this._table} WHERE id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const songs = await this._SongsService.getSongsFilteredAlbumId(id);
    result.rows[0].songs = songs;

    return result.rows.map(mapDBToModelAlbumsType2)[0];
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: `UPDATE ${this._table} SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id`,
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: `DELETE FROM ${this._table} WHERE id = $1 RETURNING id`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;
