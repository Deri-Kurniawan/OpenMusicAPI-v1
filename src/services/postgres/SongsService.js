const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const {
  mapDBToModelSongsType2,
  mapDBToModelSongsType1,
  mapDBToModelSongsType3,
} = require('../../utils/map');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
    this._table = 'songs';
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: `INSERT
               INTO ${this._table}
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id`,
      values: [
        id,
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs({ title = null, performer = null }) {
    const result = await this._pool.query(`SELECT * FROM ${this._table}`);
    let filteredSongs = [];

    if (title !== null && performer !== null) {
      filteredSongs = result.rows.filter(
        (song) => song.title === title && song.performer === performer,
      );

      return filteredSongs;
    }

    if (title !== null) {
      filteredSongs = result.rows.filter((song) => song.title === title);
      return filteredSongs;
    }

    if (performer !== null) {
      filteredSongs = result.rows.filter((song) => song.performer === performer);
      return filteredSongs;
    }

    if (result.rows.length > 0) {
      return result.rows.map(mapDBToModelSongsType1);
    }

    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: `
        SELECT * FROM ${this._table} WHERE id = $1
      `,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows.map(mapDBToModelSongsType2)[0];
  }

  async getSongsFilteredAlbumId(id) {
    const songs = await this._pool.query(`SELECT * FROM ${this._table}`);
    const filteredSongs = songs.rows.filter((song) => song.album_id === id);

    return filteredSongs.map(mapDBToModelSongsType3);
  }

  async editSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: `
           UPDATE ${this._table}
              SET title = $1, year = $2, genre = $3, performer = $4,
                  duration = $5, album_id = $6, updated_at = $7 WHERE id = $8
        RETURNING id
        `,
      values: [title, year, genre, performer, duration, albumId, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: `DELETE FROM ${this._table} WHERE id = $1 RETURNING id`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
