const Kassa = require("../models/kassa");

const kassaController = {
  index: async (req, res) => {
    try {
      const kassa = await Kassa.all();
      res.status(200).json({
        data: kassa
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ session: "failed", message: "Terjadi kesalahan pada server.", error });
    }
  },
  show: async (req, res) => {
    try {
      const { kode_kassa } = req.params;
      const [kassa] = await Kassa.find(kode_kassa);
      res.status(200).json({
        data: kassa
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ session: "failed", message: "Terjadi kesalahan pada server.", error });
    }
  },
  store: async (req, res) => {
    try {
      const {kode_kassa, nama} = req.body;

      const errors = {};
      const alphanumericRegex = /^[a-zA-Z0-9]+$/;
      if(!kode_kassa || !alphanumericRegex.test(kode_kassa) || kode_kassa.length > 5){
        errors.kode_kassa = 'Kode kassa hanya boleh berisi angka dan huruf, dan tidak boleh lebih dari 5 karakter!';
      }
      const existingKassa = await Kassa.find(kode_kassa);
      if (existingKassa.length > 0) {
        errors.kode_kassa = 'Kode kassa sudah terdaftar!';
      }
      if(!nama || nama.length > 10){
        errors.nama='Nama kassa harus diisi dan tidak boleh lebih dari 10 karakter!';
      }
      if (errors && Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const result = await Kassa.create({
        kode_kassa,
        nama
      });

      const dataKassa = await Kassa.find(kode_kassa);

      res.status(200).json({
        session: "success",
        message: "Kassa berhasil disimpan.",
        data: dataKassa
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ session: "failed", message: "Terjadi kesalahan pada server.", error });
    }
  },
  update: async (req, res) => {
    try{
      const { param_kode_kassa } = req.params;
      const { nama, kode_kassa } = req.body;

      const errors = {};
      const existingKassa = await Kassa.find(param_kode_kassa);
      if (existingKassa.length === 0) {
        errors.kode_kassa='Kode kassa tidak ditemukan!';
      }
      if(!nama || nama.length > 10){
        errors.nama='Nama kassa harus diisi dan tidak boleh lebih dari 10 karakter!';
      }
      if (errors && Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      } 

      const result = await Kassa.update(param_kode_kassa, {
        kode_kassa,
        nama
      });

      const dataKassa = await Kassa.find(kode_kassa);

      res.status(200).json({
        session: "success",
        message: "Kassa berhasil diubah.",
        dataKassa: dataKassa
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ session: "failed", message: "Terjadi kesalahan pada server.", error });
    }
  },
  delete: async (req, res) => {
    try {
      const { kode_kassa } = req.params;
      const result = await Kassa.delete(kode_kassa);
      res.status(200).json({
        session: "success",
        message: "Kassa berhasil dihapus.",
        data: result
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ session: "failed", message: "Terjadi kesalahan pada server.", error });
    }
  },
  paginate: async(req, res) => {
    try{
      const {page, limit} = req.query;
      const result = await Kassa.paginate(page ?? 1, limit ?? 5);
      res.status(200).json({
        data: result
      });
    }catch(error){
      res.status(500).json({session: "failed", message: "Terjadi kesalahan pada server.", error });
    }
  }
};

module.exports = kassaController;