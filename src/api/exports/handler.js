const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(playlistsService, service, validator) {
    this._playlistsService = playlistsService;
    this._service = service;
    this._validator = validator;

    this.postExportPlaylistsHandler = this.postExportPlaylistsHandler.bind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    try {
      const { id: playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      this._validator.validateExportPlaylistsPayload(request.payload);

      const message = {
        playlistId: request.params.id,
        targetEmail: request.payload.targetEmail,
      };

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

      await this._service.sendMessage('export:playlists', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
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

module.exports = ExportsHandler;
