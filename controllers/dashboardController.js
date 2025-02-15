const db = require("../config/db");

const dashboardController = {
  index: async (req, res) => {
    try {
      const [jumlah_barang] = await db.query("SELECT COUNT(*) AS jumlah_barang FROM Barang");
      const [jumlah_kassa] = await db.query("SELECT COUNT(*) AS jumlah_kassa FROM Kassa");
      const [jumlah_transaksi_hari_ini] = await db.query("SELECT COUNT(*) AS jumlah_transaksi_hari_ini FROM Transaksi WHERE DATE(tanggal) = DATE(CURDATE())");
      const [jumlah_transaksi_hari_kemarin] = await db.query("SELECT COUNT(*) AS jumlah_transaksi_hari_kemarin FROM Transaksi WHERE DATE(tanggal) = DATE(CURDATE() - INTERVAL 1 DAY)");
      const [jumlah_penjualan_hari_ini] = await db.query("SELECT CAST(SUM(total) AS INT) AS jumlah_penjualan_hari_ini FROM Transaksi WHERE DATE(tanggal) = DATE(CURDATE())");
      const [jumlah_penjualan_hari_kemarin] = await db.query("SELECT CAST(SUM(total) AS INT) AS jumlah_penjualan_hari_kemarin FROM Transaksi WHERE DATE(tanggal) = DATE(CURDATE() - INTERVAL 1 DAY)");

      const persentase_transaksi = (jumlah_transaksi_hari_ini[0].jumlah_transaksi_hari_ini - jumlah_transaksi_hari_kemarin[0].jumlah_transaksi_hari_kemarin) / jumlah_transaksi_hari_kemarin[0].jumlah_transaksi_hari_kemarin * 100;
      const persentase_penjualan = (jumlah_penjualan_hari_ini[0].jumlah_penjualan_hari_ini - jumlah_penjualan_hari_kemarin[0].jumlah_penjualan_hari_kemarin) / jumlah_penjualan_hari_kemarin[0].jumlah_penjualan_hari_kemarin * 100;

      const [series] = await db.query(`
        SELECT 
          CAST(SUM(total) AS INT) AS y, 
          DATE_FORMAT(MIN(tanggal), '%Y-%m-%d') AS x 
        FROM Transaksi
        WHERE tanggal >= DATE_SUB(CURDATE(), INTERVAL 2 YEAR)
        GROUP BY DATE(tanggal)
        ORDER BY tanggal DESC
      `);

      const [barang_terlaris_bulan_ini] = await db.query("SELECT Barang.kode_barang, Barang.nama_barang, COUNT(Barang.kode_barang) AS jumlah_barang FROM Transaksi INNER JOIN BarangTransaksi ON Transaksi.kode_transaksi = BarangTransaksi.kode_transaksi INNER JOIN Barang ON BarangTransaksi.kode_barang = Barang.kode_barang WHERE MONTH(tanggal) = MONTH(CURDATE()) GROUP BY Barang.kode_barang ORDER BY jumlah_barang DESC LIMIT 10");

      res.status(200).json({
        data:{
          jumlah_barang: jumlah_barang[0].jumlah_barang,
          jumlah_kassa: jumlah_kassa[0].jumlah_kassa,
          jumlah_transaksi_hari_ini: jumlah_transaksi_hari_ini[0].jumlah_transaksi_hari_ini,
          jumlah_transaksi_hari_kemarin: jumlah_transaksi_hari_kemarin[0].jumlah_transaksi_hari_kemarin,
          jumlah_penjualan_hari_ini: jumlah_penjualan_hari_ini[0].jumlah_penjualan_hari_ini,
          jumlah_penjualan_hari_kemarin: jumlah_penjualan_hari_kemarin[0].jumlah_penjualan_hari_kemarin,
          persentase_transaksi: persentase_transaksi,
          persentase_penjualan: persentase_penjualan,
          barang_terlaris_bulan_ini: barang_terlaris_bulan_ini,
          series: series,
        }
      })
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ session: "failed", message: "Terjadi kesalahan pada server.", error });
    }
  },
}

module.exports = dashboardController;