const db = require("../config/db");
const { transaksi } = require("./barang");

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
    const {kode_kassa, nama} = kassa;
    const [result] = await db.query("INSERT INTO Kassa (kode_kassa, nama) VALUES (?, UPPER(?))", [kode_kassa, nama]);
    return result;
  },
  update: async (kode_kassa, kassa) => {
    const {nama} = kassa;
    const [result] = await db.query("UPDATE Kassa SET nama = UPPER(?) WHERE kode_kassa = ?", [nama, kode_kassa]);
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
  }
};

module.exports = Kassa;