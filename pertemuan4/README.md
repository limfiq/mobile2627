# Pertemuan 4: Style dan JSX di React Native

Folder ini berisi praktikum **Pertemuan 4** yang membahas penggunaan **Style dan JSX** pada React Native, khususnya studi kasus tampilan Sistem Akademik Mahasiswa (Kartu Mahasiswa & Kartu Hasil Studi).

---

## 📌 Topik Pembahasan

1. **Konsep Styling di React Native**:
   - **Inline Style**: Penulisan style secara langsung di dalam properti `style={{ ... }}` elemen JSX.
   - **StyleSheet API**: Mengelompokkan dan mendefinisikan style menggunakan `StyleSheet.create({ ... })`.
2. **Komponen Layar & Layout**:
   - `<View>` & `<SafeAreaView>` sebagai pembungkus container.
   - `<Text>` untuk menampilkan data teks.
   - `<Image>` dengan gambar dari folder `assets/` lokal (`require('./assets/...')`).
   - `<ScrollView>` dengan fitur **Horizontal Scroll** (`horizontal={true}`) untuk menampilkan tabel data KHS secara presisi.
   - `<StatusBar>` dari `expo-status-bar`.

---

## 🚀 Cara Menjalankan Project

```bash
# 1. Masuk ke direktori pertemuan4
cd pertemuan4

# 2. Install paket dependensi
npm install

# 3. Jalankan aplikasi dengan Expo
npx expo start
```
