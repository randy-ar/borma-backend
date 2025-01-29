const db = require("../config/db");

const Barang = {
  async all(){
    const [rows] = await db.query("SELECT * FROM Barang");
    return rows;
  },
  async find(kode_barang){
    const [rows] = await db.query("SELECT * FROM Barang WHERE kode_barang = ?", [kode_barang]);
    return rows;
  },
  async delete(kode_barang){
    const [result] = await db.query("DELETE FROM Barang WHERE kode_barang = ?", [kode_barang]);
    return result;
  },
  async create(barang){
    const {kode_barang, nama, harga} = barang;
    const [result] = await db.query("INSERT INTO Barang (kode_barang, nama, harga) VALUES (?, UPPER(?), ?)", [kode_barang, nama, harga]);
    return result;
  },
  async update(kode_barang, barang){
    const {nama, harga} = barang;
    const [result] = await db.query("UPDATE Barang SET nama = UPPER(?), harga = ? WHERE kode_barang = ?", [nama, harga, kode_barang]);
    return result;  
  },
  async transaksi(){
    const [rows] = await db.query(`
      SELECT * FROM Transaksi 
      INNER JOIN BarangTransaksi ON Transaksi.kode_transaksi = BarangTransaksi.kode_transaksi
      INNER JOIN Barang ON BarangTransaksi.kode_barang = Barang.kode_barang
    `);
    return rows;
  },
  /**
   * @param {Array<String>} kode_barang 
   */
  async whereIn(kode_barang){
    const [rows] = await db.query("SELECT * FROM Barang WHERE kode_barang IN (?)", [kode_barang]);
    return rows;
  },
};

module.exports = Barang;