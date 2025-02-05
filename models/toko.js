const db = require("../config/db");

const Toko = {
  async all(){
    const [rows] = await db.query("SELECT * FROM Toko");
    return rows;
  },
  async find(kode_toko){
    const [rows] = await db.query("SELECT * FROM Toko WHERE kode_toko = ?", [kode_toko]);
    return rows;
  },
  async first(){
    const [rows] = await db.query("SELECT * FROM Toko LIMIT 1");
    return rows;
  },
  async create(toko){
    const {kode_toko, nama_toko, nama_perusahaan, alamat, nomor_telepon} = toko;
    const [result] = await db.query("INSERT INTO Toko (kode_toko, nama_toko, nama_perusahaan, alamat, nomor_telepon) VALUES (?, ?, ?, ?, ?)", [kode_toko, nama_toko, nama_perusahaan, alamat, nomor_telepon]);
    return result;
  },
  async update(kode_toko, toko){
    const {nama_toko, nama_perusahaan, alamat, nomor_telepon} = toko;
    const [result] = await db.query("UPDATE Toko SET nama_toko = ?, nama_perusahaan = ?, alamat = ?, nomor_telepon = ? WHERE kode_toko = ?", [nama_toko, nama_perusahaan, alamat, nomor_telepon, kode_toko]);
    return result;
  },
  async updateFirst(kode_toko_first, toko){
    const {kode_toko, nama_toko, nama_perusahaan, alamat, nomor_telepon} = toko;
    const [result] = await db.query("UPDATE Toko SET kode_toko = ?, nama_toko = ?, nama_perusahaan = ?, alamat = ?, nomor_telepon = ? WHERE kode_toko = ?", [kode_toko, nama_toko, nama_perusahaan, alamat, nomor_telepon, kode_toko_first]);
    return result;
  },
  async delete(kode_toko){
    const [result] = await db.query("DELETE FROM Toko WHERE kode_toko = ?", [kode_toko]);
    return result;
  }
}

module.exports = Toko;
