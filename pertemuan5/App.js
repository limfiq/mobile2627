// Reimplemented pertemuan5 UI using react-native-paper, matching pertemuan4 layout
import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Provider as PaperProvider, Card, Avatar, DataTable, Text as PaperText } from 'react-native-paper';

export default function App() {
  // Data Akademik Mahasiswa (copied from pertemuan4)
  const mahasiswa = {
    nama: 'M. Taufiq',
    npm: '3125101010',
    prodi: 'D3 Manajemen Informatika',
    semester: 4,
    ipk: 3.85,
    status: 'Aktif',
    foto: require('./assets/profil.png'),
  };

  // Data KHS / Mata Kuliah (copied from pertemuan4)
  const mataKuliah = [
    { kode: 'KK312408', nama: 'Sistem Informasi Berbasis Mobile', sks: 3, nilai: 'A', smt: 3 },
    { kode: 'KU312411', nama: 'Sistem Basis Data', sks: 3, nilai: 'A-', smt: 1 },
    { kode: 'KU312412', nama: 'Desain UI/UX', sks: 3, nilai: 'A', smt: 2 },
    { kode: 'KK312409', nama: 'Sistem Informasi Berbasis Web', sks: 3, nilai: 'A+', smt: 3 },
  ];

  return (
    <PaperProvider>
      <View style={styles.root}>
        <PaperText style={styles.mainTitle}>Sistem Akademik Mahasiswa</PaperText>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Profile Card */}
          <Card style={styles.profileCard}>
            <Card.Content>
              <PaperText style={styles.sectionHeader}>[ Paper UI ] PROFIL MAHASISWA</PaperText>
              <Avatar.Image size={80} source={mahasiswa.foto} style={styles.avatar} />
              <PaperText style={styles.name}>{mahasiswa.nama}</PaperText>
              <PaperText style={styles.subInfo}>NPM: {mahasiswa.npm} | {mahasiswa.prodi}</PaperText>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <PaperText style={styles.statLabel}>Semester</PaperText>
                  <PaperText style={styles.statValue}>{mahasiswa.semester}</PaperText>
                </View>
                <View style={styles.statItem}>
                  <PaperText style={styles.statLabel}>IPK</PaperText>
                  <PaperText style={styles.statValue}>{mahasiswa.ipk}</PaperText>
                </View>
                <View style={styles.statItem}>
                  <PaperText style={styles.statLabel}>Status</PaperText>
                  <PaperText style={styles.statValue}>{mahasiswa.status}</PaperText>
                </View>
              </View>
            </Card.Content>
          </Card>
          {/* KHS Card */}
          <Card style={styles.khsCard}>
            <Card.Content>
              <PaperText style={styles.sectionHeader}>[ Paper UI ] KARTU HASIL STUDI (KHS)</PaperText>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title style={styles.colMk}>Mata Kuliah</DataTable.Title>
                  <DataTable.Title style={styles.colSks}>SKS</DataTable.Title>
                  <DataTable.Title style={styles.colNilai}>Nilai</DataTable.Title>
                  <DataTable.Title style={styles.colSmt}>Semester</DataTable.Title>
                </DataTable.Header>
                {mataKuliah.map((item, idx) => (
                  <DataTable.Row key={item.kode} style={idx % 2 === 1 ? styles.rowAlt : null}>
                    <DataTable.Cell style={styles.colMk}>
                      <View>
                        <PaperText style={styles.mkNama}>{item.nama}</PaperText>
                        <PaperText style={styles.mkKode}>{item.kode}</PaperText>
                      </View>
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.colSks}>{item.sks}</DataTable.Cell>
                    <DataTable.Cell style={styles.colNilai}>{item.nilai}</DataTable.Cell>
                    <DataTable.Cell style={styles.colSmt}>{item.smt}</DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
              <View style={styles.footer}>
                <PaperText style={styles.totalText}>Total SKS diambil: 13 SKS</PaperText>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
        <StatusBar style="auto" />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#eceff1', paddingTop: 50 },
  mainTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 15, color: '#263238' },
  scrollContainer: { paddingHorizontal: 16, paddingBottom: 30 },
  sectionHeader: { fontSize: 12, fontWeight: 'bold', color: '#6e51ef', letterSpacing: 1, marginBottom: 6 },
  profileCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 20, elevation: 3, borderLeftWidth: 5, borderLeftColor: '#6ee51e' },
  avatar: { alignSelf: 'center', marginBottom: 12 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#212121', marginBottom: 2, textAlign: 'center' },
  subInfo: { fontSize: 14, color: '#757575', marginBottom: 12, textAlign: 'center' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f4f6f8', borderRadius: 10, padding: 12 },
  statItem: { alignItems: 'center' },
  statLabel: { fontSize: 12, color: '#757575' },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#1565c0' },
  khsCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, elevation: 3, borderLeftWidth: 5, borderLeftColor: '#7b1fa2' },
  colMk: { flex: 2 },
  colSks: { flex: 0.8, textAlign: 'center' },
  colNilai: { flex: 1.2, textAlign: 'center' },
  colSmt: { flex: 1.2, textAlign: 'center' },
  mkNama: { fontSize: 14, fontWeight: '600', color: '#333' },
  mkKode: { fontSize: 11, color: '#888' },
  rowAlt: { backgroundColor: '#fafafa' },
  footer: { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#e0e0e0', alignItems: 'flex-end' },
  totalText: { fontSize: 12, fontWeight: '600', color: '#666' },
});
