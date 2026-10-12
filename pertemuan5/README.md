# Pertemuan 5: Implementasi UI Modern & Form Input Profil dengan React Native Paper

Dokumentasi lengkap proyek praktikum **Pertemuan 5** mata kuliah Pemrograman Mobile. Proyek ini berfokus pada refaktorisasi antarmuka pengguna (UI) **Sistem Akademik Mahasiswa** serta penambahan **Formulir Input Profil Interaktif** yang memanfaatkan beragam komponen resmi dari pustaka berbasis Material Design (**React Native Paper v5**).

---

## 📋 Daftar Isi
1. [Deskripsi Proyek](#-deskripsi-proyek)
2. [Hasil Analisis Proyek](#-hasil-analisis-proyek)
   - [Tujuan & Konsep Pembelajaran](#tujuan--konsep-pembelajaran)
   - [Struktur & Arsitektur Data Reaktif](#struktur--arsitektur-data-reaktif)
   - [Bedah Komponen React Native Paper yang Digunakan](#bedah-komponen-react-native-paper-yang-digunakan)
   - [Komparasi: Pertemuan 4 vs Pertemuan 5](#komparasi-pertemuan-4-vs-pertemuan-5)
   - [Temuan Teknis & Solusi Implementasi](#temuan-teknis--solusi-implementasi)
3. [Panduan Pembuatan (Step-by-Step)](#-panduan-pembuatan-step-by-step)
4. [Panduan Penggunaan & Menjalankan Proyek](#-panduan-penggunaan--menjalankan-proyek)
5. [Fitur Interaktif & Cara Uji Coba Form](#-fitur-interaktif--cara-uji-coba-form)
6. [Struktur File Proyek](#-struktur-file-proyek)
7. [Praktik Terbaik (Best Practices) & Rekomendasi](#-praktik-terbaik-best-practices--rekomendasi)

---

## 📖 Deskripsi Proyek

Pada Pertemuan 4, antarmuka Sistem Akademik Mahasiswa dibuat menggunakan komponen dasar React Native (`View`, `Text`, `Image`, `ScrollView`) dengan styling manual.

Pada **Pertemuan 5**, proyek ini dikembangkan secara signifikan menjadi aplikasi yang kaya fitur interaktif dan terstandarisasi dengan **React Native Paper (MD3)**:
1. **Profil Mahasiswa**: Kartu profil lengkap dengan avatar sirkular, grid statistik akademik, info kontak, serta deretan chip minat.
2. **Formulir Input Profil Lengkap**: Form pengisian data mahasiswa yang memanfaatkan komponen-komponen input Material Design paling populer.
3. **Kartu Hasil Studi (KHS)**: Tabel data nilai mahasiswa dengan dukungan **Horizontal Scroll** yang fleksibel dan tombol unduh KHS.
4. **Data Reaktif & Feedback Visual**: State form terhubung langsung ke tampilan profil dan dilengkapi notifikasi pop-up (`Snackbar`).

---

## 🔬 Hasil Analisis Proyek

### Tujuan & Konsep Pembelajaran
1. **Pengenalan Library UI Material Design**: Menguasai integrasi `react-native-paper` pada ekosistem Expo/React Native.
2. **Form Handling & Validasi**: Memahami pengelolaan state form input, validasi dinamis dengan `HelperText`, dan penanganan berbagai tipe masukan data.
3. **Two-Way Binding & Reactivity**: Menghubungkan masukan pengguna dari form langsung ke komponen penampil data di bagian atas secara instan.
4. **Responsive Table Navigation**: Menerapkan `<ScrollView horizontal>` pada `<DataTable>` agar data tabel yang lebar tetap dapat digeser dengan mulus tanpa terpotong.

---

### Struktur & Arsitektur Data Reaktif

Alur hierarki komponen dalam aplikasi:

```
index.js
  └── App.js
        └── PaperProvider (Material Design 3 Theme Context)
              └── View (Root Container)
                    ├── PaperText (Judul Halaman)
                    ├── ScrollView (Container Vertikal)
                    │     ├── Card 1: Profil Mahasiswa
                    │     │     ├── Avatar.Image (Foto Profil)
                    │     │     ├── PaperText (Nama, NPM, Prodi, Info Kontak)
                    │     │     ├── View (Grid Statistik: Smt, IPK, Status, Gender)
                    │     │     └── Chip[] (Daftar Peminatan Terpilih)
                    │     │
                    │     ├── Card 2: Form Input Profil Mahasiswa
                    │     │     ├── TextInput & HelperText (Nama, NPM Validasi 10 Digit)
                    │     │     ├── RadioButton.Group (Pilihan Jenis Kelamin)
                    │     │     ├── TextInput & HelperText (Email Validasi Format, No. HP, Alamat)
                    │     │     ├── SegmentedButtons (Pilihan Prodi & Semester 1-6)
                    │     │     ├── TextInput (IPK)
                    │     │     ├── Checkbox.Item[] (Peminatan Multi-Select)
                    │     │     ├── Switch[] (Toggle Status Aktif & Notifikasi)
                    │     │     ├── Divider (Pemisah Antar Seksi Form)
                    │     │     └── Button[] (Tombol Simpan Profil & Reset Form)
                    │     │
                    │     └── Card 3: Kartu Hasil Studi (KHS)
                    │           ├── ScrollView (Horizontal Scroll Wrapper)
                    │           │     └── DataTable (Header, Row, Cell Mata Kuliah)
                    │           ├── View (Footer Total SKS)
                    │           └── Button (Unduh KHS dengan Icon Download)
                    │
                    └── Snackbar (Notifikasi Feedback Pop-Up di Bagian Bawah Layar)
```

---

### Bedah Komponen React Native Paper yang Digunakan

| Komponen Paper | Peran & Penggunaan dalam Proyek |
| :--- | :--- |
| **`Provider` (`PaperProvider`)** | Komponen pembungkus utama (*root provider*) yang mengalirkan tema dan styling Material Design ke seluruh komponen anak. |
| **`Card` & `Card.Content`** | Wadah modular untuk memisahkan ketiga bagian aplikasi (Profil, Form Input, dan Tabel KHS). |
| **`Avatar.Image`** | Menampilkan gambar profil sirkular proporsional dengan properti `size={80}`. |
| **`TextInput`** | Input teks interaktif bergaya `mode="outlined"` dengan ikon bawaan (`left={<TextInput.Icon icon="..." />}`), mendukung keyboard numerik, email, dan multiline. |
| **`HelperText`** | Memberikan pesan petunjuk atau error validasi secara real-time di bawah input NPM dan Email (`type="info"` / `type="error"`). |
| **`RadioButton.Group` & `RadioButton.Item`** | Komponen pilihan tunggal (*single-choice*) untuk memilih Jenis Kelamin (Laki-laki / Perempuan). |
| **`SegmentedButtons`** | Tombol bertingkat modern untuk memilih Program Studi (D3 MI, D4 TI, S1 SI) dan Semester (1 sampai 6). |
| **`Checkbox.Item`** | Kotak centang pilihan ganda (*multi-select*) untuk memilih bidang peminatan (Mobile, Web, AI, UI/UX). |
| **`Switch`** | Saklar geser (*toggle switch*) untuk status keaktifan mahasiswa dan langganan notifikasi akademik. |
| **`Chip`** | Menampilkan label tag peminatan yang dipilih secara visual dan ringkas di dalam kartu profil. |
| **`Divider`** | Garis batas tipis Material Design yang memisahkan seksi-seksi di dalam form. |
| **`DataTable`** | Merender tabel KHS dengan subkomponen: `DataTable.Header`, `DataTable.Title`, `DataTable.Row`, dan `DataTable.Cell`. |
| **`Button`** | Tombol aksi material dengan dukungan mode `contained` / `outlined` dan ikon (Simpan, Reset, Download). |
| **`Snackbar`** | Notifikasi mengambang (*toast*) di bagian bawah layar yang memberi konfirmasi saat data disimpan atau di-reset. |

---

### Komparasi: Pertemuan 4 vs Pertemuan 5

| Fitur / Aspek | Pertemuan 4 (Native + Manual Style) | Pertemuan 5 (React Native Paper) |
| :--- | :--- | :--- |
| **UI Library** | React Native murni (tanpa UI library) | React Native Paper (Material Design 3) |
| **Interaktivitas Form** | Tidak memiliki form input | Form input lengkap dengan 10+ komponen input Material |
| **Validasi Input** | Belum ada validasi | Validasi dinamis real-time menggunakan `HelperText` |
| **Tabel KHS** | Menggunakan banyak `<View>` flexbox bersarang | Menggunakan `<DataTable>` terstruktur dan rapi |
| **Scroll Horizontal** | Horizontal Scroll manual | `<ScrollView horizontal>` membungkus `<DataTable minWidth={440}>` |
| **Manajemen Feedback** | Menggunakan `alert()` bawaan sistem | `Snackbar` material non-blocking yang halus |
| **Konsistensi Desain** | Bergantung pada style manual masing-masing | Terstandardisasi dengan token Material Design 3 |

---

### Temuan Teknis & Solusi Implementasi

1. **Resolusi Scroll Horizontal pada DataTable**:
   - *Masalah*: Pada implementasi awal `DataTable`, tabel terkekang oleh batas lebar kartu sehingga tidak dapat di-scroll horizontal dan kolom teks menjadi sempit.
   - *Solusi*: Membungkus `<DataTable>` dengan `<ScrollView horizontal showsHorizontalScrollIndicator={false}>`, memberikan `minWidth: 440` pada tabel, serta menetapkan ukuran kolom spesifik (`colMk: 200px`, `colSks: 60px`, dst.).
2. **Reaktivitas Antara Form dan Profile Card**:
   - *Solusi*: Data profil dijadikan `useState` (`mahasiswa`). Saat tombol **Simpan Profil** ditekan, state induk diperbarui sehingga Card Profil di bagian atas langsung mencerminkan data terbaru seketika.
3. **Penyelarasan Tipe Komponen**:
   - Seluruh komponen input menggunakan atribut `position="leading"` dan `mode="android"` agar tata letak checkbox dan radio button selaras dan intuitif bagi pengguna Android/iOS.

---

## 🛠️ Panduan Pembuatan (Step-by-Step)

### Langkah 1: Inisialisasi Proyek Expo
```bash
npx create-expo-app@latest pertemuan5 --template blank
cd pertemuan5
```

### Langkah 2: Instalasi Dependensi Pustaka UI
Pasang pustaka React Native Paper dan paket ikon:
```bash
npx expo install react-native-paper @react-native-vector-icons/material-design-icons
```

### Langkah 3: Penyiapan Aset Lokal
Pastikan gambar profil tersedia pada:
```
pertemuan5/assets/profil.png
```

### Langkah 4: Implementasi Logika & Komponen di `App.js`
1. Impor semua komponen Paper yang dibutuhkan dari `react-native-paper`.
2. Siapkan state untuk data profil mahasiswa dan state untuk masing-masing field form.
3. Susun fungsi `handleSimpanProfil` dan `handleResetForm`.
4. Buat Card Profil Mahasiswa dengan `Card`, `Avatar.Image`, dan `Chip`.
5. Buat Card Formulir dengan `TextInput`, `HelperText`, `RadioButton.Group`, `SegmentedButtons`, `Checkbox.Item`, `Switch`, dan `Button`.
6. Buat Card KHS dengan `<ScrollView horizontal>` dan `<DataTable>`.
7. Tambahkan `<Snackbar>` di bawah ScrollView.

---

## 🚀 Panduan Penggunaan & Menjalankan Proyek

### Prasyarat Sistem
- **Node.js** versi 18.x atau yang lebih baru.
- **npm** (atau yarn / bun).
- Perangkat HP dengan aplikasi **Expo Go** terpasang, atau Emulator Android / Simulator iOS.

### 1. Masuk ke Direktori Proyek
```bash
cd pertemuan5
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Server Development
```bash
npx expo start
```
*atau:*
```bash
npm start
```

### 4. Membuka Aplikasi
- **Smartphone Fisik**: Scan QR Code di terminal menggunakan Expo Go (Android) atau aplikasi Kamera (iOS).
- **Android Emulator**: Tekan tombol `a` pada keyboard di terminal.
- **Web Browser**: Tekan tombol `w` pada keyboard di terminal.

---

## 🧪 Fitur Interaktif & Cara Uji Coba Form

Setelah aplikasi berjalan di perangkat Anda:

1. **Uji Coba Pengisian Teks & Validasi**:
   - Ubah teks pada kolom **Nama Lengkap**.
   - Hapus salah satu digit pada kolom **NPM**: perhatikan pesan `HelperText` di bawahnya berubah menjadi merah (*"NPM harus tepat 10 digit angka"*).
   - Ketik email tanpa karakter `@` atau domain: perhatikan pesan `HelperText` berubah menjadi peringatan format email.
2. **Uji Coba Pilihan Single & Multi**:
   - Pilih Jenis Kelamin menggunakan **RadioButton**.
   - Pilih Program Studi dan Semester menggunakan tombol **SegmentedButtons**.
   - Centang atau hapus centang bidang peminatan pada **Checkbox**.
3. **Uji Coba Toggle Switch**:
   - Matikan switch **Status Mahasiswa Aktif** (status akan berubah menjadi 'Cuti' dengan warna merah).
4. **Uji Coba Simpan Profil**:
   - Tekan tombol **Simpan Profil**.
   - Perhatikan **Card Profil Mahasiswa di bagian atas langsung terupdate** dengan nama baru, semester baru, chip minat baru, dan status baru.
   - Pop-up **Snackbar** akan muncul di bagian bawah layar mengonfirmasi perubahan.
5. **Uji Coba Scroll Horizontal Tabel KHS**:
   - Gulir ke Card KHS di bagian paling bawah.
   - Geser tabel ke arah kanan/kiri untuk melihat seluruh kolom (Mata Kuliah, SKS, Nilai, Semester) dengan leluasa.
6. **Uji Coba Reset Form**:
   - Tekan tombol **Reset Form** untuk mengembalikan seluruh isian ke data bawaan awal.

---

## 📁 Struktur File Proyek

```text
pertemuan5/
├── assets/               # Aset gambar & ikon
│   ├── profil.png        # Foto profil mahasiswa untuk Avatar
│   ├── icon.png          # Ikon launcher
│   └── splash-icon.png   # Gambar splash screen
├── App.js                # Kode utama: Profil, Form Input Paper, & DataTable KHS
├── app.json              # Konfigurasi aplikasi Expo
├── index.js              # Entry point pendaftaran komponen root
├── package.json          # Dependensi & script proyek
└── README.md             # Dokumentasi hasil analisis dan panduan proyek
```

---

## 💡 Praktik Terbaik (Best Practices) & Rekomendasi

1. **Pemisahan Modular Komponen**:
   Untuk arsitektur proyek skala besar, pecah `App.js` ke dalam beberapa berkas terpisah di folder `components/`:
   - `components/ProfileDisplayCard.js`
   - `components/ProfileFormCard.js`
   - `components/KhsTableCard.js`
2. **Validasi Skema (Form Validation Schema)**:
   Gunakan pustaka seperti `Formik` atau `React Hook Form` bersama `Zod` atau `Yup` untuk mengelola form kompleks dengan aturan validasi mendalam.
3. **Theming Konsisten**:
   Gunakan properti `theme` pada `PaperProvider` untuk menerapkan tema warna korporat/kampus di seluruh komponen aplikasi tanpa perlu mengganti warna di setiap style individual.

---
*Dokumentasi ini disusun untuk praktikum Pertemuan 5 - Pemrograman Mobile.*
