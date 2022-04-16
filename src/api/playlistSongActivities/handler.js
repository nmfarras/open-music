class PlaylistSongActivitiesHandler {
  constructor(playlistSongActivitiesService, playlistsService) {
    this._playlistSongActivitiesService = playlistSongActivitiesService;
    this._playlistsService = playlistsService;

    this.getPlaylistSongActivitiesByPlaylistIdHandler = this
      .getPlaylistSongActivitiesByPlaylistIdHandler.bind(this);
  }

  async getPlaylistSongActivitiesByPlaylistIdHandler(request) {
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
  }
}

module.exports = PlaylistSongActivitiesHandler;
