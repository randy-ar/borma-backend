const Barang = require("../models/barang");
const Kassa = require("../models/kassa");
const Toko = require("../models/toko");
const Transaksi = require("../models/transaksi");
const { search } = require("../routes/transaksiRoutes");
const { paginate } = require("./barangController");

const transaksiController = {
  index: async (req, res) => {
    try {
      const transaksi = await Transaksi.all();
      const transaksiBarang = await Promise.all(transaksi.map(async (row) => {
        const barangTransaksi = await Transaksi.printBarang(row.kode_transaksi);
        return {
          ...row,
          daftar_barang: barangTransaksi,
        };
      }));
      res.status(200).json({
        data: transaksiBarang
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ session: "failed", message: "Terjadi kesalahan pada server.", error });
    }
  },
  paginate: async(req, res) => {
    try {
      const {page, paginate, kode_transaksi} = req.query;
      const decodedKodeTransaksi = kode_transaksi ? decodeURIComponent(kode_transaksi) : '';
      const transaksi = await Transaksi.paginate(page ?? 1, parseInt(paginate) ?? 5, decodedKodeTransaksi ?? '');
      const transaksiBarang = await Promise.all(transaksi.data.map(async (row) => {
        const barangTransaksi = await Transaksi.printBarang(row.kode_transaksi);
        return {
          ...row,
          daftar_barang: barangTransaksi,
        };
      }));
      res.status(200).json({
        data: transaksiBarang,
        pagination: transaksi.pagination,
        search: decodedKodeTransaksi,
        kode_transaksi: decodedKodeTransaksi
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ session: "failed", message: "Terjadi kesalahan pada server.", error });
    }
  },
  show: async (req, res) => {
    try {
      const { kode_transaksi } = req.body;
      const errors = {};
      const kodeTransaksiExist = await Transaksi.find(kode_transaksi);
      if(kodeTransaksiExist.length === 0){
        errors.kode_transaksi='Kode transaksi tidak ditemukan!';
      }
      if(!kode_transaksi){
        errors.kode_transaksi='Kode transaksi harus diisi!';
      }
      if (errors && Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }
      
      let [transaksi] = await Transaksi.find(kode_transaksi);
      const barangTransaksi = await Transaksi.printBarang(kode_transaksi);
      transaksi = {
        ...transaksi,
        barang: barangTransaksi
      }

      res.status(200).json({
        data: transaksi
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ session: "failed", message: "Terjadi kesalahan pada server.", error });
    }
  },
  store: async (req, res) => {
    try {
      const {kode_toko, kode_kassa, kode_barang, bayar } = req.body;
      const errors = {};
      if(kode_toko){
        const kodeTokoExist = await Toko.find(kode_toko);
        if (kodeTokoExist.length === 0) {
          errors.kode_toko='Kode toko tidak ditemukan!';
        }
      }
      if(!kode_kassa){
        errors.kode_kassa='Kode kassa harus diisi!';
      }
      const kodeKassaExist = await Kassa.find(kode_kassa);
      if (kodeKassaExist.length === 0) {
        errors.kode_kassa='Kode kassa tidak ditemukan!';
      }
      if(!kode_barang || kode_barang.length === 0){
        errors.kode_barang='Kode barang harus diisi!';
      }
      if(!bayar || bayar <= 0){
        errors.bayar='Jumlah pembayaran harus diisi dan hanya angka positif!';
      }
      if (errors && Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      let total = 0;
      let kode_toko_first = null;
      let list_barang = [];
      kode_barang.forEach(async (kode) => {
        const barang = await Barang.find(kode);
        console.log(`BARANG ${kode}:`);
        console.log(barang);
        total += barang[0].harga;
        list_barang.push(barang[0]);
      });
      let kembalian = parseInt(bayar) - parseInt(total);
      let kode_transaksi = await Transaksi.generateKodeTransaksi();
      let tanggal = new Date().toISOString().substr(0, 19).replace('T', ' ');

      if(kembalian < 0){
        return res.status(400).json({ errors: { bayar: "Jumlah pembayaran tidak mencukupi!" } });
      }

      if(!kode_toko){
        const toko = await Toko.first();
        kode_toko_first = toko[0].kode_toko;
      }

      const transaksi = await Transaksi.create({
        kode_transaksi: kode_transaksi,
        kode_toko: kode_toko ?? kode_toko_first,
        kode_kassa: kode_kassa,
        total: total,
        bayar: bayar,
        kembalian: kembalian,
        tanggal: tanggal,
      });
      const attachBarang = await Transaksi.attachBarang(kode_transaksi, list_barang);

      let [dataTransaksi] = await Transaksi.find(kode_transaksi);
      const printBarang = await Transaksi.printBarang(kode_transaksi);
      dataTransaksi = {
        ...dataTransaksi,
        barang: printBarang
      }
      
      res.status(201).json({
        session: "success",
        message: "Data transaksi berhasil disimpan.",
        data: dataTransaksi,
        stored_data: transaksi,
        attach_barang: attachBarang
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ session: "failed", message: "Terjadi kesalahan pada server.", error });
    }
  },
  update: async (req, res) => {
    try {
      const {kode_transaksi, kode_toko, kode_kassa, kode_barang, bayar } = req.body;
      const errors = {};
      if(kode_toko){
        const kodeTokoExist = await Toko.find(kode_toko);
        if (kodeTokoExist.length === 0) {
          errors.kode_toko='Kode toko tidak ditemukan!';
        }
      }
      if(!kode_kassa){
        errors.kode_kassa='Kode kassa harus diisi!';
      }
      const kodeKassaExist = await Kassa.find(kode_kassa);
      if (kodeKassaExist.length === 0) {
        errors.kode_kassa='Kode kassa tidak ditemukan!';
      }
      if(!kode_barang){
        errors.kode_barang='Kode barang harus diisi!';
      }
      if(!bayar || bayar <= 0){
        errors.bayar='Jumlah pembayaran harus diisi dan hanya angka positif!';
      }
      if(!kode_transaksi){
        errors.kode_transaksi='Kode barang harus diisi!';
      }
      const kodeTransaksiExist = await Transaksi.find(kode_transaksi);
      if (kodeTransaksiExist.length === 0) {
        errors.kode_transaksi='Kode transaksi tidak ditemukan!';
      }
      if (errors && Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      let total = 0;
      let kode_toko_first = null;
      let list_barang = [];
      kode_barang.forEach(async (kode) => {
        const barang = await Barang.find(kode);
        console.log(`BARANG ${kode}:`);
        console.log(barang);
        total += barang[0].harga;
        list_barang.push(barang[0]);
      });
      let kembalian = parseInt(bayar) - parseInt(total);
      let tanggal = new Date().toISOString().substr(0, 19).replace('T', ' ');

      if(kembalian < 0){
        return res.status(400).json({ errors: { bayar: "Jumlah pembayaran tidak mencukupi!" } });
      }

      if(!kode_toko){
        const toko = await Toko.first();
        kode_toko_first = toko[0].kode_toko;
      }

      const transaksi = await Transaksi.update(
        kode_transaksi,
        {
          kode_toko: kode_toko ?? kode_toko_first,
          kode_kassa: kode_kassa,
          total: total,
          bayar: bayar,
          kembalian: kembalian,
          tanggal: tanggal,
        }
      );

      const detachBarang = await Transaksi.detachBarang(kode_transaksi);
      const attachBarang = await Transaksi.attachBarang(kode_transaksi, list_barang);
      
      let [dataTransaksi] = await Transaksi.find(kode_transaksi);
      const printBarang = await Transaksi.printBarang(kode_transaksi);
      dataTransaksi = {
        ...dataTransaksi,
        barang: printBarang
      }

      res.status(201).json({
        session: "success",
        message: "Data transaksi berhasil diubah.",
        data: dataTransaksi,
        stored_data: transaksi,
        detach_barang: detachBarang,
        attach_barang: attachBarang
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ session: "failed", message: "Terjadi kesalahan pada server.", error });
    }
  },
  delete: async (req, res) => {
    try {
      const { kode_transaksi } = req.body;
      const errors = [];
      const kodeTransaksiExist = await Transaksi.find(kode_transaksi);
      if (kodeTransaksiExist.length === 0) {
        errors.kode_transaksi='Kode transaksi tidak ditemukan!';
      }
      if(!kode_transaksi){
        errors.kode_transaksi='Kode transaksi harus diisi!';
      }
      if (errors && Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }
      const result = await Transaksi.delete(kode_transaksi);
      if (result.affectedRows > 0) {
        return res.status(200).json({ 
          session: "success",
          message: "Data transaksi telah dihapus.",
          data: result
        });
      }else{
        return res.status(200).json({ 
          session: "failed",
          message: "Data transaksi gagal dihapus.",
          data: result
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ session: "failed", message: "Terjadi kesalahan pada server.", error });
    }
  },
  generateDummy: async (req, res) => {
    let insertedData = [];
    const JUMLAH_TRANSAKSI = 365 * 40;
    const toko = await Toko.first();
    const kode_toko = toko[0].kode_toko;

    function getRandomDate(days) {
      const now = new Date();
      const pastDate = new Date();
      pastDate.setDate(now.getDate() - days);
      
      return new Date(pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime()));
    }

    for(let index_transaksi = 0; index_transaksi < JUMLAH_TRANSAKSI; index_transaksi++) {
      const kassa = await Kassa.random();
      const kode_kassa = kassa[0].kode_kassa;
      let jumlah_barang = Math.ceil(Math.random() * 10);
      if(jumlah_barang === 0) {
        jumlah_barang = 1;
      }
      let bayar = 0;
      let total = 0;
      let kembalian = 0;
      let tanggal = getRandomDate(365);
      let tanggal_formated = tanggal.toISOString().substr(0, 19).replace('T', ' ');
      let kode_transaksi = await Transaksi.generateKodeTransaksi(tanggal);
      let list_barang = [];

      for(let i = 1; i <= jumlah_barang; i++) {
        const barang = await Barang.random();
        total += barang[0].harga;
        list_barang.push(barang[0]);
      }

      bayar = Math.ceil(total / 50000) * 50000;
      kembalian = bayar - total;

      const transaksi = await Transaksi.create({
        kode_transaksi: kode_transaksi,
        kode_toko: kode_toko,
        kode_kassa: kode_kassa,
        total: total,
        bayar: bayar,
        kembalian: kembalian,
        tanggal: tanggal_formated,
      });

      const attach_barang = await Transaksi.attachBarang(kode_transaksi, list_barang);

      if(transaksi.affectedRows > 0) {
        // insertedData.push({
        //   kode_transaksi: kode_transaksi,
        //   kode_toko: kode_toko,
        //   kode_kassa: kode_kassa,
        //   total: bayar,
        //   bayar: bayar,
        //   kembalian: 0,
        //   tanggal: tanggal,
        //   attach_barang: attach_barang,
        //   jumlah_barang: jumlah_barang
        // });
      }
    }

    res.status(201).json({
      session: "success",
      message: "Data transaksi berhasil disimpan.",
      data: insertedData
    });
  },
};


module.exports = transaksiController;