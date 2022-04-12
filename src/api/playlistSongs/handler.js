/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');

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

  async getPlaylistSongByPlaylistIdHandler(request, h) {
    try {
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
    } catch (error) {
      if (error instanceof ClientError) {
        return error;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async postPlaylistSongByPlaylistIdHandler(request, h) {
    try {
      console.log(request.payload);
      this._validator.validatePlaylistSongPayload(request.payload);
      const { id: playlistId } = request.params;
      console.log(playlistId);
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
    } catch (error) {
      if (error instanceof ClientError) {
        return error;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deletePlaylistSongByPlaylistIdHandler(request, h) {
    try {
      this._validator.validatePlaylistSongPayload(request.payload);
      const { id: playlistId } = request.params;
      console.log(playlistId);
      const { id: credentialId } = request.auth.credentials;
      const { songId } = request.payload;

      await this._playlistsService.verifyPlaylistAccess(
        playlistId,
        credentialId,
      );
      await this._playlistSongsService.deletePlaylistSong(playlistId, songId);

      return {
        status: 'success',
        message: 'Playlist Song berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return error;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = PlaylistSongsHandler;
