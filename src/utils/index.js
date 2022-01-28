/* eslint-disable camelcase */
const mapDBToModelGetAlbums = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});

const mapDBToModelGetAlbumWithSongs = ({
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

const mapDBToModelGetSongs = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

const mapDBToModelGetSongById = ({
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

const mapDBToModelGetFilteredSongsByAlbumId = ({
  id,
  year,
  performer,
}) => ({
  id,
  year,
  performer,
});

module.exports = {
  mapDBToModelGetAlbums,
  mapDBToModelGetSongs,
  mapDBToModelGetSongById,
  mapDBToModelGetAlbumWithSongs,
  mapDBToModelGetFilteredSongsByAlbumId,
};
