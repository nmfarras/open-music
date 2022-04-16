const { nanoid } = require('nanoid');

exports.up = (pgm) => {
  const apo = "'";
  let id = `album-${nanoid(16)}`;
  id = apo + id + apo;

  const currentYear = new Date().getFullYear();

  // membuat album baru.
  pgm.sql(`INSERT INTO albums(id, name, year) VALUES (${id}, 'other album', ${currentYear})`);

  // mengubah nilai album_id pada song yang album_id-nya bernilai NULL
  pgm.sql(`UPDATE songs SET album_id = ${id} WHERE album_id = NULL`);

  // memberikan constraint foreign key pada album_id terhadap kolom id dari tabel albums
  pgm.addConstraint('songs', 'fk_songs.album_id_albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // menghapus constraint fk_songs.owner_users.id pada tabel songs
  pgm.dropConstraint('songs', 'fk_songs.album_id_albums.id');
};
