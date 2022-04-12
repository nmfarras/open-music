/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');

class PlaylistSongActivitiesHandler {
  constructor(playlistSongActivitiesService, playlistsService) {
    this._playlistSongActivitiesService = playlistSongActivitiesService;
    this._playlistsService = playlistsService;

    this.getPlaylistSongActivitiesByPlaylistIdHandler = this
      .getPlaylistSongActivitiesByPlaylistIdHandler.bind(this);
  }

  async getPlaylistSongActivitiesByPlaylistIdHandler(request, h) {
    try {
      const { id: playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      const activities = await this._playlistSongActivitiesService
        .getPlaylistActivityByPlaylistId(playlistId);
      return {
        status: 'success',
        data: {
          playlistId, activities,
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
