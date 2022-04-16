class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const {
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    } = request.payload;

    const songId = await this._service.addSong({
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request) {
    const songList = await this._service.getSongs();

    const { title, performer } = request.query;

    let songs;
    songs = songList;

    if (title !== undefined) {
      const findTitle = title;
      songs = songList
        .filter(
          (song) => song.title.toLowerCase().indexOf(findTitle.toLowerCase()) !== -1,
        );
    }
    if (performer !== undefined) {
      const findPerformer = performer;
      songs = songList
        .filter(
          (song) => song.performer.toLowerCase().indexOf(findPerformer.toLowerCase()) !== -1,
        );
    }
    if (performer !== undefined && title !== undefined) {
      const findTitle = title;
      const findPerformer = performer;
      songs = songList
        .filter(
          (song) => song.title.toLowerCase().indexOf(findTitle.toLowerCase()) !== -1,
        )
        .filter(
          (song) => song.performer.toLowerCase().indexOf(findPerformer.toLowerCase()) !== -1,
        );
    }
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request) {
    this._validator.validateSongPayload(request.payload);
    const {
      title, year, performer, genre, duration, albumId,
    } = request.payload;
    const { id } = request.params;

    await this._service.editSongById(id, {
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    });

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
