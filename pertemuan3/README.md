# Pertemuan 3 - Props dan State di React Native

Dokumen ini menjelaskan konsep dasar `props` dan `state` pada React Native serta cara membuatnya dengan contoh kode singkat.

## Ringkasan
- **Props**: Data yang diteruskan dari komponen induk ke komponen anak (read-only di dalam komponen anak).
- **State**: Data internal komponen yang bisa berubah seiring waktu; biasanya dikelola dengan `useState` pada komponen fungsi.

## Prasyarat
- Node.js dan npm terpasang
- Jika menggunakan Expo: `expo-cli` (opsional)

Untuk menjalankan contoh di proyek ini:

```bash
cd pertemuan3
npm install
# atau jika menggunakan Expo
# npm install -g expo-cli
# expo start
npm start
```

## Props - Pengertian dan Contoh
Props (properties) digunakan untuk mengirim data dan callback dari komponen induk ke komponen anak.

Contoh: `Parent` meneruskan teks dan fungsi ke `Child`.

```js
// Parent.js
import React from 'react';
import { View } from 'react-native';
import Child from './Child';

export default function Parent() {
	const handlePress = () => alert('Tombol ditekan dari Child!');

	return (
		<View>
			<Child title="Halo dari Parent" onPress={handlePress} />
		</View>
	);
}

// Child.js
import React from 'react';
import { View, Text, Button } from 'react-native';

export default function Child(props) {
	return (
		<View>
			<Text>{props.title}</Text>
			<Button title="Tekan saya" onPress={props.onPress} />
		</View>
	);
}
```

Catatan:
- Komponen anak tidak boleh mengubah `props` secara langsung.
- Gunakan `props` untuk konfigurasi dan callback.

## State - Pengertian dan Contoh
State menyimpan data yang bisa berubah pada komponen. Pada komponen fungsi, gunakan hook `useState`.

Contoh Counter sederhana:

```js
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

export default function Counter() {
	const [count, setCount] = useState(0);

	return (
		<View>
			<Text>Hitungan: {count}</Text>
			<Button title="Tambah" onPress={() => setCount(count + 1)} />
			<Button title="Reset" onPress={() => setCount(0)} />
		</View>
	);
}
```

Contoh input teks yang menyimpan state:

```js
import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';

export default function NameInput() {
	const [name, setName] = useState('');

	return (
		<View>
			<TextInput
				placeholder="Masukkan nama"
				value={name}
				onChangeText={setName}
				style={{ borderWidth: 1, padding: 8 }}
			/>
			<Text>Halo, {name || 'teman'}!</Text>
		</View>
	);
}
```

## Perbedaan Singkat
- `props`: bersifat immutable di dalam komponen anak; berasal dari induk.
- `state`: mutable di dalam komponen sendiri; digunakan untuk UI yang berubah.

## Praktik Baik
- Gunakan `props` untuk meneruskan data dan callback.
- Simpan hanya data yang diperlukan di `state` (hindari duplikasi sumber kebenaran).
- Jika beberapa komponen membutuhkan state yang sama, angkat state ke induk bersama atau gunakan state manager (Context/Redux/MobX).

## Latihan
1. Buat komponen `TodoItem` yang menerima `title` lewat props.
2. Buat komponen `TodoList` dengan state array todo, tambahkan form untuk menambah todo baru.

## Sumber dan Referensi
- Dokumentasi React: https://reactjs.org
- Dokumentasi React Native: https://reactnative.dev

---
File ini dibuat untuk materi pertemuan 3 tentang `props` dan `state`.

