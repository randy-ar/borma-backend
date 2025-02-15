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
      const errors = {};
      const [barang] = await Barang.find(kode_barang);
      if(barang.length === 0){
        return errors.kode_barang='Kode barang tidak ditemukan!';
      }
      if(!kode_barang){
        errors.kode_barang='Kode barang harus diisi!';
      }
      if (errors && Object.keys(errors).length > 0) {
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
      const { kode_barang, nama_barang, harga } = req.body;
      const errors = {};
      
      const numericRegex = /^[0-9]+$/;
      if (!kode_barang || !numericRegex.test(kode_barang) || kode_barang.length != 7) {
        errors.kode_barang='Kode barang hanya boleh berisi angka dan harus terdiri dari 7 karakter!';
      }
      const kodeBarangExist = await Barang.find(kode_barang);
      if (kodeBarangExist.length > 0) {
        errors.kode_barang='Kode barang sudah terdaftar!';
      }
      if(!nama_barang || nama_barang.length > 30){
        errors.nama_barang='Nama barang harus diisi dan tidak boleh lebih dari 30 karakter!';
      }
      if(!harga || harga <= 0){
        errors.harga='Harga harus diisi dan hanya angka positif!';
      }
      if (errors && Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }
      const barang = await Barang.create({
        kode_barang,
        nama_barang,
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
      const { param_kode_barang } = req.params;
      const { kode_barang, nama_barang, harga } = req.body;
      const errors = {};

      const paramKodeBarangExist = await Barang.find(param_kode_barang);
      if(paramKodeBarangExist.length === 0){
        errors.kode_barang="Barang tidak ditemukan.";
      }
      const kodeBarangExist = await Barang.find(kode_barang);
      if (kodeBarangExist.length > 0 && !kodeBarangExist[0].kode_barang.startsWith(param_kode_barang)) {
        errors.kode_barang="Kode barang sudah terdaftar!";
      }
      
      const numericRegex = /^[0-9]+$/;
      if(!kode_barang || !numericRegex.test(kode_barang) || kode_barang.length != 7) {
        errors.kode_barang='Kode barang hanya boleh berisi angka dan harus terdiri dari 7 karakter!';
      }
      if(!nama_barang || nama_barang.length > 30){
        errors.nama_barang='Nama barang harus diisi dan tidak boleh lebih dari 30 karakter!';
      }
      if(!harga || harga <= 0){
        errors.harga='Harga harus diisi dan hanya angka positif!';
      }
      if (errors && Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const barang = await Barang.update(param_kode_barang, {
        kode_barang,
        nama_barang,
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
      const errors = {};
      if (!kode_barang) {
        errors.kode_barang='Kode barang harus diisi!';
      }
      const kodeBarangExist = await Barang.find(kode_barang);
      if(kodeBarangExist.length === 0){
        errors.kode_barang='Kode barang tidak ditemukan!';
      }
      if (errors && Object.keys(errors).length > 0) {
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

  paginate: async(req, res) => {
    try{
      const {page, limit, cari} = req.query;
      const result = await Barang.paginate(page ?? 1, limit ?? 10, cari);
      res.status(200).json({
        data: result
      });
    }catch(error){
      res.status(500).json({session: "failed", message: "Terjadi kesalahan pada server.", error });
    }
  }
};

module.exports = barangController;