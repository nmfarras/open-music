class PlaylistSongsHandler {
  constructor(playlistSongActivitiesService, playlistSongsService, playlistsService, validator) {
    this._playlistSongsService = playlistSongsService;
    this._playlistsService = playlistsService;
    this._playlistSongActivitiesService = playlistSongActivitiesService;
    this._validator = validator;

    this.getPlaylistSongByPlaylistIdHandler = this.getPlaylistSongByPlaylistIdHandler.bind(this);
    this.postPlaylistSongByPlaylistIdHandler = this.postPlaylistSongByPlaylistIdHandler.bind(this);
    this.deletePlaylistSongByPlaylistIdHandler = this
      .deletePlaylistSongByPlaylistIdHandler.bind(this);
  }

  async getPlaylistSongByPlaylistIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    const playlist = await this._playlistSongsService.getSongsInPlaylistById(id);
    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async postPlaylistSongByPlaylistIdHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;

    await this._playlistsService.verifyPlaylistAccess(
      playlistId,
      credentialId,
    );

    const playlistSongId = await this
      ._playlistSongsService.addPlaylistSong(playlistId, songId);

    await this._playlistSongActivitiesService
      .addPlaylistActivityByPlaylistId(playlistId, songId, credentialId, 'add');

    const response = h.response({
      status: 'success',
      message: 'Playlist Song berhasil ditambahkan',
      data: {
        playlistSongId,
      },
    });
    response.code(201);
    return response;
  }

  async deletePlaylistSongByPlaylistIdHandler(request) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;

    await this._playlistsService.verifyPlaylistAccess(
      playlistId,
      credentialId,
    );
    await this._playlistSongsService.deletePlaylistSong(playlistId, songId);
    await this._playlistSongActivitiesService
      .addPlaylistActivityByPlaylistId(playlistId, songId, credentialId, 'delete');

    return {
      status: 'success',
      message: 'Playlist Song berhasil dihapus',
    };
  }
}

module.exports = PlaylistSongsHandler;
