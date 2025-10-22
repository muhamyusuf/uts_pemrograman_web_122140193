# Checklist Penilaian UTS React JS

Gunakan daftar periksa ini untuk memastikan setiap kriteria penilaian telah terpenuhi sekaligus mengetahui lokasi implementasinya di dalam kode.

## Implementasi Komponen (20%)

- [x] Tersedia lebih dari 5 komponen fungsional berbeda (`src/pages/Home.jsx`, `src/pages/Favorites.jsx`, `src/pages/BattlePokemon.jsx`, `src/components/ui/pokemon-search-bar.jsx`, `src/components/ui/card-grainny.jsx`, `src/components/ui/dock.jsx`).
- [x] Komunikasi data antar komponen melalui props (`src/components/ui/card-grainny.jsx`, `src/components/ui/pokemon-search-bar.jsx`).
- [x] Validasi props menggunakan `PropTypes` (`src/components/ui/card-grainny.jsx`, `src/components/ui/pokemon-search-bar.jsx`, `src/pages/BattlePokemon.jsx`).
- [x] Komponen dengan state lokal menggunakan `useState` (`src/pages/Home.jsx`, `src/components/ui/card-grainny.jsx`, `src/pages/Favorites.jsx`).

## Hooks dan Lifecycle (20%)

- [x] Penggunaan `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef` di berbagai komponen (`src/pages/Home.jsx`, `src/pages/BattlePokemon.jsx`, `src/components/ui/card-grainny.jsx`, `src/hooks/use-pokemon-pagination.js`).
- [x] Minimal satu custom hook (`src/hooks/use-pokemon-search.js`, `src/hooks/use-pokemon-pagination.js`, `src/hooks/use-click-outside.jsx`).
- [x] Side effect data fetching melalui `useEffect` (`src/hooks/use-pokemon-detail.js`, `src/hooks/use-pokemon-pagination.js`).

## State Management (15%)

- [x] State global menggunakan Zustand dengan middleware persist (`src/hooks/use-pokemon-detail.js`, `src/hooks/use-favorite-pokemon.js`, `src/hooks/use-battle-pokemon.js`).
- [x] Pemisahan selector dan action menggunakan hook khusus (`src/hooks/use-battle-pokemon.js`, `src/hooks/use-favorite-pokemon.js`).

## Routing (15%)

- [x] Setup React Router dengan beberapa halaman (`src/main.jsx`).
- [x] Dynamic routing menggunakan parameter ID pada detail yang di-fetch (melalui `usePokemonDetailStoreApi` memanfaatkan ID dari hasil pencarian di `src/components/ui/pokemon-search-bar.jsx` dan `src/components/ui/card-grainny.jsx`).
- [x] Halaman fallback untuk rute tidak ditemukan (`src/pages/NotFound.jsx`).

## Data Fetching (15%)

- [x] Pengambilan daftar Pokémon dengan HTTP GET (`src/hooks/use-pokemon-pagination.js`).
- [x] Pengambilan detail Pokémon (`src/hooks/use-pokemon-detail.js`).
- [x] Penanganan loading dan error saat fetching (`src/hooks/use-pokemon-pagination.js`, `src/hooks/use-pokemon-detail.js`, `src/components/ui/pokemon-search-bar.jsx`).

## Desain UI dan UX (10%)

- [x] Tampilan responsif dengan Tailwind CSS (`src/index.css`, komponen di `src/pages/`).
- [x] Skeleton loading dan animasi untuk meningkatkan UX (`src/pages/Home.jsx`, `src/components/ui/card-grainny.jsx`, `src/pages/BattlePokemon.jsx`).
- [x] Feedback interaksi (tooltip, button state, highlight) (`src/components/ui/card-grainny.jsx`, `src/pages/BattlePokemon.jsx`).

## Kode Bersih dan Terorganisir (5%)

- [x] Struktur folder modular (`src/components`, `src/hooks`, `src/pages`, `src/lib`).
- [x] Penamaan konsisten dan penggunaan utilitas helper (`src/lib/utils.js`).
- [x] ESLint siap pakai untuk menjaga kualitas (`eslint.config.js`).

## Bonus Deployment (10%)

- [ ] Deployment ke Vercel atau platform lain (belum dikonfigurasi).
