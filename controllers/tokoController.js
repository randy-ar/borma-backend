const Toko = require('../models/toko');

const tokoController = {
  // Controller untuk menambahkan data toko
  async store(req, res) {
    try {
      const { kode_toko, nama_toko, nama_perusahaan, alamat, nomor_telepon } = req.body;

      // Validasi input
      const errors = [];

      const kodeTokoExist = await Toko.find(kode_toko);
      if (kodeTokoExist.length > 0) {
        errors.push({ field: 'kode_toko', message: 'Kode toko sudah terdaftar!' });
      }

      const re = /^[0-9.-]+$/;
      if (!kode_toko || !re.test(kode_toko)) {
        errors.push({ field: 'kode_toko', message: 'Kode toko hanya boleh berisi angka, titik, dan tanda hubung!' });
      }

      const alphabetHyphenSpaceRegex = /^[A-Za-z-\s.,]+$/;
      if (!nama_toko || !alphabetHyphenSpaceRegex.test(nama_toko)) {
        errors.push({ field: 'nama_toko', message: 'Nama toko hanya boleh berisi huruf, tanda hubung, spasi, titik, dan koma!' });
      }

      if (!nama_perusahaan || !alphabetHyphenSpaceRegex.test(nama_perusahaan)) {
        errors.push({ field: 'nama_perusahaan', message: 'Nama perusahaan hanya boleh berisi huruf, tanda hubung, spasi, titik, dan koma!' });
      }

      if (!alamat) {
        errors.push({ field: 'alamat', message: 'Alamat harus diisi!' });
      }

      const numericDashRegex = /^[0-9-]+$/;
      if (!nomor_telepon || !numericDashRegex.test(nomor_telepon)) {
        errors.push({ field: 'nomor_telepon', message: 'Nomor telepon hanya boleh berisi angka dan tanda hubung!' });
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      // Buat toko baru
      const tokoBaru = await Toko.create({
        kode_toko,
        nama_toko,
        nama_perusahaan,
        alamat,
        nomor_telepon,
      });
      const dataToko = await Toko.find(kode_toko);

      res.status(201).json({ 
        session: 'success',
        message: 'Toko berhasil dibuat!', 
        data: dataToko 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        session: 'failed',
        message: 'Terjadi kesalahan pada server.', 
        error 
      });
    }
  },
  async index(req, res) {
    try {
      const toko = await Toko.all();
      res.status(200).json({
        data: toko
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ session: "failed", message: 'Terjadi kesalahan pada server.', error });
    }
  },
  async show(req, res) {
    try {
      const { kode_toko } = req.body;
      const errors = [];
      if(!kode_toko){
        errors.push({ field: 'kode_toko', message: 'Kode toko harus diisi!' });
      }
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      const toko = await Toko.find(kode_toko);
      res.status(200).json({
        data: toko
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ session: "failed", message: 'Terjadi kesalahan pada server.', error });
    }
  },
  async first(req, res){
    try {
      const toko = await Toko.first();
      res.status(200).json({
        data: toko
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ session: "failed", message: 'Terjadi kesalahan pada server.', error });
    }
  },
  async update(req, res){
    try {
      const { kode_toko, nama_toko, nama_perusahaan, alamat, nomor_telepon } = req.body;
      const errors = [];
      if(!kode_toko){
        errors.push({ field: 'kode_toko', message: 'Kode toko harus diisi!' });
      }

      const alphabetHyphenSpaceRegex = /^[A-Za-z-\s.,]+$/;
      if (!nama_toko || !alphabetHyphenSpaceRegex.test(nama_toko)) {
        errors.push({ field: 'nama_toko', message: 'Nama toko hanya boleh berisi huruf, tanda hubung, spasi, titik, dan koma!' });
      }

      if (!nama_perusahaan || !alphabetHyphenSpaceRegex.test(nama_perusahaan)) {
        errors.push({ field: 'nama_perusahaan', message: 'Nama perusahaan hanya boleh berisi huruf, tanda hubung, spasi, titik, dan koma!' });
      }

      if (!alamat) {
        errors.push({ field: 'alamat', message: 'Alamat harus diisi!' });
      }

      const numericDashRegex = /^[0-9-]+$/;
      if (!nomor_telepon || !numericDashRegex.test(nomor_telepon)) {
        errors.push({ field: 'nomor_telepon', message: 'Nomor telepon hanya boleh berisi angka dan tanda hubung!' });
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      const toko = await Toko.update(kode_toko, {
        nama_toko,
        nama_perusahaan,
        alamat,
        nomor_telepon
      });
      const dataToko = await Toko.find(kode_toko);
      res.status(201).json({ 
        session: 'success',
        message: 'Toko berhasil diubah!', 
        data: dataToko
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ session: "failed", message: 'Terjadi kesalahan pada server.', error });
    }
  },
  async updateFirst(req, res){
    try {
      const { kode_toko, nama_toko, nama_perusahaan, alamat, nomor_telepon } = req.body;
      const errors = {};

      if(!kode_toko){
        errors.kode_toko = 'Kode toko harus diisi!';
      }

      const alphabetHyphenSpaceRegex = /^[A-Za-z-\s.,]+$/;
      if (!nama_toko || !alphabetHyphenSpaceRegex.test(nama_toko)) {
        errors.nama_toko= 'Nama toko hanya boleh berisi huruf, tanda hubung, spasi, titik, dan koma!';
      }

      if (!nama_perusahaan || !alphabetHyphenSpaceRegex.test(nama_perusahaan)) {
        errors.nama_perusahaan='Nama perusahaan hanya boleh berisi huruf, tanda hubung, spasi, titik, dan koma!';
      }

      if (!alamat) {
        errors.alamat='Alamat harus diisi!';
      }

      const numericDashRegex = /^[0-9-]+$/;
      if (!nomor_telepon || !numericDashRegex.test(nomor_telepon)) {
        errors.nomor_telepon='Nomor telepon hanya boleh berisi angka dan tanda hubung!';
      }

      if (errors && Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const kodeTokoFirst = await Toko.first();
      if (kodeTokoFirst.length === 0) {
        const toko = await Toko.create({
          kode_toko,
          nama_toko,
          nama_perusahaan,
          alamat,
          nomor_telepon
        });
      }else{
        const toko = await Toko.updateFirst(kodeTokoFirst[0].kode_toko, {
          kode_toko,
          nama_toko,
          nama_perusahaan,
          alamat,
          nomor_telepon
        });
      }
      const dataToko = await Toko.find(kode_toko);
      res.status(201).json({ 
        session: 'success',
        message: 'Toko berhasil diubah!', 
        data: dataToko
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ session: "failed", message: 'Terjadi kesalahan pada server.', error });
    }
  },
  async delete(req, res){
    try {
      const { kode_toko } = req.body;
      const errors = [];
      const kodeTokoExist = await Toko.find(kode_toko);
      if (kodeTokoExist.length === 0) {
        errors.push({ field: 'kode_toko', message: 'Kode toko tidak ditemukan!' });
      }
      if(!kode_toko){
        errors.push({ field: 'kode_toko', message: 'Kode toko harus diisi!' });
      }
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      const toko = await Toko.delete(kode_toko);
      res.status(201).json({ session: 'success', message: 'Toko berhasil dihapus!', data: toko });
    } catch (error) {
      console.error(error);
      res.status(500).json({ session: "failed", message: 'Terjadi kesalahan pada server.', error });
    }
  }
};

module.exports = tokoController;

