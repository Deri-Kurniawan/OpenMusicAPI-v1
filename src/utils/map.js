/* eslint-disable camelcase */

/**
 * For Albums
 */
const mapDBToModelAlbumsType1 = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});

/**
 * For detail album with album songs
 */
const mapDBToModelAlbumsType2 = ({
  id,
  name,
  year,
  songs,
}) => ({
  id,
  name,
  year,
  songs,
});

/**
 * For Songs
 */
const mapDBToModelSongsType1 = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

/**
 * For Song by Id
 */
const mapDBToModelSongsType2 = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

/**
 * For filtered songs by album id
 */
const mapDBToModelSongsType3 = ({
  id,
  year,
  performer,
}) => ({
  id,
  year,
  performer,
});

module.exports = {
  mapDBToModelAlbumsType1,
  mapDBToModelSongsType1,
  mapDBToModelSongsType2,
  mapDBToModelAlbumsType2,
  mapDBToModelSongsType3,
};
