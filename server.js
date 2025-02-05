// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const tokoRoutes = require("./routes/tokoRoutes");
const barangRoutes = require("./routes/barangRoutes");
const kassaRoutes = require("./routes/kassaRoutes");
const transaksiRoutes = require("./routes/transaksiRoutes");


dotenv.config();

const app = express();
// Middleware CORS
app.use(cors({
  origin: "*", // Sesuaikan dengan URL frontend Vue.js
  credentials: true // Jika menggunakan cookies atau sesi
}));

app.use(express.json());

// Routes
app.use("/api/toko", tokoRoutes);
app.use("/api/barang", barangRoutes);
app.use("/api/kassa", kassaRoutes);
app.use("/api/transaksi", transaksiRoutes);

// Error handling
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan pada port ${PORT}`);
});
