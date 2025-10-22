# Pokemon Project – UTS Pemrograman Web

Credit : Muhammad Yusuf (NIM 122140193)  
Deployment :

Ini adalah project UTS mata kuliah Pemrograman Web yang fokusnya ke ekosistem React. Aplikasinya sendiri nge-display katalog Pokémon, ada fitur search, daftar favorit, plus arena simulasi battle yang datanya langsung diambil dari [PokeAPI](https://pokeapi.co/docs/v2). Semua fitur ini dibuat buat nunjukin kemampuan kita dalam bikin komponen, pakai hooks, manage state, routing, dan handle data asynchronous.

## Tujuan & Ruang Lingkup

- Ngambil data Pokémon langsung dari API eksternal pakai `fetch`.
- Bikin navigasi multi-halaman dengan React Router (home, favorit, battle arena, sama halaman 404).
- Manage state global pakai Zustand (detail Pokémon, favorit, dan battle slots) plus state lokal komponen.
- Kasih pengalaman user yang responsif dengan loading state, skeleton UI, validasi input, dan feedback error.

## Fitur Utama

- **Katalog & Pagination:** Halaman home (`src/pages/Home.jsx`) nampilin daftar Pokémon dengan paginasi yang dinamis. Skeleton card muncul pas lagi loading data.
- **Pencarian adaptif:** Komponen `PokemonSearchBar` (`src/components/ui/pokemon-search-bar.jsx`) buat search berdasarkan nama atau nomor Pokédex, udah ada validasi, status loading, dan tombol reset.
- **Detail interaktif:** Komponen kartu (`src/components/ui/card-grainny.jsx`) pakai dialog morphing buat nampilin detail lengkap, stats, plus bisa add ke favorit dan set battle slot.
- **Manajemen Favorit:** Halaman `src/pages/Favorites.jsx` nyimpen daftar Pokémon favorit di `localStorage` lewat Zustand (`src/hooks/use-favorite-pokemon.js`).
- **Battle Arena:** Halaman `src/pages/BattlePokemon.jsx` simulasi battle berdasarkan stats dengan countdown, battle log, dan visualisasi slot challenger vs opponent.
- **Fallback Routing:** Halaman `src/pages/NotFound.jsx` muncul kalau user masuk ke rute yang gak ada.

## Arsitektur & Organisasi Kode

```
src/
├─ components/       # UI components yang reusable + pendukung (dock, dialog, card)
├─ hooks/            # Custom hooks (fetch detail, pagination, favorites, battle)
├─ pages/            # Halaman-halaman utama sesuai rute
├─ lib/              # Utilities (helper className, dll.)
├─ main.jsx          # Entry point React + setup router
└─ index.css         # Global style pakai Tailwind CSS v4
```

- Mostly pakai functional components, masing-masing pake props dan ada validasi `PropTypes`.
- Zustand handle state global dan persistensi (`localStorage`) buat detail, favorit, dan battle slots (`src/hooks/use-pokemon-detail.js`, `src/hooks/use-favorite-pokemon.js`, `src/hooks/use-battle-pokemon.js`).
- Custom hooks (`usePokemonPagination`, `usePokemonDetail`, `usePokemonSearch`, `useBattlePokemon`, `useFavoritePokemon`, `useClickOutside`) nunjukin gimana cara pakai `useState`, `useEffect`, `useMemo`, `useCallback`, dan `useRef` buat manage lifecycle dan memoization.

## Teknologi

- **React 19** dengan pendekatan functional components.
- **Vite** buat development tooling (cek `package.json`).
- **React Router v7** buat routing.
- **Zustand** buat state management global dan persistensi.
- **Tailwind CSS v4**, `clsx`, dan `tailwind-merge` buat styling utility-first.
- **Lucide React** buat icon SVG yang ringan.
- **PokeAPI** sebagai sumber data utama (endpoint `https://pokeapi.co/api/v2/pokemon`).

## Penanganan Data

- Ngambil daftar dan detail Pokémon ditangani di custom hook (`src/hooks/use-pokemon-pagination.js`, `src/hooks/use-pokemon-detail.js`) dengan caching response, normalisasi data, plus atur status loading dan error.
- Error handling nampilin pesan yang user-friendly dan ada tombol retry buat load ulang data.
- Loading state ditampilin lewat spinner, skeleton card, dan fallback `Suspense` global (`PageLoader` di `src/main.jsx`).

## Cara Jalanin di Lokal

1. **Yang perlu disiapkan**: Node.js ≥ 18, npm atau bun.
2. **Install dependencies**
   ```bash
   npm install
   # atau
   bun install
   ```
3. **Jalanin dev server**
   ```bash
   npm run dev
   ```
   Aplikasi bisa diakses di alamat yang muncul di terminal (biasanya `http://localhost:5173`).
4. **Build untuk production** (opsional)
   ```bash
   npm run build
   npm run preview
   ```

## Saran Skenario Testing Manual

- Coba jelajah pagination di home sambil pastiin skeleton muncul dan gak ada request ganda.
- Test search dengan nama/ID yang valid dan invalid buat liat pesan error, reset, dan integrasi sama daftar favorit.
- Tandain Pokémon sebagai favorit dari halaman mana aja, pastiin muncul di `Favorites`, terus coba fitur `Clear favorites`.
- Simulasi battle: set challenger dan opponent dari list atau hasil search, jalanin battle-nya, perhatiin log, countdown, dan highlight pemenang.
- Akses rute yang random/gak ada buat mastiin halaman 404 jalan.

---
