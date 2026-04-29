# Meaningful Days 🌷

Aplikasi web sederhana untuk **mencatat habit harian** + **gratitude journal**, dirancang agar kamu merasa **diapresiasi** setiap kali mengisinya.

## Fitur

- **Habit tracker harian** dengan emoji, streak, dan progress bar 30-hari
- **Gratitude journal** — 3 hal yang disyukuri tiap hari + mood
- **Sistem apresiasi**:
  - Confetti saat selesai mengisi
  - Pesan hangat berbeda tiap hari
  - Milestone celebrations (3, 7, 14, 21, 30, 60, 100, 365 hari)
  - Pesan personal pakai namamu
- **Statistik & heatmap** 10 minggu terakhir
- **Backup**: export/import JSON
- **Privat**: semua data tersimpan di browser kamu (localStorage), tidak ada server

## Cara menjalankan

```bash
npm install
npm run dev
```

Lalu buka http://localhost:5173

## Build untuk production

```bash
npm run build
npm run preview
```

## Tech stack

- Vite + React 18
- TailwindCSS
- lucide-react (icons)
- canvas-confetti
- date-fns

## Struktur

```
src/
├── App.jsx                  # Root + sidebar/nav
├── main.jsx
├── index.css
├── lib/
│   ├── storage.js           # localStorage + helpers
│   └── appreciation.js      # pesan hangat, milestones, confetti
└── components/
    ├── Dashboard.jsx        # Halaman "Hari Ini"
    ├── HabitsManager.jsx    # CRUD habit
    ├── JournalHistory.jsx   # Riwayat gratitude
    ├── Stats.jsx            # Heatmap & statistik
    └── Settings.jsx         # Nama, export/import, reset
```

## Roadmap (ide pengembangan)

- [ ] PWA (install ke HP)
- [ ] Notifikasi reminder
- [ ] Tema gelap
- [ ] Sync via Supabase (opsional)
- [ ] Tag/kategori untuk gratitude entry

---

Dibuat dengan ❤️ — semoga membantumu menjalani hari yang lebih bermakna.
