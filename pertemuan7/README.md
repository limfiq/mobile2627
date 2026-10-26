# Pertemuan 7: Integrasi React Navigation (Stack, Bottom Tab & Drawer)
## Studi Kasus: Aplikasi Pendataan Barang UMKM ("Warung Berkah Mandiri")

Aplikasi mobile berbasis **React Native (Expo)** untuk sistem pendataan dan manajemen inventaris stok barang UMKM. Proyek ini mengintegrasikan tiga jenis navigator utama dari **React Navigation** ke dalam **satu halaman (`App.js`)**:

1. **Stack Navigator (`@react-navigation/native-stack`)**
2. **Bottom Tab Navigator (`@react-navigation/bottom-tabs`)**
3. **Drawer Navigator (`@react-navigation/drawer`)**

---

## 🔀 Cara Mengaktifkan / Menonaktifkan Salah Satu Navigasi

Semua konfigurasi terpusat pada file [App.js](file:///e:/Proyek/mobile2627/pertemuan7/App.js). Anda dapat memilih salah satu dari dua cara berikut:

### Cara 1: Menggunakan Variabel Toggle (Paling Cepat)
Cukup ubah baris ke-30 pada `App.js`:

```javascript
// Ganti nilai konstanta di bawah:
// 'BOTTOM_TAB' -> Menampilkan Bottom Navigation Bar di bawah layar
// 'DRAWER'     -> Menampilkan Drawer Navigation (menu laci geser samping)
const NAVIGATION_MODE = 'BOTTOM_TAB'; // <-- ganti ke 'DRAWER' jika ingin menguji Drawer
```

---

### Cara 2: Menonaktifkan Secara Manual via Komentar Kode (JSX)
Di dalam komponen `App()` pada `App.js`, Anda bisa menonaktifkan salah satu screen utama dengan tanda komentar `/* ... */`:

#### Opsi A: Mengaktifkan Bottom Tab (Drawer Dinonaktifkan)
```jsx
{/* OPSI A: BOTTOM TAB AKTIF */}
<Stack.Screen 
  name="Main" 
  component={BottomTabNavigator} 
  options={{ headerShown: false }} 
/>

{/* OPSI B: DRAWER NONAKTIF (DIKOMENTARI)
<Stack.Screen 
  name="Main" 
  component={DrawerNavigator} 
  options={{ headerShown: false }} 
/> 
*/}
```

#### Opsi B: Mengaktifkan Drawer (Bottom Tab Dinonaktifkan)
```jsx
{/* OPSI A: BOTTOM TAB NONAKTIF (DIKOMENTARI)
<Stack.Screen 
  name="Main" 
  component={BottomTabNavigator} 
  options={{ headerShown: false }} 
/> 
*/}

{/* OPSI B: DRAWER AKTIF */}
<Stack.Screen 
  name="Main" 
  component={DrawerNavigator} 
  options={{ headerShown: false }} 
/>
```

---

## 📱 Fitur & Layar Aplikasi

### 1. Navigasi Bersama (Tabs & Drawer)
- 📦 **Katalog Barang (`KatalogScreen`)**:
  - Daftar inventaris barang UMKM lengkap dengan kode SKU, kategori, harga beli, dan harga jual.
  - Fitur pencarian barang berdasarkan nama/ID.
  - Filter cepat per kategori (Sembako, Minuman, Kebutuhan Rumah).
  - Indikator badge stok dinamis (Aman / Stok Menipis / Habis).
  - Tombol navigasi Stack menuju tambah produk.
- ⚠️ **Stok Kritis / Restock (`StokKritisScreen`)**:
  - Filter otomatis menampilkan barang yang stoknya kurang dari atau sama dengan batas minimum stok.
  - Tombol **Quick Restock (+5)** langsung dari kartu produk.
- 📊 **Laporan & Aset (`RingkasanScreen`)**:
  - Statistik total SKU produk dan total fisik unit barang.
  - Valuasi total modal aset inventaris (Rp).
  - Estimasi potensi omzet penjualan dan margin keuntungan (Rp).
  - Data profil toko mitra UMKM.
- 🏪 **Profil Usaha (`ProfilUmkmScreen`)** *(Khusus Drawer)*:
  - Rincian identitas toko UMKM dan petunjuk penggunaan navigator.

### 2. Navigasi Stack
- 🔍 **Detail Barang (`DetailBarangScreen`)**:
  - Dibuka ketika item pada katalog diketuk.
  - Rincian margin untung per unit dan total aset per barang.
  - Kontrol interaktif tambah/kurang stok (`-1`, `+1`, `+5`, `+10`).
  - Fitur hapus barang dengan pop-up konfirmasi.
- ➕ **Tambah Barang (`TambahBarangScreen`)**:
  - Form pendataan barang baru: Nama, Kategori, Satuan, Harga Beli, Harga Jual, Stok Awal, Batas Minimum Stok, dan Pemasok.
  - Validasi form otomatis sebelum data disimpan ke context.

---

## 🚀 Cara Menjalankan Aplikasi

1. Buka terminal di folder `pertemuan7`:
   ```bash
   cd pertemuan7
   ```
2. Jalankan Expo Development Server:
   ```bash
   npx expo start
   ```
3. Pilihan pengujian:
   - **HP Fisik:** Scan QR code menggunakan aplikasi **Expo Go** (Android / iOS).
   - **Web Browser:** Tekan tombol `w` di terminal untuk menjalankan versi web.
   - **Android Emulator:** Tekan tombol `a` di terminal.
