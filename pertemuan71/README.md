# Pertemuan 7.1: Navigasi Mobile

Contoh aplikasi pendataan inventaris UMKM untuk mempraktikkan navigasi bertingkat
dengan React Navigation dan Expo.

## Jenis navigasi

- **Stack**: membuka layar tambah barang dan detail barang dari layar utama.
- **Bottom Tab**: berpindah antara katalog, stok kritis, dan ringkasan.
- **Drawer**: menyediakan menu katalog, stok kritis, ringkasan, dan profil usaha.

Secara default aplikasi menggunakan Bottom Tab. Untuk mencoba Drawer, ubah
`NAVIGATION_MODE` di bagian atas `App.js` menjadi `'DRAWER'`.

## Fitur praktik

- Mencari dan memfilter produk berdasarkan kategori.
- Membuka detail produk dan menambah atau mengurangi stok.
- Menambah produk dengan validasi isian.
- Melihat stok kritis, ringkasan aset, dan profil usaha.
- Memahami berbagi state produk antarlayar menggunakan React Context.

Data contoh disimpan di memori aplikasi, sehingga perubahan akan kembali ke data
awal setelah aplikasi dimulai ulang.

## Menjalankan aplikasi

```bash
npm install
npx expo start
```

Scan QR code dengan Expo Go, tekan `a` untuk Android Emulator, atau `w` untuk
membuka versi web.
