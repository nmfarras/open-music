class UserAlbumLikessHandler {
  constructor(service) {
    this._service = service;

    this.postUserAlbumLikesHandler = this.postUserAlbumLikesHandler.bind(this);
    this.getUserAlbumLikesHandler = this.getUserAlbumLikesHandler.bind(this);
  }

  async postUserAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    console.log(request.params.id);
    console.log(albumId);

    console.log(request.auth.credentials.id);
    console.log(credentialId);

    const message = await this._service.addUserAlbumLike(
      credentialId,
      albumId,
    );

    const response = h.response({
      status: 'success',
      message: `${message}`,
    });
    response.code(201);
    return response;
  }

  async getUserAlbumLikesHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deleteUserAlbumLikes(playlistId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = UserAlbumLikessHandler;
