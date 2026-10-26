import React, { useState, createContext, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

/*
================================================================================
  KONFIGURASI MODE NAVIGASI (PILIH SALAH SATU)
================================================================================
  Aplikasi ini menggabungkan 3 jenis React Navigation:
  1. Stack Navigator       : Menangani navigasi tumpukan (Detail & Tambah Barang)
  2. Bottom Tab Navigator  : Menu navigasi di bilah bawah layar
  3. Drawer Navigator      : Menu navigasi slide/laci di samping layar

  CARA MENGGANTI NAVIGATOR:
  Ganti nilai konstanta NAVIGATION_MODE di bawah:
  - 'BOTTOM_TAB' : Menggunakan Bottom Tab Bar (Aktifkan Tab Bawah)
  - 'DRAWER'     : Menggunakan Drawer Sidebar (Aktifkan Menu Laci Samping)
================================================================================
*/
const NAVIGATION_MODE = 'BOTTOM_TAB'; // <-- Ganti ke 'DRAWER' untuk beralih ke Drawer Navigator!

// Inisialisasi masing-masing navigator
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// ============================================================================
// CONTEXT STATE DATA BARANG UMKM (Shared State antar Screen)
// ============================================================================
const ItemsContext = createContext();

const INITIAL_ITEMS = [
  {
    id: 'BRG-001',
    nama: 'Beras Ramos Super 5kg',
    kategori: 'Sembako',
    satuan: 'Karung',
    hargaBeli: 64000,
    hargaJual: 72000,
    stok: 14,
    minStok: 5,
    supplier: 'Distributor Beras Sejahtera',
    deskripsi: 'Beras pulen kualitas premium, kemasan karung 5 kg.',
  },
  {
    id: 'BRG-002',
    nama: 'Minyak Goreng Sania 2L',
    kategori: 'Sembako',
    satuan: 'Pouch',
    hargaBeli: 31000,
    hargaJual: 35500,
    stok: 3, // Kritis
    minStok: 6,
    supplier: 'PT Distribusi Pangan',
    deskripsi: 'Minyak goreng kelapa sawit kemasan pouch isi 2 liter.',
  },
  {
    id: 'BRG-003',
    nama: 'Gula Pasir Gulaku 1kg',
    kategori: 'Sembako',
    satuan: 'Bungkus',
    hargaBeli: 15500,
    hargaJual: 18000,
    stok: 4, // Kritis
    minStok: 8,
    supplier: 'Agen Sembako Mandiri',
    deskripsi: 'Gula pasir tebu kristal putih bersih 1 kg.',
  },
  {
    id: 'BRG-004',
    nama: 'Kopi Kapal Api Special 165g',
    kategori: 'Minuman',
    satuan: 'Bungkus',
    hargaBeli: 12000,
    hargaJual: 14500,
    stok: 22,
    minStok: 10,
    supplier: 'CV Kopi Nusantara',
    deskripsi: 'Kopi bubuk hitam murni aroma mantap kemasan 165 gram.',
  },
  {
    id: 'BRG-005',
    nama: 'Telur Ayam Ras 1kg',
    kategori: 'Sembako',
    satuan: 'Kg',
    hargaBeli: 25000,
    hargaJual: 28500,
    stok: 2, // Kritis
    minStok: 5,
    supplier: 'Peternakan Berkah Blitar',
    deskripsi: 'Telur ayam ras segar pilihan kualitas nomor satu.',
  },
  {
    id: 'BRG-006',
    nama: 'Deterjen Rinso Antinoda 770g',
    kategori: 'Kebutuhan Rumah',
    satuan: 'Bungkus',
    hargaBeli: 19500,
    hargaJual: 23000,
    stok: 16,
    minStok: 5,
    supplier: 'Depo Unilever Sentosa',
    deskripsi: 'Deterjen bubuk pembersih noda pakaian higienis.',
  },
  {
    id: 'BRG-007',
    nama: 'Teh Celup SariWangi 30s',
    kategori: 'Minuman',
    satuan: 'Kotak',
    hargaBeli: 6500,
    hargaJual: 8000,
    stok: 28,
    minStok: 10,
    supplier: 'Depo Unilever Sentosa',
    deskripsi: 'Teh celup aroma melati isi 30 kantung teh.',
  },
];

function ItemsProvider({ children }) {
  const [items, setItems] = useState(INITIAL_ITEMS);

  // Fungsi Tambah Barang Baru
  const addItem = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
  };

  // Fungsi Tambah / Kurang Stok
  const updateStock = (id, delta) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStock = Math.max(0, item.stok + delta);
          return { ...item, stok: newStock };
        }
        return item;
      })
    );
  };

  // Fungsi Hapus Barang
  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <ItemsContext.Provider value={{ items, addItem, updateStock, deleteItem }}>
      {children}
    </ItemsContext.Provider>
  );
}

// Helper Format Rupiah
const formatRupiah = (number) => {
  return 'Rp ' + Number(number).toLocaleString('id-ID');
};

// ============================================================================
// 1. LAYAR: KATALOG BARANG (Tampil di Bottom Tab / Drawer)
// ============================================================================
function KatalogScreen({ navigation }) {
  const { items } = useContext(ItemsContext);
  const [search, setSearch] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua');

  const categories = ['Semua', 'Sembako', 'Minuman', 'Kebutuhan Rumah'];

  // Filter Data
  const filteredItems = items.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      selectedKategori === 'Semua' || item.kategori === selectedKategori;
    return matchSearch && matchCategory;
  });

  const stokKritisTotal = items.filter((i) => i.stok <= i.minStok).length;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.contentContainer}>
        {/* Banner Toko UMKM */}
        <View style={styles.umkmHeaderCard}>
          <View style={styles.umkmHeaderIconContainer}>
            <Ionicons name="storefront" size={26} color="#4f46e5" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.umkmBadge}>Toko Mitra UMKM</Text>
            <Text style={styles.umkmTitle}>Warung Berkah Mandiri</Text>
            <Text style={styles.umkmSubtitle}>
              Sistem Pendataan & Stok Barang Dagangan
            </Text>
          </View>
          <TouchableOpacity
            style={styles.btnTambahMini}
            onPress={() => navigation.navigate('TambahBarang')}
          >
            <Ionicons name="add" size={16} color="#ffffff" style={{ marginRight: 4 }} />
            <Text style={styles.btnTambahMiniText}>Tambah</Text>
          </TouchableOpacity>
        </View>

        {/* Info Ringkas Alert */}
        {stokKritisTotal > 0 && (
          <TouchableOpacity
            style={styles.alertBanner}
            onPress={() => navigation.navigate('StokKritis')}
          >
            <Ionicons
              name="warning-outline"
              size={18}
              color="#b91c1c"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.alertBannerText}>
              Perhatian: Ada {stokKritisTotal} barang stok kritis! Ketuk untuk cek.
            </Text>
          </TouchableOpacity>
        )}

        {/* Input Pencarian */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#64748b" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama barang atau kode ID..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Kategori Tabs */}
        <View style={{ marginBottom: 12 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((kat) => {
              const active = selectedKategori === kat;
              return (
                <TouchableOpacity
                  key={kat}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  onPress={() => setSelectedKategori(kat)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      active && styles.filterChipTextActive,
                    ]}
                  >
                    {kat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Daftar Barang */}
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="file-tray-outline" size={44} color="#94a3b8" style={{ marginBottom: 8 }} />
              <Text style={styles.emptyTitle}>Barang Tidak Ditemukan</Text>
              <Text style={styles.emptySubtitle}>
                Coba cari dengan kata kunci lain atau tambah barang baru.
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const isKritis = item.stok <= item.minStok;
            return (
              <TouchableOpacity
                style={styles.cardItem}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('DetailBarang', { item })}
              >
                <View style={styles.cardHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.cardId}>{item.id}</Text>
                    <Text style={styles.cardKategori}>{item.kategori}</Text>
                  </View>
                  <View
                    style={[
                      styles.stokBadge,
                      isKritis ? styles.stokBadgeKritis : styles.stokBadgeAman,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stokBadgeText,
                        isKritis
                          ? styles.stokBadgeTextKritis
                          : styles.stokBadgeTextAman,
                      ]}
                    >
                      {item.stok === 0
                        ? 'Habis'
                        : isKritis
                        ? `Stok Menipis: ${item.stok}`
                        : `Stok: ${item.stok}`}
                    </Text>
                  </View>
                </View>

                <Text style={styles.cardNama}>{item.nama}</Text>

                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.labelHarga}>Harga Jual:</Text>
                    <Text style={styles.hargaJual}>
                      {formatRupiah(item.hargaJual)}{' '}
                      <Text style={{ fontSize: 11, color: '#64748b' }}>
                        /{item.satuan}
                      </Text>
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.labelHarga}>Modal Beli:</Text>
                    <Text style={styles.hargaBeli}>
                      {formatRupiah(item.hargaBeli)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

// ============================================================================
// 2. LAYAR: STOK KRITIS / RESTOCK (Tampil di Bottom Tab / Drawer)
// ============================================================================
function StokKritisScreen({ navigation }) {
  const { items, updateStock } = useContext(ItemsContext);

  const lowStockItems = items.filter((item) => item.stok <= item.minStok);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.contentContainer}>
        {/* Banner Penjelasan */}
        <View style={styles.warningHeaderCard}>
          <Ionicons
            name="alert-circle"
            size={34}
            color="#c2410c"
            style={{ marginRight: 12 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.warningTitle}>Peringatan Stok Rendah</Text>
            <Text style={styles.warningSubtitle}>
              Daftar barang dengan stok kurang dari batas minimum. Segera lakukan
              pembelian ulang (restock) ke distributor!
            </Text>
          </View>
        </View>

        <FlatList
          data={lowStockItems}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="checkmark-circle-outline"
                size={48}
                color="#16a34a"
                style={{ marginBottom: 8 }}
              />
              <Text style={styles.emptyTitle}>Semua Stok Aman</Text>
              <Text style={styles.emptySubtitle}>
                Tidak ada barang yang berada di bawah batas minimum stok saat ini.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={[styles.cardItem, { borderColor: '#fca5a5' }]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardId}>{item.id}</Text>
                <Text style={{ color: '#ef4444', fontWeight: 'bold', fontSize: 12 }}>
                  Batas Min: {item.minStok} {item.satuan}
                </Text>
              </View>

              <Text style={styles.cardNama}>{item.nama}</Text>

              <View style={styles.kritisDetailRow}>
                <Text style={styles.kritisStokSisa}>
                  Sisa Stok: <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>{item.stok} {item.satuan}</Text>
                </Text>
                <Text style={{ color: '#64748b', fontSize: 12 }}>
                  Supplier: {item.supplier}
                </Text>
              </View>

              {/* Tombol Restock Cepat */}
              <View style={styles.restockActionRow}>
                <TouchableOpacity
                  style={styles.btnDetailMini}
                  onPress={() => navigation.navigate('DetailBarang', { item })}
                >
                  <Text style={styles.btnDetailMiniText}>Lihat Detail</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnRestockCepat}
                  onPress={() => {
                    updateStock(item.id, 5);
                    Alert.alert(
                      'Restock Berhasil',
                      `Stok ${item.nama} telah ditambah sebanyak +5 ${item.satuan}.`
                    );
                  }}
                >
                  <Ionicons name="add-circle" size={14} color="#ffffff" style={{ marginRight: 4 }} />
                  <Text style={styles.btnRestockCepatText}>Restock 5</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

// ============================================================================
// 3. LAYAR: RINGKASAN & LAPORAN ASSET (Tampil di Bottom Tab / Drawer)
// ============================================================================
function RingkasanScreen({ navigation }) {
  const { items } = useContext(ItemsContext);

  const totalSKU = items.length;
  const totalUnitStok = items.reduce((acc, curr) => acc + curr.stok, 0);
  const totalNilaiModal = items.reduce(
    (acc, curr) => acc + curr.stok * curr.hargaBeli,
    0
  );
  const totalEstimasiOmzet = items.reduce(
    (acc, curr) => acc + curr.stok * curr.hargaJual,
    0
  );
  const totalPotensiLaba = totalEstimasiOmzet - totalNilaiModal;
  const totalKritis = items.filter((i) => i.stok <= i.minStok).length;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <Text style={styles.screenHeading}>Laporan Inventaris UMKM</Text>
        <Text style={styles.screenSubheading}>
          Ringkasan kondisi aset, stok barang, dan potensi laba usaha dagang.
        </Text>

        {/* Baris Kartu Statistik 1 */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: '#e0e7ff' }]}>
            <Ionicons name="cube-outline" size={24} color="#4338ca" style={{ marginBottom: 4 }} />
            <Text style={styles.statBoxNumber}>{totalSKU}</Text>
            <Text style={styles.statBoxLabel}>Total Jenis Barang</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#fee2e2' }]}>
            <Ionicons name="alert-circle-outline" size={24} color="#dc2626" style={{ marginBottom: 4 }} />
            <Text style={[styles.statBoxNumber, { color: '#dc2626' }]}>
              {totalKritis}
            </Text>
            <Text style={styles.statBoxLabel}>Barang Stok Kritis</Text>
          </View>
        </View>

        {/* Baris Kartu Statistik 2 */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: '#fef3c7' }]}>
            <Ionicons name="layers-outline" size={24} color="#b45309" style={{ marginBottom: 4 }} />
            <Text style={styles.statBoxNumber}>{totalUnitStok}</Text>
            <Text style={styles.statBoxLabel}>Total Unit Fisik Stok</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#dcfce7' }]}>
            <Ionicons name="cash-outline" size={24} color="#15803d" style={{ marginBottom: 4 }} />
            <Text style={[styles.statBoxNumber, { color: '#16a34a', fontSize: 16 }]}>
              {formatRupiah(totalPotensiLaba)}
            </Text>
            <Text style={styles.statBoxLabel}>Potensi Laba Margin</Text>
          </View>
        </View>

        {/* Kartu Finansial Besar */}
        <View style={styles.financialCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons name="wallet-outline" size={20} color="#0f172a" style={{ marginRight: 6 }} />
            <Text style={styles.financialTitle}>Valuasi Aset Inventaris</Text>
          </View>

          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Total Nilai Modal Beli:</Text>
            <Text style={styles.financialValue}>
              {formatRupiah(totalNilaiModal)}
            </Text>
          </View>

          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Total Potensi Omzet Jual:</Text>
            <Text style={[styles.financialValue, { color: '#2563eb' }]}>
              {formatRupiah(totalEstimasiOmzet)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.financialRow}>
            <Text style={[styles.financialLabel, { fontWeight: 'bold' }]}>
              Margin Keuntungan:
            </Text>
            <Text style={[styles.financialValue, { color: '#16a34a', fontWeight: 'bold' }]}>
              + {formatRupiah(totalPotensiLaba)}
            </Text>
          </View>
        </View>

        {/* Informasi Usaha UMKM */}
        <View style={styles.infoTokoCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Ionicons name="business-outline" size={16} color="#334155" style={{ marginRight: 6 }} />
            <Text style={styles.infoTokoTitle}>Data Usaha UMKM</Text>
          </View>
          <Text style={styles.infoTokoItem}>• Nama Toko: Warung Berkah Mandiri</Text>
          <Text style={styles.infoTokoItem}>• Pemilik: Bapak Joko Mulyono</Text>
          <Text style={styles.infoTokoItem}>• Lokasi: Jl. Merdeka No. 45, Semarang</Text>
          <Text style={styles.infoTokoItem}>• Jenis Usaha: Perdagangan Eceran Sembako</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================================
// 4. LAYAR: PROFIL UMKM & PANDUAN (Khusus Menu Drawer)
// ============================================================================
function ProfilUmkmScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profilHeader}>
          <Ionicons name="storefront" size={48} color="#4f46e5" style={{ marginBottom: 6 }} />
          <Text style={styles.profilTitle}>Warung Berkah Mandiri</Text>
          <Text style={styles.profilTag}>Aplikasi Manajemen Inventaris UMKM</Text>
        </View>

        <View style={styles.cardItem}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Ionicons name="information-circle-outline" size={18} color="#4f46e5" style={{ marginRight: 6 }} />
            <Text style={styles.cardNama}>Petunjuk Arsitektur Navigasi</Text>
          </View>
          <Text style={{ color: '#475569', fontSize: 13, lineHeight: 20 }}>
            Halaman ini menggunakan kombinasi 3 navigasi React Navigation:
            {'\n'}1. <Text style={{ fontWeight: 'bold' }}>Stack Navigator</Text> untuk halaman Tambah dan Detail Barang.
            {'\n'}2. <Text style={{ fontWeight: 'bold' }}>Bottom Tab Navigator</Text> untuk navigasi bilah bawah.
            {'\n'}3. <Text style={{ fontWeight: 'bold' }}>Drawer Navigator</Text> untuk menu laci geser samping.
          </Text>
        </View>

        <View style={styles.cardItem}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Ionicons name="settings-outline" size={18} color="#4f46e5" style={{ marginRight: 6 }} />
            <Text style={styles.cardNama}>Cara Mengaktifkan / Menukar Navigasi</Text>
          </View>
          <Text style={{ color: '#475569', fontSize: 13, lineHeight: 20 }}>
            Untuk menonaktifkan salah satunya dan beralih ke mode navigasi lain,
            cukup ubah variabel di bagian atas file <Text style={{ fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontWeight: 'bold' }}>App.js</Text>:
            {'\n\n'}
            <Text style={{ fontWeight: 'bold', color: '#4f46e5' }}>
              const NAVIGATION_MODE = 'BOTTOM_TAB';
            </Text>
            {'\n'}atau ganti menjadi:{'\n'}
            <Text style={{ fontWeight: 'bold', color: '#16a34a' }}>
              const NAVIGATION_MODE = 'DRAWER';
            </Text>
          </Text>
        </View>

        <TouchableOpacity
          style={styles.btnSimpan}
          onPress={() => navigation.navigate('Katalog')}
        >
          <Text style={styles.btnSimpanText}>Kembali ke Katalog Barang</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================================
// 5. LAYAR: DETAIL BARANG (Stack Navigator)
// ============================================================================
function DetailBarangScreen({ route, navigation }) {
  const { item: initialItem } = route.params;
  const { items, updateStock, deleteItem } = useContext(ItemsContext);

  // Ambil state terkini dari context jika ada perubahan stok
  const currentItem = items.find((i) => i.id === initialItem.id) || initialItem;

  const isKritis = currentItem.stok <= currentItem.minStok;
  const marginPerUnit = currentItem.hargaJual - currentItem.hargaBeli;
  const totalAsetBarang = currentItem.stok * currentItem.hargaBeli;

  const handleDelete = () => {
    Alert.alert(
      'Hapus Barang',
      `Apakah Anda yakin ingin menghapus "${currentItem.nama}" dari daftar inventaris?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Hapus',
          style: 'destructive',
          onPress: () => {
            deleteItem(currentItem.id);
            Alert.alert('Sukses', 'Barang berhasil dihapus.');
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Header Barang */}
        <View style={styles.detailHeaderCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.cardId}>{currentItem.id}</Text>
            <View
              style={[
                styles.stokBadge,
                isKritis ? styles.stokBadgeKritis : styles.stokBadgeAman,
              ]}
            >
              <Ionicons
                name={isKritis ? 'warning-outline' : 'checkmark-circle-outline'}
                size={12}
                color={isKritis ? '#b91c1c' : '#15803d'}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.stokBadgeText,
                  isKritis ? styles.stokBadgeTextKritis : styles.stokBadgeTextAman,
                ]}
              >
                {isKritis ? 'Stok Menipis' : 'Stok Tersedia'}
              </Text>
            </View>
          </View>

          <Text style={styles.detailNama}>{currentItem.nama}</Text>
          <Text style={styles.detailKategori}>
            Kategori: <Text style={{ fontWeight: 'bold' }}>{currentItem.kategori}</Text> | Satuan: <Text style={{ fontWeight: 'bold' }}>{currentItem.satuan}</Text>
          </Text>
          <Text style={styles.detailDeskripsi}>{currentItem.deskripsi}</Text>
        </View>

        {/* Manajemen Stok Kontrol */}
        <View style={styles.controlStokCard}>
          <Text style={styles.sectionTitle}>Atur Jumlah Stok Barang</Text>
          <View style={styles.stokDisplayRow}>
            <TouchableOpacity
              style={styles.btnStockStep}
              onPress={() => updateStock(currentItem.id, -1)}
            >
              <Ionicons name="remove" size={22} color="#4338ca" />
            </TouchableOpacity>

            <View style={{ alignItems: 'center' }}>
              <Text style={styles.stokBigNumber}>{currentItem.stok}</Text>
              <Text style={{ color: '#64748b', fontSize: 12 }}>
                {currentItem.satuan} (Min: {currentItem.minStok})
              </Text>
            </View>

            <TouchableOpacity
              style={styles.btnStockStep}
              onPress={() => updateStock(currentItem.id, 1)}
            >
              <Ionicons name="add" size={22} color="#4338ca" />
            </TouchableOpacity>
          </View>

          {/* Tombol Restock Batch */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
            <TouchableOpacity
              style={[styles.btnRestockBatch, { backgroundColor: '#dbeafe' }]}
              onPress={() => {
                updateStock(currentItem.id, 5);
                Alert.alert('Info', 'Stok berhasil ditambah +5.');
              }}
            >
              <Text style={{ color: '#1e40af', fontWeight: 'bold', textAlign: 'center' }}>
                + Tambah 5 {currentItem.satuan}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnRestockBatch, { backgroundColor: '#dcfce7' }]}
              onPress={() => {
                updateStock(currentItem.id, 10);
                Alert.alert('Info', 'Stok berhasil ditambah +10.');
              }}
            >
              <Text style={{ color: '#15803d', fontWeight: 'bold', textAlign: 'center' }}>
                + Tambah 10 {currentItem.satuan}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Informasi Finansial & Margin */}
        <View style={styles.cardItem}>
          <Text style={styles.sectionTitle}>Informasi Harga & Margin</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Harga Modal Beli:</Text>
            <Text style={styles.detailValue}>{formatRupiah(currentItem.hargaBeli)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Harga Jual Pelanggan:</Text>
            <Text style={[styles.detailValue, { color: '#2563eb' }]}>
              {formatRupiah(currentItem.hargaJual)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { fontWeight: 'bold' }]}>
              Margin Untung / Unit:
            </Text>
            <Text style={[styles.detailValue, { color: '#16a34a', fontWeight: 'bold' }]}>
              + {formatRupiah(marginPerUnit)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Nilai Aset Stok Ini:</Text>
            <Text style={[styles.detailValue, { fontWeight: 'bold' }]}>
              {formatRupiah(totalAsetBarang)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Supplier / Pemasok:</Text>
            <Text style={styles.detailValue}>{currentItem.supplier}</Text>
          </View>
        </View>

        {/* Tombol Hapus Barang */}
        <TouchableOpacity style={styles.btnHapus} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={16} color="#b91c1c" style={{ marginRight: 6 }} />
          <Text style={styles.btnHapusText}>Hapus Barang dari Inventaris</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================================
// 6. LAYAR: TAMBAH BARANG BARU (Stack Navigator)
// ============================================================================
function TambahBarangScreen({ navigation }) {
  const { addItem, items } = useContext(ItemsContext);

  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState('Sembako');
  const [satuan, setSatuan] = useState('Pcs');
  const [hargaBeli, setHargaBeli] = useState('');
  const [hargaJual, setHargaJual] = useState('');
  const [stok, setStok] = useState('');
  const [minStok, setMinStok] = useState('5');
  const [supplier, setSupplier] = useState('');
  const [deskripsi, setDeskripsi] = useState('');

  const kategoriOptions = ['Sembako', 'Minuman', 'Makanan Ringan', 'Kebutuhan Rumah'];
  const satuanOptions = ['Pcs', 'Kg', 'Karung', 'Pouch', 'Bungkus', 'Kotak'];

  const handleSimpan = () => {
    if (!nama.trim() || !hargaBeli.trim() || !hargaJual.trim() || !stok.trim()) {
      Alert.alert('Form Belum Lengkap', 'Mohon isi Nama, Harga Beli, Harga Jual, dan Stok Barang.');
      return;
    }

    const nextIdNumber = items.length + 1;
    const newId = `BRG-00${nextIdNumber}`;

    const newItem = {
      id: newId,
      nama: nama.trim(),
      kategori,
      satuan,
      hargaBeli: parseInt(hargaBeli, 10) || 0,
      hargaJual: parseInt(hargaJual, 10) || 0,
      stok: parseInt(stok, 10) || 0,
      minStok: parseInt(minStok, 10) || 5,
      supplier: supplier.trim() || 'Distributor Lokal',
      deskripsi: deskripsi.trim() || 'Barang inventaris UMKM.',
    };

    addItem(newItem);
    Alert.alert('Berhasil', `Barang "${newItem.nama}" berhasil ditambahkan.`);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text style={styles.formTitle}>Form Pendataan Barang Baru</Text>
        <Text style={styles.formSubtitle}>
          Masukkan rincian produk untuk ditambahkan ke inventaris warung/toko.
        </Text>

        {/* Input Nama Barang */}
        <Text style={styles.inputLabel}>Nama Produk / Barang *</Text>
        <TextInput
          style={styles.formInput}
          placeholder="Contoh: Beras Rojolele 5kg"
          value={nama}
          onChangeText={setNama}
        />

        {/* Pilihan Kategori */}
        <Text style={styles.inputLabel}>Kategori Barang</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          {kategoriOptions.map((kat) => (
            <TouchableOpacity
              key={kat}
              style={[styles.optionChip, kategori === kat && styles.optionChipActive]}
              onPress={() => setKategori(kat)}
            >
              <Text
                style={[
                  styles.optionChipText,
                  kategori === kat && styles.optionChipTextActive,
                ]}
              >
                {kat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pilihan Satuan */}
        <Text style={styles.inputLabel}>Satuan Unit</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          {satuanOptions.map((sat) => (
            <TouchableOpacity
              key={sat}
              style={[styles.optionChip, satuan === sat && styles.optionChipActive]}
              onPress={() => setSatuan(sat)}
            >
              <Text
                style={[
                  styles.optionChipText,
                  satuan === sat && styles.optionChipTextActive,
                ]}
              >
                {sat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Harga Beli & Jual */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>Harga Beli (Modal) *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Contoh: 25000"
              keyboardType="numeric"
              value={hargaBeli}
              onChangeText={setHargaBeli}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>Harga Jual *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Contoh: 30000"
              keyboardType="numeric"
              value={hargaJual}
              onChangeText={setHargaJual}
            />
          </View>
        </View>

        {/* Stok Awal & Min Stok */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>Jumlah Stok Awal *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Contoh: 20"
              keyboardType="numeric"
              value={stok}
              onChangeText={setStok}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputLabel}>Batas Min. Stok Kritis</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Contoh: 5"
              keyboardType="numeric"
              value={minStok}
              onChangeText={setMinStok}
            />
          </View>
        </View>

        {/* Supplier */}
        <Text style={styles.inputLabel}>Pemasok / Distributor</Text>
        <TextInput
          style={styles.formInput}
          placeholder="Contoh: Agen Sumber Rezeki"
          value={supplier}
          onChangeText={setSupplier}
        />

        {/* Deskripsi */}
        <Text style={styles.inputLabel}>Deskripsi / Catatan Tambahan</Text>
        <TextInput
          style={[styles.formInput, { height: 70, textAlignVertical: 'top' }]}
          placeholder="Keterangan kondisi atau spesifikasi produk..."
          multiline
          numberOfLines={3}
          value={deskripsi}
          onChangeText={setDeskripsi}
        />

        {/* Tombol Simpan */}
        <TouchableOpacity style={styles.btnSimpan} onPress={handleSimpan}>
          <Ionicons name="save-outline" size={18} color="#ffffff" style={{ marginRight: 6 }} />
          <Text style={styles.btnSimpanText}>Simpan Data Barang</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================================
// 7. KOMPONEN BOTTOM TAB NAVIGATOR
// ============================================================================
function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#4f46e5' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
      }}
    >
      <Tab.Screen
        name="Katalog"
        component={KatalogScreen}
        options={{
          title: 'Katalog Barang',
          tabBarLabel: 'Katalog',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="StokKritis"
        component={StokKritisScreen}
        options={{
          title: 'Stok Kritis',
          tabBarLabel: 'Stok Kritis',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="alert-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Ringkasan"
        component={RingkasanScreen}
        options={{
          title: 'Laporan Aset',
          tabBarLabel: 'Ringkasan',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// ============================================================================
// 8. KOMPONEN DRAWER NAVIGATOR
// ============================================================================
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: '#0f766e' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
        drawerActiveTintColor: '#0f766e',
        drawerInactiveTintColor: '#475569',
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={{ marginLeft: 16 }}
          >
            <Ionicons name="menu" size={26} color="#ffffff" />
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen
        name="Katalog"
        component={KatalogScreen}
        options={{
          title: 'Katalog Produk UMKM',
          drawerLabel: 'Katalog Produk',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="StokKritis"
        component={StokKritisScreen}
        options={{
          title: 'Peringatan Stok Menipis',
          drawerLabel: 'Stok Menipis',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="alert-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Ringkasan"
        component={RingkasanScreen}
        options={{
          title: 'Laporan & Keuangan Aset',
          drawerLabel: 'Laporan & Keuangan',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ProfilUmkm"
        component={ProfilUmkmScreen}
        options={{
          title: 'Profil Toko UMKM',
          drawerLabel: 'Profil Usaha',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

// ============================================================================
// 9. ROOT APP COMPONENT (STACK NAVIGATOR & TOGGLE NAVIGASI)
// ============================================================================
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ItemsProvider>
        <NavigationContainer>
          <StatusBar barStyle="light-content" backgroundColor="#4f46e5" />
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: '#4f46e5' },
              headerTintColor: '#ffffff',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          >
            {/* 
              =================================================================
              PILIHAN NAVIGASI UTAMA (NONAKTIFKAN SALAH SATU DI BAWAH):
              =================================================================
              Secara default kita menggunakan variabel NAVIGATION_MODE.
              Namun jika ingin menonaktifkan secara manual dengan komentar kode:

              [OPSI A - BOTTOM TAB AKTIF, DRAWER DINONAKTIFKAN]:
              <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />

              [OPSI B - DRAWER AKTIF, BOTTOM TAB DINONAKTIFKAN]:
              <Stack.Screen name="Main" component={DrawerNavigator} options={{ headerShown: false }} />
              =================================================================
            */}
            <Stack.Screen
              name="Main"
              component={
                NAVIGATION_MODE === 'DRAWER'
                  ? DrawerNavigator
                  : BottomTabNavigator
              }
              options={{ headerShown: false }}
            />

            {/* Layar Tambah Barang (Stack Screen) */}
            <Stack.Screen
              name="TambahBarang"
              component={TambahBarangScreen}
              options={{
                title: 'Tambah Barang UMKM',
                headerBackTitle: 'Kembali',
              }}
            />

            {/* Layar Detail Barang (Stack Screen) */}
            <Stack.Screen
              name="DetailBarang"
              component={DetailBarangScreen}
              options={{
                title: 'Rincian & Stok Barang',
                headerBackTitle: 'Kembali',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ItemsProvider>
    </GestureHandlerRootView>
  );
}

// ============================================================================
// STYLESHEET
// ============================================================================
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  // Card Header UMKM
  umkmHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  umkmHeaderIconContainer: {
    backgroundColor: '#eef2ff',
    padding: 10,
    borderRadius: 10,
    marginRight: 12,
  },
  umkmBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#4f46e5',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  umkmTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  umkmSubtitle: {
    fontSize: 11,
    color: '#64748b',
  },
  btnTambahMini: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  btnTambahMiniText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  // Banner Peringatan
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  alertBannerText: {
    flex: 1,
    color: '#b91c1c',
    fontSize: 12,
    fontWeight: '600',
  },
  // Input Pencarian
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
  },
  // Filter Kategori Chips
  filterChip: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#4f46e5',
  },
  filterChipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  // Card Barang
  cardItem: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardId: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6366f1',
    backgroundColor: '#eef2ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  cardKategori: {
    fontSize: 11,
    color: '#64748b',
  },
  cardNama: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  stokBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stokBadgeAman: {
    backgroundColor: '#dcfce7',
  },
  stokBadgeKritis: {
    backgroundColor: '#fee2e2',
  },
  stokBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  stokBadgeTextAman: {
    color: '#15803d',
  },
  stokBadgeTextKritis: {
    color: '#b91c1c',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 8,
    marginTop: 4,
  },
  labelHarga: {
    fontSize: 11,
    color: '#94a3b8',
  },
  hargaJual: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  hargaBeli: {
    fontSize: 13,
    color: '#64748b',
  },
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#475569',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 30,
  },
  // Warning Header
  warningHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#ffedd5',
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c2410c',
  },
  warningSubtitle: {
    fontSize: 12,
    color: '#9a3412',
    marginTop: 2,
  },
  kritisDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  kritisStokSisa: {
    fontSize: 13,
    color: '#334155',
  },
  restockActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 8,
  },
  btnDetailMini: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnDetailMiniText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  btnRestockCepat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16a34a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnRestockCepatText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  // Ringkasan Screen
  screenHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  screenSubheading: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  statBoxNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e1b4b',
  },
  statBoxLabel: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '500',
  },
  financialCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  financialTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  financialLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  financialValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 10,
  },
  infoTokoCard: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 14,
  },
  infoTokoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
  },
  infoTokoItem: {
    fontSize: 12,
    color: '#475569',
    marginVertical: 2,
  },
  // Detail Screen
  detailHeaderCard: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  detailNama: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 8,
    marginBottom: 4,
  },
  detailKategori: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 10,
  },
  detailDeskripsi: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  controlStokCard: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  stokDisplayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 8,
  },
  stokBigNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4f46e5',
  },
  btnStockStep: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnRestockBatch: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  btnHapus: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  btnHapusText: {
    color: '#b91c1c',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Form Tambah
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 14,
  },
  optionChip: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  optionChipActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  optionChipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  optionChipTextActive: {
    color: '#ffffff',
  },
  btnSimpan: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  btnSimpanText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  // Profil Drawer
  profilHeader: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  profilTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 6,
  },
  profilTag: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
});
