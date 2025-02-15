const db = require("../config/db");
const { update } = require("./toko");

const Transaksi = {
  all: async () => {
    const [rows] = await db.query("SELECT * FROM Transaksi");
    return rows;
  },
  find: async (kode_transaksi) => {
    const [rows] = await db.query(`
      SELECT 
        *
      FROM Transaksi
      INNER JOIN Kassa ON Transaksi.kode_kassa = Kassa.kode_kassa
      INNER JOIN Toko ON Transaksi.kode_toko = Toko.kode_toko
      WHERE Transaksi.kode_transaksi = ?
    `, [kode_transaksi]);
    return rows;
  },  
  create: async (transaksi) => {
    const {kode_transaksi, kode_toko, kode_kassa, total, bayar, kembalian, tanggal} = transaksi;
    const [result] = await db.query("INSERT INTO Transaksi (kode_transaksi, kode_toko, kode_kassa, total, bayar, kembalian, tanggal) VALUES (?, ?, ?, ?, ?, ?, ?)", [kode_transaksi, kode_toko, kode_kassa, total, bayar, kembalian, tanggal]);
    return result;
  },
  update: async (kode_transaksi, transaksi) => {
    const {kode_toko, kode_kassa, total, bayar, kembalian, tanggal} = transaksi;
    const [result] = await db.query("UPDATE Transaksi SET kode_toko = ?, kode_kassa = ?, total = ?, bayar = ?, kembalian = ?, tanggal = ? WHERE kode_transaksi = ?", [kode_toko, kode_kassa, total, bayar, kembalian, tanggal, kode_transaksi]);
    return result;
  },
  delete: async (kode_transaksi) => {
    const [result] = await db.query("DELETE FROM Transaksi WHERE kode_transaksi = ?", [kode_transaksi]);
    return result;
  },
  attachBarang: async (kode_transaksi, barang = []) => {
    const {kode_barang} = barang;
    var i = 0;
    barang.forEach(async (barang) => {
      const [result] = await db.query("INSERT INTO BarangTransaksi (kode_transaksi, kode_barang) VALUES (?, ?)", [kode_transaksi, barang.kode_barang]);
      if(result !== undefined && result.affectedRows > 0){
        i = i + result.affectedRows;
      }
    });
    return i;
  },
  detachBarang: async (kode_transaksi) => {
    const [result] = await db.query("DELETE FROM BarangTransaksi WHERE kode_transaksi = ?", [kode_transaksi]);
    return result.affectedRows;
  },
  barang: async (kode_transaksi) => {
    const [rows] = await db.query(`
      SELECT * FROM Barang
      INNER JOIN BarangTransaksi ON BarangTransaksi.kode_barang = Barang.kode_barang
      INNER JOIN Transaksi ON Transaksi.kode_transaksi = BarangTransaksi.kode_transaksi
      WHERE Transaksi.kode_transaksi = ?
    `, [kode_transaksi]);
    return rows;
  },
  printBarang: async (kode_transaksi) => {
    const [rows] = await db.query(`
      SELECT 
        Barang.kode_barang, 
        Barang.nama_barang,
        FORMAT(Barang.harga, 0, 'de_DE') AS harga_formatted,
        Barang.harga,
        COUNT(BarangTransaksi.kode_barang) AS jumlah_barang,
        FORMAT(SUM(Barang.harga), 0, 'de_DE') AS subtotal_formatted,
        CAST(SUM(Barang.harga) AS UNSIGNED) AS subtotal
      FROM Barang
      INNER JOIN BarangTransaksi ON BarangTransaksi.kode_barang = Barang.kode_barang
      INNER JOIN Transaksi ON Transaksi.kode_transaksi = BarangTransaksi.kode_transaksi
      WHERE Transaksi.kode_transaksi = ?
      GROUP BY Barang.kode_barang
    `, [kode_transaksi]);
    return rows;
  },
  generateKodeTransaksi: async (date = new Date()) => {
    // kode_transaksi :
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');

    // Assuming there is a function that counts transactions for the current date
    const [result] = await db.query("SELECT COUNT(*) as count FROM Transaksi WHERE DATE(tanggal) = ?", [date.toISOString().substr(0, 10)]);
    const count = result[0]?.count + 1 ?? 1;


    const kode = String(count).padStart(6, '0');

    const kodeTransaksi = `hadi.C1/${kode}.No/${day}.${month}.${year} ${hour}:${minute}:${second}`;

    return kodeTransaksi;
  },

  paginate: async (page = 1, limit = 10, kode_transaksi = '') => {
    const offset = (page - 1) * limit;
    const [rows] = await db.query("SELECT * FROM Transaksi INNER JOIN Kassa ON Transaksi.kode_kassa = Kassa.kode_kassa INNER JOIN Toko ON Transaksi.kode_toko = Toko.kode_toko WHERE Transaksi.kode_transaksi LIKE ? ORDER BY Transaksi.tanggal DESC LIMIT ? OFFSET ?", ['%'+kode_transaksi+'%', limit, offset]);

    // Dapatkan total jumlah data untuk perhitungan total halaman
    const [[{ total }]] = await db.query("SELECT COUNT(*) as total FROM Transaksi");

    return {
      data: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        perPage: limit
      }
    };
  },
}

module.exports = Transaksi;