import { useCallback, useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SQLite from 'expo-sqlite';
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Divider,
  List,
  MD3LightTheme,
  PaperProvider,
  Surface,
  Text,
} from 'react-native-paper';

const initialMahasiswa = [
  {
    id: '1',
    nim: '2301001',
    nama: 'Andi Pratama',
    jurusan: 'Teknik Informatika',
    angkatan: '2023',
    email: 'andi.pratama@example.com',
    noTelepon: '0812-3456-7890',
    alamat: 'Jl. Merdeka No. 10, Jakarta',
  },
  {
    id: '2',
    nim: '2301002',
    nama: 'Budi Santoso',
    jurusan: 'Sistem Informasi',
    angkatan: '2023',
    email: 'budi.santoso@example.com',
    noTelepon: '0813-4567-8901',
    alamat: 'Jl. Diponegoro No. 25, Bandung',
  },
  {
    id: '3',
    nim: '2301003',
    nama: 'Citra Lestari',
    jurusan: 'Teknik Komputer',
    angkatan: '2023',
    email: 'citra.lestari@example.com',
    noTelepon: '0814-5678-9012',
    alamat: 'Jl. Sudirman No. 8, Surabaya',
  },
  {
    id: '4',
    nim: '2301004',
    nama: 'Dewi Anggraini',
    jurusan: 'Manajemen Informatika',
    angkatan: '2023',
    email: 'dewi.anggraini@example.com',
    noTelepon: '0815-6789-0123',
    alamat: 'Jl. Ahmad Yani No. 17, Yogyakarta',
  },
];

async function loadMahasiswa() {
  const db = await SQLite.openDatabaseAsync('mahasiswa.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS mahasiswa (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nim TEXT NOT NULL UNIQUE,
      nama TEXT NOT NULL,
      jurusan TEXT NOT NULL,
      angkatan TEXT NOT NULL,
      email TEXT NOT NULL,
      noTelepon TEXT NOT NULL,
      alamat TEXT NOT NULL
    );
  `);

  for (const student of initialMahasiswa) {
    await db.runAsync(
      `INSERT OR IGNORE INTO mahasiswa
        (nim, nama, jurusan, angkatan, email, noTelepon, alamat)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      student.nim,
      student.nama,
      student.jurusan,
      student.angkatan,
      student.email,
      student.noTelepon,
      student.alamat
    );
  }

  return db.getAllAsync(
    `SELECT id, nim, nama, jurusan, angkatan, email, noTelepon, alamat
     FROM mahasiswa
     ORDER BY nama COLLATE NOCASE`
  );
}

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2f5bea',
    secondary: '#536dfe',
    background: '#f5f7fb',
  },
};

function StudentList({ students, onSelect }) {
  return (
    <View style={styles.content}>
      <View style={styles.titleRow}>
        <Avatar.Image
          source={require('./assets/icon.png')}
          size={48}
          style={styles.appImage}
        />
        <View style={styles.titleText}>
          <Text variant="headlineMedium" style={styles.title}>
            Data Mahasiswa
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Pilih mahasiswa untuk melihat informasi lengkapnya.
          </Text>
        </View>
      </View>

      <Surface style={styles.listSurface} elevation={1}>
        {students.map((item, index) => (
          <View key={item.id}>
            <List.Item
              title={item.nama}
              description={`NIM: ${item.nim}`}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
              left={(props) => (
                <Avatar.Image
                  {...props}
                  source={require('./assets/icon.png')}
                  size={44}
                  style={styles.avatar}
                />
              )}
              right={() => <Text style={styles.chevron}>›</Text>}
              onPress={() => onSelect(item)}
              accessibilityRole="button"
              accessibilityLabel={`Lihat detail ${item.nama}`}
            />
            {index < students.length - 1 && <Divider />}
          </View>
        ))}
      </Surface>
    </View>
  );
}

function StudentDetail({ student, onBack }) {
  return (
    <View style={styles.content}>
      <View style={styles.detailHeader}>
        <Pressable
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Kembali ke daftar mahasiswa"
        >
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>
        <Text variant="titleLarge" style={styles.detailHeaderTitle}>
          Detail Mahasiswa
        </Text>
      </View>

      <Card mode="contained" style={styles.detailCard}>
        <Card.Content>
          <View style={styles.profile}>
            <Avatar.Text
              label={student.nama
                .split(' ')
                .map((name) => name[0])
                .join('')
                .slice(0, 2)}
              size={76}
              color="#ffffff"
              style={styles.avatar}
            />
            <View style={styles.profileText}>
              <Text variant="titleLarge" style={styles.profileName}>
                {student.nama}
              </Text>
              <Text variant="bodyMedium" style={styles.profileNim}>
                NIM {student.nim}
              </Text>
            </View>
          </View>

          <Divider style={styles.detailDivider} />
          <DetailRow label="Jurusan" value={student.jurusan} />
          <DetailRow label="Angkatan" value={student.angkatan} />
          <DetailRow label="Email" value={student.email} />
          <DetailRow label="No. Telepon" value={student.noTelepon} />
          <DetailRow label="Alamat" value={student.alamat} />
        </Card.Content>
      </Card>
    </View>
  );
}

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text variant="labelLarge" style={styles.detailLabel}>
        {label}
      </Text>
      <Text variant="bodyLarge" style={styles.detailValue}>
        {value}
      </Text>
    </View>
  );
}

export default function App() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const refreshStudents = useCallback(() => {
    setIsLoading(true);
    setErrorMessage('');

    loadMahasiswa()
      .then(setStudents)
      .catch(() => {
        setErrorMessage(
          'Data mahasiswa tidak dapat dimuat. Pastikan database dapat diakses, lalu coba lagi.'
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    refreshStudents();
  }, [refreshStudents]);

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        {selectedStudent ? (
          <StudentDetail
            student={selectedStudent}
            onBack={() => setSelectedStudent(null)}
          />
        ) : isLoading ? (
          <View style={styles.feedbackContainer}>
            <ActivityIndicator size="large" />
            <Text variant="bodyLarge" style={styles.feedbackText}>
              Memuat data mahasiswa...
            </Text>
          </View>
        ) : errorMessage ? (
          <View style={styles.feedbackContainer}>
            <Avatar.Text
              label="!"
              size={64}
              color="#ffffff"
              style={styles.errorIcon}
            />
            <Text variant="bodyLarge" style={styles.feedbackText}>
              {errorMessage}
            </Text>
            <Button mode="contained" onPress={refreshStudents}>
              Coba Lagi
            </Button>
          </View>
        ) : (
          <StudentList students={students} onSelect={setSelectedStudent} />
        )}
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 22,
  },
  titleText: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: '#172554',
    fontWeight: '700',
  },
  subtitle: {
    color: '#64748b',
    marginTop: 6,
  },
  appImage: {
    backgroundColor: theme.colors.primary,
  },
  listSurface: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  listTitle: {
    fontWeight: '600',
  },
  listDescription: {
    marginTop: 3,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
  chevron: {
    alignSelf: 'center',
    color: theme.colors.primary,
    fontSize: 32,
    lineHeight: 34,
    marginRight: 16,
  },
  detailHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 18,
  },
  detailHeaderTitle: {
    fontWeight: '700',
    marginLeft: 4,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: '#e8edff',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  backArrow: {
    color: theme.colors.primary,
    fontSize: 34,
    lineHeight: 36,
    marginTop: -4,
  },
  detailCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
  },
  profile: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  profileText: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontWeight: '700',
  },
  profileNim: {
    color: '#64748b',
    marginTop: 4,
  },
  detailDivider: {
    marginVertical: 20,
  },
  detailRow: {
    marginBottom: 17,
  },
  detailLabel: {
    color: '#64748b',
    marginBottom: 3,
  },
  detailValue: {
    color: '#172554',
  },
  feedbackContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  feedbackText: {
    color: '#64748b',
    marginBottom: 18,
    marginTop: 16,
    textAlign: 'center',
  },
  errorIcon: {
    backgroundColor: '#dc2626',
  },
});
