const Kassa = require("../models/kassa");

const kassaController = {
  index: async (req, res) => {
    try {
      const kassa = await Kassa.all();
      res.status(200).json(kassa);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Terjadi kesalahan pada server.", error });
    }
  },
  show: async (req, res) => {
    try {
      const { kode_kassa } = req.params;
      const kassa = await Kassa.find(kode_kassa);
      res.status(200).json(kassa);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Terjadi kesalahan pada server.", error });
    }
  },
  store: async (req, res) => {
    try {
      const {kode_kassa, nama} = req.body;

      const errors = [];
      const existingKassa = await Kassa.find(kode_kassa);
      if (existingKassa.length > 0) {
        return errors.push({ field: 'kode_kassa', message: 'Kode kassa sudah terdaftar!' });
      }
      const alphanumericRegex = /^[a-zA-Z0-9]+$/;
      if(!kode_kassa || !alphanumericRegex.test(kode_kassa) || kode_kassa.length > 5){
        errors.push({ field: 'kode_kassa', message: 'Kode kassa hanya boleh berisi angka dan huruf, dan tidak boleh lebih dari 5 karakter!' });
      }
      if(!nama || nama.length > 10){
        errors.push({ field: 'nama', message: 'Nama kassa harus diisi dan tidak boleh lebih dari 10 karakter!' });
      }
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const result = await Kassa.create({
        kode_kassa,
        nama
      });
      res.status(200).json({
        message: "Kassa berhasil ditambahkan.",
        result
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Terjadi kesalahan pada server.", error });
    }
  },
  update: async (req, res) => {
    try{
      const { kode_kassa } = req.params;
      const { nama } = req.body;

      const errors = [];
      const existingKassa = await Kassa.find(kode_kassa);
      if (existingKassa.length === 0) {
        return res.status(404).json({ message: "Kassa tidak ditemukan." });
      }
      if(!nama || nama.length > 10){
        errors.push({ field: 'nama', message: 'Nama kassa harus diisi dan tidak boleh lebih dari 10 karakter!' });
      }
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      } 

      const result = await Kassa.update(kode_kassa, {
        nama
      });
      res.status(200).json({
        message: "Kassa berhasil diubah.",
        result
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Terjadi kesalahan pada server.", error });
    }
  },
  delete: async (req, res) => {
    try {
      const { kode_kassa } = req.params;
      const result = await Kassa.delete(kode_kassa);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Terjadi kesalahan pada server.", error });
    }
  }
};

module.exports = kassaController;