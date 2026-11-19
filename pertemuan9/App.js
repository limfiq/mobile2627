import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
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
  TextInput,
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
    CREATE TABLE IF NOT EXISTS app_metadata (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);

  const seedStatus = await db.getFirstAsync(
    'SELECT value FROM app_metadata WHERE key = ?',
    'initialMahasiswaSeeded'
  );
  if (!seedStatus) {
    const existingStudents = await db.getFirstAsync(
      'SELECT COUNT(*) AS count FROM mahasiswa'
    );

    if (existingStudents.count === 0) {
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
    }

    await db.runAsync(
      'INSERT INTO app_metadata (key, value) VALUES (?, ?)',
      'initialMahasiswaSeeded',
      'true'
    );
  }

  return db.getAllAsync(
    `SELECT id, nim, nama, jurusan, angkatan, email, noTelepon, alamat
     FROM mahasiswa
     ORDER BY nama COLLATE NOCASE`
  );
}

async function createMahasiswa(student) {
  const db = await SQLite.openDatabaseAsync('mahasiswa.db');
  await db.runAsync(
    `INSERT INTO mahasiswa
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

async function updateMahasiswa(id, student) {
  const db = await SQLite.openDatabaseAsync('mahasiswa.db');
  await db.runAsync(
    `UPDATE mahasiswa
     SET nim = ?, nama = ?, jurusan = ?, angkatan = ?, email = ?,
         noTelepon = ?, alamat = ?
     WHERE id = ?`,
    student.nim,
    student.nama,
    student.jurusan,
    student.angkatan,
    student.email,
    student.noTelepon,
    student.alamat,
    id
  );
}

async function deleteMahasiswa(id) {
  const db = await SQLite.openDatabaseAsync('mahasiswa.db');
  await db.runAsync('DELETE FROM mahasiswa WHERE id = ?', id);
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

function StudentList({ students, onSelect, onAdd }) {
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
            Kelola data mahasiswa yang tersimpan di perangkat ini.
          </Text>
        </View>
      </View>

      <Button
        mode="contained"
        icon="plus"
        onPress={onAdd}
        style={styles.addButton}
        contentStyle={styles.actionButtonContent}
      >
        Tambah Mahasiswa
      </Button>

      <ScrollView
        style={styles.studentListScroll}
        contentContainerStyle={styles.studentListContent}
      >
        {students.length === 0 ? (
          <Surface style={styles.emptySurface} elevation={1}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              Belum ada data mahasiswa. Tambahkan data pertama Anda.
            </Text>
          </Surface>
        ) : (
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
        )}
      </ScrollView>
    </View>
  );
}

function StudentDetail({ student, onBack, onEdit, onDelete }) {
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

      <View style={styles.detailActions}>
        <Button
          mode="contained"
          icon="pencil"
          onPress={onEdit}
          style={styles.detailActionButton}
          contentStyle={styles.actionButtonContent}
        >
          Edit
        </Button>
        <Button
          mode="outlined"
          icon="delete-outline"
          onPress={onDelete}
          textColor="#b91c1c"
          style={styles.detailActionButton}
          contentStyle={styles.actionButtonContent}
        >
          Hapus
        </Button>
      </View>
    </View>
  );
}

function StudentForm({ student, onCancel, onSave, isSaving }) {
  const [values, setValues] = useState({
    nim: student?.nim ?? '',
    nama: student?.nama ?? '',
    jurusan: student?.jurusan ?? '',
    angkatan: student?.angkatan ?? '',
    email: student?.email ?? '',
    noTelepon: student?.noTelepon ?? '',
    alamat: student?.alamat ?? '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const fields = [
    { key: 'nim', label: 'NIM', keyboardType: 'number-pad' },
    { key: 'nama', label: 'Nama lengkap' },
    { key: 'jurusan', label: 'Jurusan' },
    { key: 'angkatan', label: 'Angkatan', keyboardType: 'number-pad' },
    {
      key: 'email',
      label: 'Email',
      keyboardType: 'email-address',
      autoCapitalize: 'none',
    },
    {
      key: 'noTelepon',
      label: 'No. Telepon',
      keyboardType: 'phone-pad',
    },
    { key: 'alamat', label: 'Alamat', multiline: true },
  ];

  async function handleSubmit() {
    const studentValues = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value.trim()])
    );

    if (Object.values(studentValues).some((value) => !value)) {
      setErrorMessage('Semua kolom wajib diisi.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentValues.email)) {
      setErrorMessage('Masukkan alamat email yang valid.');
      return;
    }

    setErrorMessage('');
    try {
      await onSave(studentValues);
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      setErrorMessage(
        message.includes('UNIQUE constraint failed')
          ? 'NIM tersebut sudah digunakan oleh mahasiswa lain.'
          : message || 'Data mahasiswa tidak dapat disimpan. Silakan coba lagi.'
      );
    }
  }

  return (
    <View style={styles.content}>
      <View style={styles.detailHeader}>
        <Pressable
          style={styles.backButton}
          onPress={onCancel}
          disabled={isSaving}
          accessibilityRole="button"
          accessibilityState={{ disabled: isSaving }}
          accessibilityLabel="Kembali"
        >
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>
        <Text variant="titleLarge" style={styles.detailHeaderTitle}>
          {student ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'}
        </Text>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.formContent}
      >
        {fields.map((field) => (
          <TextInput
            key={field.key}
            label={field.label}
            mode="outlined"
            value={values[field.key]}
            onChangeText={(value) =>
              setValues((current) => ({ ...current, [field.key]: value }))
            }
            keyboardType={field.keyboardType}
            autoCapitalize={field.autoCapitalize}
            multiline={field.multiline}
            numberOfLines={field.multiline ? 3 : 1}
            style={field.multiline ? styles.addressInput : styles.formInput}
            accessibilityLabel={field.label}
          />
        ))}

        {errorMessage ? (
          <Text accessibilityRole="alert" style={styles.formError}>
            {errorMessage}
          </Text>
        ) : null}

        <View style={styles.formActions}>
          <Button
            mode="outlined"
            onPress={onCancel}
            disabled={isSaving}
            style={styles.detailActionButton}
            contentStyle={styles.actionButtonContent}
          >
            Batal
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isSaving}
            disabled={isSaving}
            style={styles.detailActionButton}
            contentStyle={styles.actionButtonContent}
          >
            {student ? 'Simpan Perubahan' : 'Simpan'}
          </Button>
        </View>
      </ScrollView>
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
  const [formState, setFormState] = useState(null);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const refreshStudents = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const loadedStudents = await loadMahasiswa();
      setStudents(loadedStudents);
      return loadedStudents;
    } catch {
      setErrorMessage(
        'Data mahasiswa tidak dapat dimuat. Pastikan database dapat diakses, lalu coba lagi.'
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStudents();
  }, [refreshStudents]);

  async function handleSaveStudent(values) {
    setIsSaving(true);
    try {
      if (formState.student) {
        await updateMahasiswa(formState.student.id, values);
      } else {
        await createMahasiswa(values);
      }

      const loadedStudents = await refreshStudents();
      if (!loadedStudents) {
        throw new Error(
          'Data tersimpan, tetapi daftar tidak dapat dimuat ulang. Kembali ke daftar dan coba lagi.'
        );
      }

      if (formState.student) {
        const updatedStudent = loadedStudents.find(
          (item) => item.id === formState.student.id
        );
        setSelectedStudent(updatedStudent ?? null);
      } else {
        setSelectedStudent(null);
      }
      setFormState(null);
    } finally {
      setIsSaving(false);
    }
  }

  function confirmDeleteStudent(student) {
    Alert.alert(
      'Hapus mahasiswa?',
      `Data ${student.nama} akan dihapus secara permanen dari perangkat ini.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMahasiswa(student.id);
              setSelectedStudent(null);
              await refreshStudents();
            } catch {
              Alert.alert(
                'Gagal menghapus data',
                'Data mahasiswa tidak dapat dihapus. Silakan coba lagi.'
              );
            }
          },
        },
      ]
    );
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        {formState ? (
          <StudentForm
            key={formState.student?.id ?? 'new'}
            student={formState.student}
            onCancel={() => setFormState(null)}
            onSave={handleSaveStudent}
            isSaving={isSaving}
          />
        ) : selectedStudent ? (
          <StudentDetail
            student={selectedStudent}
            onBack={() => setSelectedStudent(null)}
            onEdit={() => setFormState({ student: selectedStudent })}
            onDelete={() => confirmDeleteStudent(selectedStudent)}
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
          <StudentList
            students={students}
            onSelect={setSelectedStudent}
            onAdd={() => setFormState({ student: null })}
          />
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
  addButton: {
    borderRadius: 12,
    marginBottom: 16,
  },
  actionButtonContent: {
    minHeight: 46,
  },
  studentListScroll: {
    flex: 1,
  },
  studentListContent: {
    paddingBottom: 20,
  },
  listSurface: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  emptySurface: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
  },
  emptyText: {
    color: '#64748b',
    textAlign: 'center',
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
  detailActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  detailActionButton: {
    borderRadius: 12,
    flex: 1,
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
  formContent: {
    paddingBottom: 24,
  },
  formInput: {
    backgroundColor: '#ffffff',
    marginBottom: 12,
  },
  addressInput: {
    backgroundColor: '#ffffff',
    marginBottom: 12,
    minHeight: 96,
  },
  formError: {
    color: '#b91c1c',
    marginBottom: 12,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
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
