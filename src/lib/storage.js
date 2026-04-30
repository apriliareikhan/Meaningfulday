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
  // Tugas / to-do dengan kategori, deadline, prioritas, subtask
  tasks: [],
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
    tasks: data.tasks || [],
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

// ===== Tasks helpers =====

export const TASK_CATEGORIES = [
  { id: 'kantor', label: 'Kantor', color: 'sky', emoji: '💼' },
  { id: 'kampus', label: 'Kampus', color: 'lilac', emoji: '🎓' },
  { id: 'hobi',   label: 'Hobi',   color: 'mint', emoji: '🎨' },
  { id: 'pribadi', label: 'Pribadi', color: 'rose', emoji: '🌸' },
]

export const TASK_PRIORITIES = [
  { id: 'high',   label: 'Tinggi',  color: 'rose-deep' },
  { id: 'medium', label: 'Sedang',  color: 'gold' },
  { id: 'low',    label: 'Rendah',  color: 'sage-deep' },
]

export function createTask({ title, category = 'pribadi', priority = 'medium', deadline = null, notes = '', subtasks = [] }) {
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    category,
    priority,
    deadline, // ISO string e.g. '2026-05-01' or '2026-05-01T14:00'
    notes,
    subtasks: subtasks.map((s) => ({ id: crypto.randomUUID(), text: s, done: false })),
    status: 'todo', // 'todo' | 'doing' | 'done'
    createdAt: new Date().toISOString(),
    completedAt: null,
    pomodoroCount: 0, // berapa sesi pomodoro selesai untuk task ini
  }
}

// Compare deadline vs today; returns negative if overdue, 0 if today, positive if future
export function daysUntilDeadline(deadline) {
  if (!deadline) return null
  const d = new Date(deadline)
  d.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((d - today) / (1000 * 60 * 60 * 24))
}

export function classifyTask(task) {
  if (task.status === 'done') return 'done'
  const days = daysUntilDeadline(task.deadline)
  if (days === null) return 'someday'
  if (days < 0) return 'overdue'
  if (days === 0) return 'today'
  if (days === 1) return 'tomorrow'
  if (days <= 7) return 'thisweek'
  return 'later'
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
