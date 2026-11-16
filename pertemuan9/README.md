# Data Mahasiswa

Aplikasi React Native berbasis Expo yang menampilkan daftar mahasiswa menggunakan
React Native Paper. Setiap item pada daftar dapat ditekan untuk membuka data
lengkap mahasiswa.

## Fitur

- Menampilkan daftar mahasiswa berisi nama dan NIM.
- Membuka detail mahasiswa ketika item ditekan.
- Menampilkan jurusan, angkatan, email, nomor telepon, dan alamat.
- Tampilan menggunakan komponen Material Design dari React Native Paper.
- Menyimpan dan membaca data mahasiswa menggunakan SQLite lokal.
- Menampilkan icon aplikasi pada header dan icon peringatan saat terjadi error.

## Persyaratan

- Node.js LTS dan npm.
- Expo Go pada Android/iOS, atau emulator Android/iOS.
- Perangkat komputer dan ponsel berada pada jaringan yang sama jika memakai
  Expo Go melalui koneksi LAN.

## Cara membuat project dari awal

1. Buat project Expo baru:

   ```bash
   npx create-expo-app@latest pertemuan9
   cd pertemuan9
   ```

2. Pasang React Native Paper:

   ```bash
   npx expo install react-native-paper
   ```

3. Pasang SQLite Expo:

   ```bash
   npx expo install expo-sqlite
   ```

4. Ganti isi `App.js` dengan implementasi daftar dan detail mahasiswa.

5. Jalankan project dengan salah satu perintah pada bagian berikut.

## Cara menjalankan

Pasang dependency terlebih dahulu jika project baru saja di-clone:

```bash
npm install
```

Jalankan development server:

```bash
npm start
```

Pilihan target:

```bash
npm run android
npm run ios
npm run web
```

Setelah server berjalan, scan QR code menggunakan Expo Go atau tekan tombol
target yang sesuai pada terminal. Untuk koneksi jaringan yang bermasalah, jalankan
mode tunnel:

```bash
npx expo start --tunnel
```

## Mengubah data mahasiswa

Data contoh berada pada konstanta `initialMahasiswa` di `App.js`. Tambah atau ubah
object pada array tersebut dengan properti `nim`, `nama`, `jurusan`, `angkatan`,
`email`, `noTelepon`, dan `alamat`.

Saat aplikasi pertama kali dijalankan, tabel `mahasiswa` dibuat otomatis pada
database lokal `mahasiswa.db`. Data contoh dimasukkan menggunakan
`INSERT OR IGNORE`, sehingga tidak dibuat duplikat pada pembukaan aplikasi
berikutnya.

Untuk target web, `metro.config.js` sudah dikonfigurasi agar file WASM SQLite
dapat dibundle. Hosting web juga harus meneruskan header
`Cross-Origin-Embedder-Policy: credentialless` dan
`Cross-Origin-Opener-Policy: same-origin`.

## Icon aplikasi

Icon aplikasi Expo dikonfigurasi melalui `app.json` dan menggunakan
`assets/icon.png`. Icon aplikasi yang terlihat di dalam aplikasi menggunakan
komponen `Avatar.Image` dari React Native Paper dan file `assets/icon.png`.
Perubahan icon aplikasi pada
home screen perangkat biasanya membutuhkan rebuild aplikasi atau instalasi ulang
setelah cache Expo dibersihkan.
