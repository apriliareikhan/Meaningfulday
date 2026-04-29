// LocalStorage wrapper with versioning + helpers
const KEY = 'meaningful-days-v1'

const defaultData = () => ({
  user: { name: '', createdAt: new Date().toISOString() },
  habits: [
    { id: crypto.randomUUID(), name: 'Minum air 8 gelas', emoji: '💧' },
    { id: crypto.randomUUID(), name: 'Olahraga 20 menit', emoji: '🏃' },
    { id: crypto.randomUUID(), name: 'Baca buku', emoji: '📚' },
  ],
  // entries[YYYY-MM-DD] = { habits: { [habitId]: true }, gratitude: [str, str, str], mood: 'happy' }
  entries: {},
  // Buku-buku yang sudah dibaca
  books: [],
  // Ide-ide yang muncul
  ideas: [],
  // Hal-hal baru yang dicoba
  newThings: [],
  // Jurnal "New Me" — refleksi panjang tentang perubahan diri
  newMeJournal: [],
  meta: { totalEntries: 0, longestStreak: 0 },
})

function migrate(data) {
  const def = defaultData()
  return {
    ...def,
    ...data,
    user: { ...def.user, ...(data.user || {}) },
    habits: data.habits || def.habits,
    entries: data.entries || {},
    books: data.books || [],
    ideas: data.ideas || [],
    newThings: data.newThings || [],
    newMeJournal: data.newMeJournal || [],
    meta: { ...def.meta, ...(data.meta || {}) },
  }
}

export function loadData() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      const data = defaultData()
      localStorage.setItem(KEY, JSON.stringify(data))
      return data
    }
    const parsed = JSON.parse(raw)
    const migrated = migrate(parsed)
    localStorage.setItem(KEY, JSON.stringify(migrated))
    return migrated
  } catch (e) {
    console.error('Storage load failed', e)
    return defaultData()
  }
}

export function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function todayKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function getEntry(data, dateKey) {
  return (
    data.entries[dateKey] || { habits: {}, gratitude: ['', '', ''], mood: null }
  )
}

export function setEntry(data, dateKey, entry) {
  data.entries = { ...data.entries, [dateKey]: entry }
  return data
}

// Calculate current streak of days that have at least one gratitude entry filled
export function calcGratitudeStreak(entries) {
  let streak = 0
  const d = new Date()
  while (true) {
    const key = todayKey(d)
    const e = entries[key]
    const hasGratitude =
      e && Array.isArray(e.gratitude) && e.gratitude.some((g) => g && g.trim().length > 0)
    if (hasGratitude) {
      streak++
      d.setDate(d.getDate() - 1)
    } else {
      // If no entry for "today" yet, allow checking yesterday
      if (streak === 0 && key === todayKey()) {
        d.setDate(d.getDate() - 1)
        continue
      }
      break
    }
    if (streak > 10000) break
  }
  return streak
}

export function totalGratitudeDays(entries) {
  return Object.values(entries).filter(
    (e) => e?.gratitude?.some((g) => g && g.trim().length > 0),
  ).length
}

export function habitCompletionLast30(entries, habitId) {
  let done = 0
  const d = new Date()
  for (let i = 0; i < 30; i++) {
    const key = todayKey(d)
    if (entries[key]?.habits?.[habitId]) done++
    d.setDate(d.getDate() - 1)
  }
  return done
}
