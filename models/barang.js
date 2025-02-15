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
    const {kode_barang, nama_barang, harga} = barang;
    const [result] = await db.query("INSERT INTO Barang (kode_barang, nama_barang, harga) VALUES (?, UPPER(?), ?)", [kode_barang, nama_barang, harga]);
    return result;
  },
  async update(param_kode_barang, barang){
    const {nama_barang, harga, kode_barang} = barang;
    const [result] = await db.query("UPDATE Barang SET nama_barang = UPPER(?), harga = ?, kode_barang = ? WHERE kode_barang = ?", [nama_barang, harga, kode_barang, param_kode_barang]);
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

  async random(){
    const [rows] = await db.query("SELECT * FROM Barang ORDER BY RAND() LIMIT 1");
    return rows;
  },

  paginate: async (page = 1, limit = 10, cari = '') => {
    const offset = (page - 1) * limit;
    const [rows] = await db.query("SELECT * FROM Barang WHERE nama_barang LIKE ? OR kode_barang LIKE ? LIMIT ? OFFSET ?", ['%'+cari+'%', '%'+cari+'%', limit, offset]);

    // Dapatkan total jumlah data untuk perhitungan total halaman
    const [[{ total }]] = await db.query("SELECT COUNT(*) as total FROM Barang");

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

module.exports = Barang;