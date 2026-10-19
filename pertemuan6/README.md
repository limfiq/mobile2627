# Pertemuan 6: Stack Navigation (Push & Pop) dengan React Native Paper

Dokumentasi praktikum **Pertemuan 6** mata kuliah Pemrograman Mobile. Proyek ini mengimplementasikan konsep dasar **Stack Navigation** (struktur data tumpukan / LIFO) yang mengelola alur perpindahan layar antara **Login**, **Dashboard**, **Registrasi Akun**, dan **Detail Profil** di dalam satu halaman berkas utama (`App.js`) menggunakan komponen modern berbasis Material Design dari **React Native Paper**.

---

## 📋 Daftar Isi
1. [Deskripsi Proyek](#-deskripsi-proyek)
2. [Konsep Stack Navigation (Push & Pop)](#-konsep-stack-navigation-push--pop)
3. [Bedah Komponen React Native Paper](#-bedah-komponen-react-native-paper)
4. [Alur Navigasi & Arsitektur Layar](#-alur-navigasi--arsitektur-layar)
5. [Fitur-Fitur Aplikasi](#-fitur-fitur-aplikasi)
6. [Panduan Penggunaan & Menjalankan Proyek](#-panduan-penggunaan--menjalankan-proyek)
7. [Struktur File](#-struktur-file)

---

## 📖 Deskripsi Proyek

Pada pertemuan ini, fokus pembelajaran adalah memahami bagaimana sebuah aplikasi mobile mengelola riwayat perpindahan layar (*screen navigation*). Sebelum menggunakan library navigasi eksternal yang kompleks, konsep navigasi dipelajari melalui struktur data tumpukan (**Stack**) dengan tiga operasi fundamental:
- **`push(screenName, params)`**: Menambahkan layar baru ke atas tumpukan (navigasi maju).
- **`pop()`**: Mengambil/menghapus layar paling atas dari tumpukan untuk kembali ke layar sebelumnya (navigasi mundur).
- **`popToTop()`**: Mengosongkan tumpukan dan kembali langsung ke layar awal (*root/Login*).

Seluruh sistem otentikasi, pendaftaran akun baru, dashboard mahasiswa, dan mekanisme navigasi ini dibangun **dalam satu halaman** (`App.js`) secara rapi dengan standar antarmuka **React Native Paper (MD3)**.

---

## 🔬 Konsep Stack Navigation (Push & Pop)

Stack bekerja dengan prinsip **LIFO (Last-In-First-Out)**, di mana layar yang terakhir kali dimasukkan adalah layar yang sedang aktif dan tampil di hadapan pengguna.

### 1. State Tumpukan (Stack State)
```javascript
// Menyimpan riwayat tumpukan layar yang aktif
const [stack, setStack] = useState([{ name: 'Login', params: {} }]);
```

### 2. Operasi PUSH
Saat pengguna berpindah dari Login ke Dashboard atau ke Registrasi:
```javascript
const push = (screenName, params = {}) => {
  setStack((prevStack) => [...prevStack, { name: screenName, params }]);
};
```
*Visualisasi:*
`[Login]` ➔ `push('Dashboard')` ➔ `[Login, Dashboard]` (Layar aktif: Dashboard)

### 3. Operasi POP
Saat pengguna menekan tombol kembali (*Back*) atau keluar (*Logout*):
```javascript
const pop = () => {
  if (stack.length > 1) {
    setStack((prevStack) => prevStack.slice(0, -1));
  }
};
```
*Visualisasi:*
`[Login, Dashboard]` ➔ `pop()` ➔ `[Login]` (Layar aktif kembali ke Login)

### 4. Operasi POP TO TOP
Saat pengguna ingin kembali langsung ke layar Login dari tingkat tumpukan berapa pun (misalnya level 3):
```javascript
const popToTop = () => {
  if (stack.length > 1) setStack([stack[0]]);
};
```

---

## 🎨 Bedah Komponen React Native Paper

Berikut adalah komponen React Native Paper yang diterapkan dalam proyek:

| Komponen Paper | Penerapan dalam Proyek |
| :--- | :--- |
| **`Provider` (`PaperProvider`)** | Pembungkus utama aplikasi yang menyediakan tema Material Design 3. |
| **`Card` & `Card.Content`** | Wadah kartu dengan elevasi Material Design untuk formulir Login, Registrasi, Profil Dashboard, dan Menu. |
| **`Avatar.Icon` & `Avatar.Text`** | Ikon logo aplikasi bertema akademik dan avatar inisial nama mahasiswa pada Dashboard. |
| **`TextInput`** (`mode="outlined"`) | Input teks bergaya outlined dengan ikon terintegrasi (`account`, `lock`, `at`, `school`) untuk form Login dan Registrasi. |
| **`HelperText`** | Pesan validasi real-time di bawah input konfirmasi password. |
| **`Button`** | Tombol aksi Material (`mode="contained"`, `mode="outlined"`, `mode="contained-tonal"`, dan `mode="text"`). |
| **`Chip`** | Menampilkan badge role pengguna (`Mahasiswa` / `Admin`) dan representasi visual item pada *Stack Navigation Monitor*. |
| **`Badge`** | Menampilkan angka kedalaman tumpukan stack (*Depth*) di header monitor. |
| **`Surface`** | Wadah panel monitoring navigasi dan kartu ringkasan statistik (Semester, IPK, Status). |
| **`Divider`** | Garis batas pemisah antar elemen formulir dan daftar menu. |
| **`Snackbar`** | Notifikasi pop-up konfirmasi saat login sukses, registrasi berhasil, atau logout. |

---

## 🗺️ Alur Navigasi & Arsitektur Layar

```
                        ┌────────────────┐
                        │  Halaman LOGIN │
                        └───────┬────────┘
                                │
             ┌──────────────────┴──────────────────┐
             │ PUSH('Register')                    │ PUSH('Dashboard')
             ▼                                     ▼
   ┌──────────────────┐                  ┌──────────────────┐
   │ Halaman REGISTER │                  │ Halaman DASHBOARD│
   └─────────┬────────┘                  └─────────┬────────┘
             │ POP() (Setelah daftar)              │ PUSH('ProfileDetail')
             ▼                                     ▼
   ┌──────────────────┐                  ┌──────────────────┐
   │ Kembali ke LOGIN │                  │  DETAIL PROFIL   │
   └──────────────────┘                  └─────────┬────────┘
                                                   │ POP()
                                                   ▼
                                         ┌──────────────────┐
                                         │Kembali DASHBOARD │
                                         └──────────────────┘
```

---

## ✨ Fitur-Fitur Aplikasi

### 1. Halaman Login
- Form input Username & Password dengan `TextInput` berikon Material.
- Tombol **LOGIN KE DASHBOARD (PUSH)** yang memverifikasi kredensial terhadap data akun terdaftar.
- Tombol **DAFTAR AKUN BARU** yang memanggil fungsi `push('Register')`.

### 2. Halaman Registrasi Akun
- Form pendaftaran lengkap: Nama Lengkap, Program Studi, Username Baru, Password, dan Konfirmasi Password.
- Validasi kecocokan password dengan `HelperText`.
- Tombol **DAFTAR SEKARANG**: menyimpan akun baru ke state, menampilkan notifikasi, dan otomatis memanggil **`pop()`** untuk kembali ke halaman Login.
- Tombol **Kembali ke Login (POP)**.

### 3. Halaman Dashboard
- Header profil dengan `Avatar.Text`, nama, badge role `Chip`, dan info prodi.
- Statistik Akademik: Semester, IPK, dan Status Studi.
- Menu Layanan Mahasiswa: KRS, KHS, dan Jadwal Perkuliahan.
- Tombol Logout dan tombol **POP (Kembali)**.
- Panel Eksplorasi Navigasi:
  - `PUSH` ke Layar Detail Profil (Tumpukan Level 3).
  - `POP` kembali ke layar sebelumnya.
  - `POP TO TOP` untuk logout seketika ke layar Login.

### 4. Halaman Detail Profil (Level 3)
- Menampilkan rincian data mahasiswa lengkap.
- Tombol `POP KE DASHBOARD (LEVEL 2)`.
- Tombol `POP TO TOP KE LOGIN (LEVEL 1)`.

---

## 🚀 Panduan Penggunaan & Menjalankan Proyek

### 1. Masuk ke Direktori Proyek
```bash
cd pertemuan6
```

### 2. Instalasi Paket Dependensi
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

### 4. Menjalankan Aplikasi
- **Smartphone Fisik**: Scan QR Code di terminal menggunakan aplikasi **Expo Go** (Android) atau **Kamera** (iOS).
- **Android Emulator**: Tekan tombol `a` pada keyboard di terminal.
- **Web Browser**: Tekan tombol `w` pada keyboard di terminal.

---

## 📁 Struktur File

```text
pertemuan6/
├── assets/                  # Aset ikon dan gambar
├── screens/                 # Berkas komponen layar terpisah
│   ├── LoginScreen.js       # Halaman login dengan React Native Paper
│   ├── RegisterScreen.js    # Halaman registrasi akun baru
│   ├── DashboardScreen.js   # Halaman dashboard akademik mahasiswa
│   └── ProfileDetailScreen.js # Halaman rincian profil pengguna (Level 3)
├── App.js                   # Root navigator mengelola tumpukan stack (push & pop)
├── app.json                 # Konfigurasi aplikasi Expo
├── index.js                 # Entry point pendaftaran komponen root
├── package.json             # Dependensi (expo, react, react-native, react-native-paper)
└── README.md                # Dokumentasi alur stack navigation dan panduan proyek
```

---
*Dokumentasi disusun untuk materi Pertemuan 6 - Sistem Informasi Berbasis Mobile.*

