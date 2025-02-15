const db = require("../config/db");
const { transaksi, random } = require("./barang");

const Kassa = {
  all: async () => {
    const [rows] = await db.query("SELECT * FROM Kassa");
    return rows;
  },
  find: async (kode_kassa) => {
    const [rows] = await db.query("SELECT * FROM Kassa WHERE kode_kassa = ?", [kode_kassa]);
    return rows;
  },
  create: async (kassa) => {
    const {kode_kassa, nama_kassa} = kassa;
    const [result] = await db.query("INSERT INTO Kassa (kode_kassa, nama_kassa) VALUES (?, UPPER(?))", [kode_kassa, nama_kassa]);
    return result;
  },
  update: async (param_kode_kassa, kassa) => {
    const {nama_kassa,kode_kassa} = kassa;
    const [result] = await db.query("UPDATE Kassa SET nama_kassa = UPPER(?), kode_kassa = ? WHERE kode_kassa = ?", [nama_kassa, kode_kassa, param_kode_kassa]);
    return result;
  },
  delete: async (kode_kassa) => {
    const [result] = await db.query("DELETE FROM Kassa WHERE kode_kassa = ?", [kode_kassa]);
    return result;
  },
  transaksi: async () => {
    const [rows] = await db.query(`
      SELECT * FROM Transaksi
      INNER JOIN Kassa ON Transaksi.kode_kassa = Kassa.kode_kassa
    `);
    return rows;
  },
  random: async () => {
    const [rows] = await db.query("SELECT * FROM Kassa ORDER BY RAND() LIMIT 1");
    return rows;
  },
  paginate: async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const [rows] = await db.query("SELECT * FROM Kassa LIMIT ? OFFSET ?", [limit, offset]);

    // Dapatkan total jumlah data untuk perhitungan total halaman
    const [[{ total }]] = await db.query("SELECT COUNT(*) as total FROM Kassa");

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
};

module.exports = Kassa;