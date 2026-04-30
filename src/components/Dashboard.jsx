import { useEffect, useMemo, useState } from 'react'
import { Check, Heart, Sparkles, Flame, Send, ListTodo, AlertCircle, ArrowRight } from 'lucide-react'
import {
  getEntry, setEntry, todayKey, calcGratitudeStreak, totalGratitudeDays,
  classifyTask, TASK_CATEGORIES,
} from '../lib/storage'
import {
  getDailyMessage, getDailyPrompt, getMilestoneFor, fireConfetti, appreciationFor,
} from '../lib/appreciation'

const MOODS = [
  { id: 'great', emoji: '😄', label: 'Luar biasa' },
  { id: 'good', emoji: '🙂', label: 'Baik' },
  { id: 'okay', emoji: '😐', label: 'Biasa' },
  { id: 'low', emoji: '😔', label: 'Sedih' },
  { id: 'tired', emoji: '😴', label: 'Lelah' },
]

export default function Dashboard({ data, setData, onGoToTasks }) {
  const dateKey = todayKey()
  const entry = getEntry(data, dateKey)
  const [gratitude, setGratitude] = useState(entry.gratitude)
  const [mood, setMood] = useState(entry.mood)
  const [toast, setToast] = useState(null)
  const [milestone, setMilestone] = useState(null)

  useEffect(() => {
    setGratitude(entry.gratitude)
    setMood(entry.mood)
  }, [dateKey])

  const dailyMsg = useMemo(() => getDailyMessage(), [])
  const prompt = useMemo(() => getDailyPrompt(), [])

  const streak = calcGratitudeStreak(data.entries)
  const totalDays = totalGratitudeDays(data.entries)

  function toggleHabit(habitId) {
    const cur = getEntry(data, dateKey)
    const newHabits = { ...cur.habits, [habitId]: !cur.habits[habitId] }
    const newEntry = { ...cur, habits: newHabits }
    const next = setEntry({ ...data }, dateKey, newEntry)
    setData(next)
    if (newHabits[habitId]) fireConfetti('soft')
  }

  function updateGratitude(idx, value) {
    const next = [...gratitude]
    next[idx] = value
    setGratitude(next)
  }

  function saveGratitude() {
    const cur = getEntry(data, dateKey)
    const filled = gratitude.some((g) => g && g.trim().length > 0)
    if (!filled) {
      setToast({ type: 'gentle', text: 'Tulis minimal satu hal ya 🌷' })
      setTimeout(() => setToast(null), 2500)
      return
    }
    const newEntry = { ...cur, gratitude, mood }
    const next = setEntry({ ...data }, dateKey, newEntry)
    setData(next)

    // Calculate streak after save
    const newStreak = calcGratitudeStreak(next.entries)
    const newTotal = totalGratitudeDays(next.entries)
    const ms = getMilestoneFor(newStreak)

    if (ms) {
      setMilestone(ms)
      fireConfetti('big')
    } else {
      fireConfetti('normal')
      setToast({
        type: 'love',
        text: appreciationFor({ name: data.user.name, streak: newStreak, totalDays: newTotal }),
      })
      setTimeout(() => setToast(null), 5000)
    }
  }

  const completedHabits = data.habits.filter((h) => entry.habits?.[h.id]).length

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 animate-fade-in">
      <Header streak={streak} totalDays={totalDays} name={data.user.name} />

      <TasksReminder tasks={data.tasks || []} onGoToTasks={onGoToTasks} />

      <div className="mt-6 mb-8 p-5 rounded-2xl bg-gradient-to-br from-rose-soft/40 to-gold/20 border border-rose-soft/60">
        <p className="font-serif-italic text-lg text-ink/80 leading-relaxed">
          <Sparkles className="inline w-4 h-4 mr-1 text-gold" />
          {dailyMsg}
        </p>
      </div>

      {/* Habits */}
      <section className="mb-10">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-semibold">Kebiasaan hari ini</h2>
          <span className="text-sm text-ink/60">{completedHabits}/{data.habits.length} selesai</span>
        </div>
        <div className="space-y-2">
          {data.habits.length === 0 && (
            <p className="text-ink/50 italic text-sm">Belum ada habit. Tambah di tab "Kebiasaan".</p>
          )}
          {data.habits.map((h) => {
            const done = !!entry.habits?.[h.id]
            return (
              <button
                key={h.id}
                onClick={() => toggleHabit(h.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                  done
                    ? 'bg-sage-soft/50 border-sage-deep/40 text-ink'
                    : 'bg-white border-ink/10 hover:border-rose-soft hover:bg-rose-soft/10'
                }`}
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${done ? 'bg-sage-deep text-white' : 'bg-ink/5'}`}>
                  {done && <Check className="w-4 h-4" />}
                </span>
                <span className="text-2xl">{h.emoji}</span>
                <span className={`font-medium ${done ? 'line-through opacity-60' : ''}`}>{h.name}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Mood */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Bagaimana perasaanmu hari ini?</h2>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMood(m.id)}
              className={`px-4 py-3 rounded-xl border transition-all ${
                mood === m.id ? 'bg-gold/20 border-gold scale-105' : 'bg-white border-ink/10 hover:border-gold/50'
              }`}
            >
              <span className="text-2xl mr-2">{m.emoji}</span>
              <span className="text-sm">{m.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Gratitude */}
      <section className="mb-8">
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="text-xl font-semibold">Hari ini aku bersyukur untuk...</h2>
          <Heart className="w-5 h-5 text-rose-deep" />
        </div>
        <p className="text-sm text-ink/60 italic mb-4">{prompt}</p>
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="mt-3 w-7 h-7 rounded-full bg-rose-soft/60 flex items-center justify-center text-rose-deep font-semibold text-sm shrink-0">
                {i + 1}
              </span>
              <textarea
                value={gratitude[i] || ''}
                onChange={(e) => updateGratitude(i, e.target.value)}
                placeholder={i === 0 ? 'Sesuatu yang membuatmu tersenyum...' : i === 1 ? 'Seseorang yang kamu hargai...' : 'Hal kecil yang berarti...'}
                rows={2}
                className="flex-1 p-3 rounded-xl bg-white border border-ink/10 focus:border-rose-deep focus:outline-none focus:ring-2 focus:ring-rose-soft/40 resize-none transition"
              />
            </div>
          ))}
        </div>
        <button
          onClick={saveGratitude}
          className="mt-5 w-full py-4 rounded-xl bg-rose-deep text-white font-semibold hover:bg-rose-deep/90 transition-all hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Simpan jurnal hari ini
        </button>
      </section>

      {toast && <Toast toast={toast} />}
      {milestone && <MilestoneModal milestone={milestone} onClose={() => setMilestone(null)} />}
    </div>
  )
}

function TasksReminder({ tasks, onGoToTasks }) {
  const grouped = useMemo(() => {
    const g = { overdue: [], today: [], tomorrow: [] }
    tasks.forEach((t) => {
      const c = classifyTask(t)
      if (c === 'overdue' || c === 'today' || c === 'tomorrow') g[c].push(t)
    })
    return g
  }, [tasks])

  const total = grouped.overdue.length + grouped.today.length + grouped.tomorrow.length
  if (total === 0) return null

  return (
    <div className="mt-6 p-4 rounded-2xl bg-white border border-ink/10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center gap-2">
          <ListTodo className="w-4 h-4 text-sky-500" /> Pengingat tugas
        </h3>
        {onGoToTasks && (
          <button
            onClick={onGoToTasks}
            className="text-xs text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
          >
            Lihat semua <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
      <div className="space-y-2">
        {grouped.overdue.length > 0 && (
          <ReminderSection
            label="🔴 Lewat deadline"
            tasks={grouped.overdue}
            color="text-rose-deep"
            bg="bg-rose-deep/5"
          />
        )}
        {grouped.today.length > 0 && (
          <ReminderSection
            label="🟠 Hari ini"
            tasks={grouped.today}
            color="text-gold"
            bg="bg-gold/10"
          />
        )}
        {grouped.tomorrow.length > 0 && (
          <ReminderSection
            label="🟡 Besok (H-1)"
            tasks={grouped.tomorrow}
            color="text-lemon-deep"
            bg="bg-lemon-soft/40"
          />
        )}
      </div>
    </div>
  )
}

function ReminderSection({ label, tasks, color, bg }) {
  return (
    <div className={`rounded-xl p-3 ${bg}`}>
      <p className={`text-xs font-semibold mb-1.5 ${color}`}>{label} · {tasks.length}</p>
      <ul className="space-y-1">
        {tasks.slice(0, 4).map((t) => {
          const cat = TASK_CATEGORIES.find((c) => c.id === t.category)
          return (
            <li key={t.id} className="flex items-center gap-2 text-sm">
              <span className="text-xs">{cat?.emoji}</span>
              <span className={t.status === 'done' ? 'line-through text-ink/40' : 'text-ink/80'}>
                {t.title}
              </span>
              {t.priority === 'high' && <span className="text-rose-deep text-xs">🔥</span>}
            </li>
          )
        })}
        {tasks.length > 4 && (
          <li className="text-xs text-ink/50 italic">dan {tasks.length - 4} tugas lainnya...</li>
        )}
      </ul>
    </div>
  )
}

function Header({ streak, totalDays, name }) {
  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 11) return 'Selamat pagi'
    if (h < 15) return 'Selamat siang'
    if (h < 18) return 'Selamat sore'
    return 'Selamat malam'
  })()
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  return (
    <div>
      <p className="text-sm text-ink/60">{today}</p>
      <h1 className="text-3xl font-serif-italic mt-1">
        {greeting}{name ? `, ${name}` : ''} 🌿
      </h1>
      <div className="flex gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-gold" />
          <span><strong>{streak}</strong> hari beruntun</span>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-deep" />
          <span><strong>{totalDays}</strong> total hari ditulis</span>
        </div>
      </div>
    </div>
  )
}

function Toast({ toast }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="px-5 py-4 rounded-2xl bg-ink text-cream shadow-2xl max-w-sm text-sm leading-relaxed">
        {toast.text}
      </div>
    </div>
  )
}

function MilestoneModal({ milestone, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in" onClick={onClose}>
      <div className="bg-cream rounded-3xl p-8 max-w-md shadow-2xl animate-slide-up text-center" onClick={(e) => e.stopPropagation()}>
        <div className="text-6xl mb-4 animate-pulse-soft">🏆</div>
        <h3 className="text-2xl font-serif-italic mb-3">{milestone.title}</h3>
        <p className="text-ink/80 leading-relaxed mb-6">{milestone.body}</p>
        <button
          onClick={onClose}
          className="px-6 py-3 rounded-xl bg-rose-deep text-white font-semibold hover:bg-rose-deep/90 transition"
        >
          Terima kasih 🤍
        </button>
      </div>
    </div>
  )
}
