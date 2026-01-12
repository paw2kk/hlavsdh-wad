// TODO: Definisikan semua jalur (Route) aplikasi kalian disini (GET, POST, PUT, DELETE)
const express = require('express');
const router = express.Router();

// Halaman utama - Tampilkan semua data
router.get('/', async (req, res) => {
  try {
    const db = req.db;
    
    // Query mahasiswa dengan total SKS dan jumlah mata kuliah
    const [mahasiswa] = await db.query(`
      SELECT 
        m.*,
        COALESCE(SUM(mk.sks), 0) as total_sks,
        COUNT(mk.id) as jumlah_mk
      FROM mahasiswa m
      LEFT JOIN mata_kuliah mk ON m.id = mk.mahasiswa_id
      GROUP BY m.id
      ORDER BY m.id DESC
    `);
    
    // Query mata kuliah dengan nama mahasiswa
    const [mataKuliah] = await db.query(`
      SELECT 
        mk.*,
        m.nama as nama_mahasiswa
      FROM mata_kuliah mk
      JOIN mahasiswa m ON mk.mahasiswa_id = m.id
      ORDER BY mk.id DESC
    `);
    
    res.render('index', {
      mahasiswa,
      mataKuliah
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error retrieving data: ' + err.message);
  }
});

// Tambah mahasiswa
router.post('/mahasiswa', async (req, res) => {
  const { nama, nim, jurusan } = req.body;
  
  try {
    await req.db.query(
      'INSERT INTO mahasiswa (nama, nim, jurusan) VALUES (?, ?, ?)',
      [nama, nim, jurusan]
    );
    res.redirect('/');
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error adding student: ' + err.message);
  }
});

// Hapus mahasiswa
router.post('/mahasiswa/delete/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await req.db.query('DELETE FROM mahasiswa WHERE id = ?', [id]);
    res.redirect('/');
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error deleting student: ' + err.message);
  }
});

// Tambah mata kuliah
router.post('/matakuliah', async (req, res) => {
  const { kode_mk, nama_mk, sks, mahasiswa_id } = req.body;
  
  try {
    await req.db.query(
      'INSERT INTO mata_kuliah (kode_mk, nama_mk, sks, mahasiswa_id) VALUES (?, ?, ?, ?)',
      [kode_mk, nama_mk, sks, mahasiswa_id]
    );
    res.redirect('/');
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error adding course: ' + err.message);
  }
});

// Hapus mata kuliah
router.post('/matakuliah/delete/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await req.db.query('DELETE FROM mata_kuliah WHERE id = ?', [id]);
    res.redirect('/');
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error deleting course: ' + err.message);
  }
});

module.exports = router;
