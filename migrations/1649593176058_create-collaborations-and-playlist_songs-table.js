/* eslint-disable camelcase */
exports.up = (pgm) => {
  // membuat table collaborations
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  /*
      Menambahkan constraint UNIQUE, kombinasi dari kolom playlist_id dan user_id.
      Guna menghindari duplikasi data antara nilai keduanya.
    */
  pgm.addConstraint('collaborations', 'unique_playlist_id_and_user_id', 'UNIQUE(playlist_id, user_id)');

  // memberikan constraint foreign key pada kolom playlists_id dan
  // user_id terhadap playlists.id dan users.id
  pgm.addConstraint('collaborations', 'fk_collaborations.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('collaborations', 'fk_collaborations.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');

  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  /*
      Menambahkan constraint UNIQUE, kombinasi dari kolom playlist_id dan user_id.
      Guna menghindari duplikasi data antara nilai keduanya.
  */
  pgm.addConstraint('playlist_songs', 'unique_playlist_id_and_song_id', 'UNIQUE(playlist_id, song_id)');

  // memberikan constraint foreign key pada kolom playlists_id dan
  // song_id terhadap playlists.id dan songs.id
  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.song_id_songs.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // menghapus tabel collaborations
  pgm.dropTable('playlist_songs');
  pgm.dropTable('collaborations');
};
