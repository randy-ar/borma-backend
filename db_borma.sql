-- Sistem Informasi Kasir BORMA TOSERBA

-- Kamus Data:

-- Table Toko				
-- Nama Field	Tipe Data	Panjang	Kunci	Keterangan
-- kode_toko	Varchar	20	Primary Key	unique, not null
-- nama_toko	Varchar	60	-	not null
-- nama_perusahaan	Varchar	60	-	not null
-- alamat	Varchar	255	-	not null
-- nomor_telepon	Varchar	20	-	not null
				
				
-- Table Transaksi				
-- Nama Field	Tipe Data	Panjang	Kunci	Keterangan
-- kode_transaksi	Varchar	100	Primary Key	unique, not null
-- kode_toko	Varchar	20	Foreign key references toko(kode_toko) on delete set null on update cascade	not null
-- kode_kassa	Varchar	20	Foreign key references kassa(kode_kassa) on delete set null on update cascade	not null
-- total	Integer	10	-	not null
-- bayar	Integer	10	-	not null
-- kembalian	Integer	10	-	not null
-- tanggal	Datetime	-	-	not null
				
				
-- Table BarangTransaksi				
-- Nama Field	Tipe Data	Panjang	Kunci	Keterangan
-- id	BigInteger	21	Primary	auto_increment, not null, unsigned
-- kode_transaksi	Varchar	100	Foreign key references transaksi(kode_transaksi) on delete cascade on update cascade	not null
-- kode_barang	Varchar	7	Foreign key references transaksi(kode_transaksi) on delete cascade on update cascade	not null
				
				
-- Table Barang 				
-- Nama Field	Tipe Data	Panjang	Kunci	Keterangan
-- kode_barang	Varchar	7	Primary	unique, not null
-- nama	Varchar	30	-	not null
-- harga	Integer	10	-	not null
				
-- Tabel Kassa				
-- Nama Field	Tipe Data	Panjang	Kunci	Keterangan
-- kode_kassa	Varchar	20	Primary	unique, not null
-- nama	Varchar	20	-	not null

CREATE DATABASE IF NOT EXISTS db_borma;
USE db_borma;

CREATE TABLE Toko(
    kode_toko VARCHAR(20) PRIMARY KEY,
    nama_toko VARCHAR(60) NOT NULL,
    nama_perusahaan VARCHAR(60) NOT NULL,
    alamat VARCHAR(255) NOT NULL,
    nomor_telepon VARCHAR(20) NOT NULL
);

CREATE TABLE Kassa(
    kode_kassa VARCHAR(5) PRIMARY KEY,
    nama VARCHAR(10) NOT NULL
);

CREATE TABLE Transaksi(
    kode_transaksi VARCHAR(100) PRIMARY KEY,
    kode_toko VARCHAR(20) NULL,
    kode_kassa VARCHAR(5) NULL,
    total INT NOT NULL,
    bayar INT NOT NULL,
    kembalian INT NOT NULL,
    tanggal DATETIME NOT NULL,
    
    FOREIGN KEY (kode_toko) REFERENCES Toko(kode_toko) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (kode_kassa) REFERENCES Kassa(kode_kassa) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE Barang(
    kode_barang VARCHAR(7) PRIMARY KEY,
    nama VARCHAR(30) NOT NULL,
    harga INT NOT NULL
);

CREATE TABLE BarangTransaksi(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    kode_transaksi VARCHAR(100) NOT NULL,
    kode_barang VARCHAR(7) NOT NULL,

    FOREIGN KEY (kode_transaksi) REFERENCES Transaksi(kode_transaksi) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (kode_barang) REFERENCES Barang(kode_barang) ON DELETE CASCADE ON UPDATE CASCADE
);
