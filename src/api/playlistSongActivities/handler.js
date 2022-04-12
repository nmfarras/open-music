/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');

class PlaylistSongActivitiesHandler {
  constructor(playlistSongActivitiesService, playlistsService, validator) {
    this._playlistSongActivitiesService = playlistSongActivitiesService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.getPlaylistSongActivitiesByPlaylistIdHandler = this
      .getPlaylistSongActivitiesByPlaylistIdHandler.bind(this);
  }

  async getPlaylistSongActivitiesByPlaylistIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistAccess(id, credentialId);
      const playlist = await this._playlistSongActivitiesService.getSongsInPlaylistById(id);
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
}

module.exports = PlaylistSongActivitiesHandler;
