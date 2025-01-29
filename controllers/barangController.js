const Barang = require("../models/barang");

const barangController = {
  index: async (req, res) => {
    try {
      const barang = await Barang.all();
      res.status(200).json({
        data: barang
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        session: "failed",
        message: "Terjadi kesalahan pada server.", 
        error 
      });
    }
  },
  show: async (req, res) => {
    try {
      const {kode_barang} = req.params;
      const errors = [];
      const barang = await Barang.find(kode_barang);
      if(barang.length === 0){
        return errors.push({ field: 'kode_barang', message: 'Kode barang tidak ditemukan!' });
      }
      if(!kode_barang){
        errors.push({ field: 'kode_barang', message: 'Kode barang harus diisi!' });
      }
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      res.status(200).json({
        data: barang
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ session: "failed", message: "Terjadi kesalahan pada server.", error });
    }
  },
  store: async (req, res) => {
    try {
      const { kode_barang, nama, harga } = req.body;
      const errors = [];
      
      const kodeBarangExist = await Barang.find(kode_barang);
      if (kodeBarangExist.length > 0) {
        errors.push({ field: 'kode_barang', message: 'Kode barang sudah terdaftar!' });
      }
      const numericRegex = /^[0-9]+$/;
      if (!kode_barang || !numericRegex.test(kode_barang) || kode_barang.length != 7) {
        errors.push({ field: 'kode_barang', message: 'Kode barang hanya boleh berisi angka dan harus terdiri dari 7 karakter!' });
      }
      if(!nama || nama.length > 30){
        errors.push({ field: 'nama', message: 'Nama barang harus diisi dan tidak boleh lebih dari 30 karakter!' });
      }
      if(!harga || harga <= 0){
        errors.push({ field: 'harga', message: 'Harga harus diisi dan hanya angka positif!' });
      }
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      const barang = await Barang.create({
        kode_barang,
        nama,
        harga
      });
      const dataBarang = await Barang.find(kode_barang);

      res.status(201).json({
        session: "success",
        message: "Data barang berhasil disimpan.",
        data: dataBarang
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ session: "failed", message: "Terjadi kesalahan pada server.", error });
    }
  },
  update: async (req, res) => {
    try {
      const { kode_barang } = req.params;
      const { nama, harga } = req.body;

      const kodeBarangExist = await Barang.find(kode_barang);
      if(kodeBarangExist.length === 0){
        return res.status(404).json({ message: "Barang tidak ditemukan." });
      }

      const errors = [];
      if(!nama || nama.length > 30){
        errors.push({ field: 'nama', message: 'Nama barang harus diisi dan tidak boleh lebih dari 30 karakter!' });
      }
      if(!harga || harga <= 0){
        errors.push({ field: 'harga', message: 'Harga harus diisi dan hanya angka positif!' });
      }
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const barang = await Barang.update(kode_barang, {
        nama,
        harga
      });
      const dataBarang = await Barang.find(kode_barang);

      res.status(200).json({
        session: "success",
        message: "Data barang berhasil diubah.",
        data: dataBarang
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ session: "failed", message: "Terjadi kesalahan pada server.", error });
    }
  },
  delete: async (req, res) => {
    try {
      const { kode_barang } = req.params;
      const errors = [];
      if (!kode_barang) {
        errors.push({ field: 'kode_barang', message: 'Kode barang harus diisi!' });
      }
      const kodeBarangExist = await Barang.find(kode_barang);
      if(kodeBarangExist.length === 0){
        errors.push({ field: 'kode_barang', message: 'Kode barang tidak ditemukan!' });
      }
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      const barang = await Barang.delete(kode_barang);
      res.status(200).json({
        session: "success",
        message: "Data barang berhasil dihapus.",
        data: barang
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ session: "failed", message: "Terjadi kesalahan pada server.", error });
    }
  },
};

module.exports = barangController;