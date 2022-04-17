class UserAlbumLikessHandler {
  constructor(service) {
    this._service = service;

    this.postUserAlbumLikesHandler = this.postUserAlbumLikesHandler.bind(this);
    this.getUserAlbumLikesHandler = this.getUserAlbumLikesHandler.bind(this);
  }

  async postUserAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

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
    const { id: albumId } = request.params;

    const totalLike = await this._service.getUserAlbumLikeCount(
      albumId,
    );
    let { likes } = totalLike;
    likes = parseInt(likes, 10);

    return {
      status: 'success',
      data: {
        likes,
      },
    };
  }
}

module.exports = UserAlbumLikessHandler;
