import { useEffect, useMemo, useState } from 'react'
import {
  Plus, Calendar as CalendarIcon, ListTodo, Trash2, Edit2, Check, X,
  Clock, AlertCircle, Flame, Circle, Play, Pause, RotateCcw, ChevronDown, ChevronRight,
} from 'lucide-react'
import {
  TASK_CATEGORIES, TASK_PRIORITIES, createTask, classifyTask, daysUntilDeadline,
} from '../lib/storage'
import { fireConfetti } from '../lib/appreciation'

const CATEGORY_STYLES = {
  kantor:  { bg: 'bg-sky-100',    text: 'text-sky-700',    border: 'border-sky-300',    dot: 'bg-sky-500' },
  kampus:  { bg: 'bg-lilac-soft', text: 'text-lilac-deep', border: 'border-lilac-deep/40', dot: 'bg-lilac-deep' },
  hobi:    { bg: 'bg-mint-soft',  text: 'text-mint-deep',  border: 'border-mint-deep/40', dot: 'bg-mint-deep' },
  pribadi: { bg: 'bg-rose-soft',  text: 'text-rose-deep',  border: 'border-rose-deep/40', dot: 'bg-rose-deep' },
}

const PRIORITY_STYLES = {
  high:   { bg: 'bg-rose-deep/10',  text: 'text-rose-deep',  label: '🔥 Tinggi' },
  medium: { bg: 'bg-gold/15',       text: 'text-gold',       label: '⚡ Sedang' },
  low:    { bg: 'bg-sage-soft',     text: 'text-sage-deep',  label: '🌿 Rendah' },
}

const SECTION_LABELS = {
  overdue:  { label: '🔴 Lewat deadline', color: 'text-rose-deep', bg: 'bg-rose-deep/5 border-rose-deep/30' },
  today:    { label: '🟠 Hari ini',       color: 'text-gold',      bg: 'bg-gold/10 border-gold/40' },
  tomorrow: { label: '🟡 Besok (H-1)',    color: 'text-lemon-deep', bg: 'bg-lemon-soft/40 border-lemon-deep/40' },
  thisweek: { label: '🟢 Minggu ini',     color: 'text-sage-deep', bg: 'bg-sage-soft/40 border-sage-deep/30' },
  later:    { label: '📋 Nanti',           color: 'text-ink/60',    bg: 'bg-white border-ink/10' },
  someday:  { label: '☁️ Tanpa deadline', color: 'text-ink/50',    bg: 'bg-ink/5 border-ink/10' },
  done:     { label: '✅ Selesai',         color: 'text-sage-deep', bg: 'bg-sage-soft/30 border-sage-deep/20' },
}

export default function Tasks({ data, setData }) {
  const [view, setView] = useState('list') // 'list' | 'calendar'
  const [filterCategory, setFilterCategory] = useState('all')
  const [showDone, setShowDone] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [pomodoroTask, setPomodoroTask] = useState(null)

  const tasks = data.tasks || []

  const filtered = useMemo(() => {
    let list = tasks
    if (filterCategory !== 'all') list = list.filter((t) => t.category === filterCategory)
    if (!showDone) list = list.filter((t) => t.status !== 'done')
    return list
  }, [tasks, filterCategory, showDone])

  const grouped = useMemo(() => {
    const groups = { overdue: [], today: [], tomorrow: [], thisweek: [], later: [], someday: [], done: [] }
    filtered.forEach((t) => {
      const c = classifyTask(t)
      groups[c].push(t)
    })
    // Sort by priority within each group
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    Object.keys(groups).forEach((k) => {
      groups[k].sort((a, b) => (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9))
    })
    return groups
  }, [filtered])

  function saveTask(taskData) {
    const next = { ...data }
    if (editingTask) {
      next.tasks = tasks.map((t) => (t.id === editingTask.id ? { ...t, ...taskData } : t))
    } else {
      next.tasks = [...tasks, createTask(taskData)]
    }
    setData(next)
    setShowForm(false)
    setEditingTask(null)
  }

  function deleteTask(id) {
    if (!confirm('Hapus tugas ini?')) return
    setData({ ...data, tasks: tasks.filter((t) => t.id !== id) })
  }

  function toggleStatus(task) {
    const newStatus = task.status === 'done' ? 'todo' : 'done'
    const next = {
      ...data,
      tasks: tasks.map((t) =>
        t.id === task.id
          ? { ...t, status: newStatus, completedAt: newStatus === 'done' ? new Date().toISOString() : null }
          : t,
      ),
    }
    setData(next)
    if (newStatus === 'done') fireConfetti('normal')
  }

  function toggleSubtask(taskId, subId) {
    const next = {
      ...data,
      tasks: tasks.map((t) =>
        t.id === taskId
          ? { ...t, subtasks: t.subtasks.map((s) => (s.id === subId ? { ...s, done: !s.done } : s)) }
          : t,
      ),
    }
    setData(next)
  }

  function incrementPomodoro(taskId) {
    setData({
      ...data,
      tasks: tasks.map((t) => (t.id === taskId ? { ...t, pomodoroCount: (t.pomodoroCount || 0) + 1 } : t)),
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-serif-italic">Tugas</h1>
          <p className="text-sm text-ink/60 mt-1">Atur kegiatan kantor, kampus, dan hobi-mu di sini.</p>
        </div>
        <button
          onClick={() => { setEditingTask(null); setShowForm(true) }}
          className="px-4 py-2.5 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Tambah tugas
        </button>
      </div>

      {/* View toggle + filter */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="flex bg-white rounded-xl border border-ink/10 p-1">
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 ${view === 'list' ? 'bg-sky-500 text-white' : 'text-ink/60'}`}
          >
            <ListTodo className="w-4 h-4" /> List
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 ${view === 'calendar' ? 'bg-sky-500 text-white' : 'text-ink/60'}`}
          >
            <CalendarIcon className="w-4 h-4" /> Kalender
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 ml-auto">
          <FilterChip active={filterCategory === 'all'} onClick={() => setFilterCategory('all')}>
            Semua
          </FilterChip>
          {TASK_CATEGORIES.map((c) => (
            <FilterChip
              key={c.id}
              active={filterCategory === c.id}
              onClick={() => setFilterCategory(c.id)}
            >
              {c.emoji} {c.label}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* Toggle show done */}
      <label className="inline-flex items-center gap-2 text-sm text-ink/60 mb-5 cursor-pointer">
        <input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} className="rounded" />
        Tampilkan yang sudah selesai
      </label>

      {/* Body */}
      {view === 'list' ? (
        <ListView
          grouped={grouped}
          onToggleStatus={toggleStatus}
          onEdit={(t) => { setEditingTask(t); setShowForm(true) }}
          onDelete={deleteTask}
          onToggleSubtask={toggleSubtask}
          onPomodoro={(t) => setPomodoroTask(t)}
          totalTasks={tasks.length}
        />
      ) : (
        <CalendarView
          tasks={filtered}
          onTaskClick={(t) => { setEditingTask(t); setShowForm(true) }}
        />
      )}

      {/* Form modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSave={saveTask}
          onClose={() => { setShowForm(false); setEditingTask(null) }}
        />
      )}

      {/* Pomodoro modal */}
      {pomodoroTask && (
        <PomodoroTimer
          task={pomodoroTask}
          onComplete={() => incrementPomodoro(pomodoroTask.id)}
          onClose={() => setPomodoroTask(null)}
        />
      )}
    </div>
  )
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
        active ? 'bg-ink text-cream' : 'bg-white border border-ink/10 text-ink/70 hover:bg-ink/5'
      }`}
    >
      {children}
    </button>
  )
}

// ===== List View =====
function ListView({ grouped, onToggleStatus, onEdit, onDelete, onToggleSubtask, onPomodoro, totalTasks }) {
  const sectionOrder = ['overdue', 'today', 'tomorrow', 'thisweek', 'later', 'someday', 'done']
  const hasAny = sectionOrder.some((s) => grouped[s].length > 0)

  if (!hasAny) {
    return (
      <div className="text-center py-16 text-ink/50">
        <div className="text-5xl mb-3">📋</div>
        <p className="font-serif-italic text-lg">
          {totalTasks === 0 ? 'Belum ada tugas' : 'Tidak ada tugas di filter ini'}
        </p>
        <p className="text-sm mt-1">
          {totalTasks === 0 ? 'Klik "Tambah tugas" untuk memulai.' : 'Coba ubah filter di atas.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sectionOrder.map((sec) => {
        const list = grouped[sec]
        if (list.length === 0) return null
        const sl = SECTION_LABELS[sec]
        return (
          <section key={sec}>
            <h2 className={`text-sm font-semibold mb-2 ${sl.color}`}>
              {sl.label} <span className="text-ink/40 font-normal">({list.length})</span>
            </h2>
            <div className="space-y-2">
              {list.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onToggleStatus={() => onToggleStatus(t)}
                  onEdit={() => onEdit(t)}
                  onDelete={() => onDelete(t.id)}
                  onToggleSubtask={(subId) => onToggleSubtask(t.id, subId)}
                  onPomodoro={() => onPomodoro(t)}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function TaskCard({ task, onToggleStatus, onEdit, onDelete, onToggleSubtask, onPomodoro }) {
  const [expanded, setExpanded] = useState(false)
  const cs = CATEGORY_STYLES[task.category] || CATEGORY_STYLES.pribadi
  const ps = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium
  const cat = TASK_CATEGORIES.find((c) => c.id === task.category)
  const days = daysUntilDeadline(task.deadline)
  const done = task.status === 'done'
  const subDone = task.subtasks?.filter((s) => s.done).length || 0
  const subTotal = task.subtasks?.length || 0

  return (
    <div className={`rounded-xl border bg-white p-4 transition ${done ? 'opacity-60' : 'hover:shadow-sm'}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={onToggleStatus}
          className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
            done ? 'bg-sage-deep border-sage-deep text-white' : 'border-ink/30 hover:border-sage-deep'
          }`}
          aria-label="Toggle done"
        >
          {done && <Check className="w-3.5 h-3.5" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            <h3 className={`font-medium leading-snug flex-1 min-w-0 break-words ${done ? 'line-through text-ink/50' : ''}`}>
              {task.title}
            </h3>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={onPomodoro}
                title="Mulai sesi fokus"
                className="p-1.5 rounded-lg hover:bg-rose-soft/40 text-ink/50 hover:text-rose-deep"
              >
                🍅
              </button>
              <button
                onClick={onEdit}
                title="Edit"
                className="p-1.5 rounded-lg hover:bg-ink/5 text-ink/50"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onDelete}
                title="Hapus"
                className="p-1.5 rounded-lg hover:bg-rose-deep/10 text-ink/50 hover:text-rose-deep"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2 text-xs">
            <span className={`px-2 py-0.5 rounded-full ${cs.bg} ${cs.text} font-medium`}>
              {cat?.emoji} {cat?.label}
            </span>
            <span className={`px-2 py-0.5 rounded-full ${ps.bg} ${ps.text} font-medium`}>
              {ps.label}
            </span>
            {task.deadline && (
              <span className={`px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                days < 0 ? 'bg-rose-deep/10 text-rose-deep' :
                days === 0 ? 'bg-gold/15 text-gold' :
                days === 1 ? 'bg-lemon-soft text-lemon-deep' :
                'bg-ink/5 text-ink/60'
              }`}>
                <Clock className="w-3 h-3" />
                {formatDeadline(task.deadline, days)}
              </span>
            )}
            {task.pomodoroCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-soft/40 text-rose-deep font-medium">
                🍅 {task.pomodoroCount}
              </span>
            )}
          </div>

          {/* Subtask progress + notes toggle */}
          {(subTotal > 0 || task.notes) && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-xs text-ink/60 hover:text-ink flex items-center gap-1"
            >
              {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              {subTotal > 0 && <span>{subDone}/{subTotal} subtask</span>}
              {subTotal > 0 && task.notes && <span>·</span>}
              {task.notes && <span>catatan</span>}
            </button>
          )}

          {expanded && (
            <div className="mt-3 space-y-2">
              {task.notes && (
                <p className="text-sm text-ink/70 bg-ink/5 rounded-lg p-3 whitespace-pre-wrap">{task.notes}</p>
              )}
              {subTotal > 0 && (
                <div className="space-y-1">
                  {task.subtasks.map((s) => (
                    <label key={s.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-ink/5 px-2 py-1 rounded">
                      <input type="checkbox" checked={s.done} onChange={() => onToggleSubtask(s.id)} className="rounded" />
                      <span className={s.done ? 'line-through text-ink/40' : 'text-ink/80'}>{s.text}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function formatDeadline(deadline, days) {
  const d = new Date(deadline)
  const hasTime = deadline.includes('T')
  const dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  const timeStr = hasTime ? d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''
  if (days < 0) return `Lewat ${Math.abs(days)} hari`
  if (days === 0) return `Hari ini${timeStr ? ` · ${timeStr}` : ''}`
  if (days === 1) return `Besok${timeStr ? ` · ${timeStr}` : ''}`
  return `${dateStr}${timeStr ? ` · ${timeStr}` : ''}`
}

// ===== Calendar View =====
function CalendarView({ tasks, onTaskClick }) {
  const [month, setMonth] = useState(() => new Date())

  const tasksByDay = useMemo(() => {
    const map = {}
    tasks.forEach((t) => {
      if (!t.deadline) return
      const key = t.deadline.slice(0, 10)
      if (!map[key]) map[key] = []
      map[key].push(t)
    })
    return map
  }, [tasks])

  const year = month.getFullYear()
  const m = month.getMonth()
  const firstDay = new Date(year, m, 1)
  const lastDay = new Date(year, m + 1, 0)
  const startWeekday = firstDay.getDay() // 0=Sun
  const daysInMonth = lastDay.getDate()

  const cells = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const monthLabel = month.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  const today = new Date()
  const isToday = (d) => year === today.getFullYear() && m === today.getMonth() && d === today.getDate()

  const [selectedDay, setSelectedDay] = useState(null)
  const selectedKey = selectedDay
    ? `${year}-${String(m + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    : null
  const selectedTasks = selectedKey ? (tasksByDay[selectedKey] || []) : []

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setMonth(new Date(year, m - 1, 1))}
          className="px-3 py-1.5 rounded-lg hover:bg-ink/5 text-sm"
        >
          ← Sebelum
        </button>
        <h2 className="font-serif-italic text-xl capitalize">{monthLabel}</h2>
        <button
          onClick={() => setMonth(new Date(year, m + 1, 1))}
          className="px-3 py-1.5 rounded-lg hover:bg-ink/5 text-sm"
        >
          Setelah →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-ink/50 mb-1">
        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />
          const key = `${year}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
          const list = tasksByDay[key] || []
          const isSel = selectedDay === d
          return (
            <button
              key={i}
              onClick={() => setSelectedDay(d)}
              className={`aspect-square rounded-lg border p-1 text-sm flex flex-col items-center justify-start transition ${
                isSel ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-300' :
                isToday(d) ? 'border-gold bg-gold/10' :
                'border-ink/10 bg-white hover:bg-ink/5'
              }`}
            >
              <span className={`font-medium ${isToday(d) ? 'text-gold' : ''}`}>{d}</span>
              {list.length > 0 && (
                <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                  {list.slice(0, 3).map((t) => {
                    const cs = CATEGORY_STYLES[t.category]
                    return <span key={t.id} className={`w-1.5 h-1.5 rounded-full ${cs.dot}`} />
                  })}
                  {list.length > 3 && <span className="text-[8px] text-ink/50">+{list.length - 3}</span>}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {selectedDay && (
        <div className="mt-5 p-4 rounded-xl bg-white border border-ink/10">
          <h3 className="font-semibold mb-3">
            {selectedTasks.length === 0 ? 'Tidak ada tugas' : `${selectedTasks.length} tugas`}
            <span className="text-ink/50 font-normal ml-2 text-sm">
              {new Date(year, m, selectedDay).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </h3>
          <div className="space-y-1.5">
            {selectedTasks.map((t) => {
              const cs = CATEGORY_STYLES[t.category]
              return (
                <button
                  key={t.id}
                  onClick={() => onTaskClick(t)}
                  className="w-full text-left flex items-center gap-2 p-2 rounded-lg hover:bg-ink/5"
                >
                  <span className={`w-2 h-2 rounded-full ${cs.dot}`} />
                  <span className={`flex-1 text-sm ${t.status === 'done' ? 'line-through text-ink/40' : ''}`}>
                    {t.title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ===== Form Modal =====
function TaskForm({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task?.title || '')
  const [category, setCategory] = useState(task?.category || 'pribadi')
  const [priority, setPriority] = useState(task?.priority || 'medium')
  const [deadline, setDeadline] = useState(task?.deadline || '')
  const [notes, setNotes] = useState(task?.notes || '')
  const [subtasks, setSubtasks] = useState(
    task?.subtasks ? [...task.subtasks] : [],
  )
  const [newSubtask, setNewSubtask] = useState('')

  function addSubtask() {
    if (!newSubtask.trim()) return
    setSubtasks([...subtasks, { id: crypto.randomUUID(), text: newSubtask.trim(), done: false }])
    setNewSubtask('')
  }

  function removeSubtask(id) {
    setSubtasks(subtasks.filter((s) => s.id !== id))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    if (task) {
      // editing existing — preserve subtask done state
      onSave({ title: title.trim(), category, priority, deadline: deadline || null, notes, subtasks })
    } else {
      // new task
      onSave({ title: title.trim(), category, priority, deadline: deadline || null, notes, subtasks: subtasks.map((s) => s.text) })
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-cream rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up"
      >
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-serif-italic">{task ? 'Edit tugas' : 'Tambah tugas'}</h2>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-ink/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Judul *</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Misal: Submit laporan ke pak Budi"
              className="w-full mt-1 p-3 rounded-xl bg-white border border-ink/10 focus:border-sky-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Kategori</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {TASK_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium border transition ${
                    category === c.id
                      ? `${CATEGORY_STYLES[c.id].bg} ${CATEGORY_STYLES[c.id].text} ${CATEGORY_STYLES[c.id].border}`
                      : 'bg-white border-ink/10 text-ink/60 hover:bg-ink/5'
                  }`}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Prioritas</label>
            <div className="flex gap-2 mt-1">
              {TASK_PRIORITIES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id)}
                  className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium border transition ${
                    priority === p.id
                      ? `${PRIORITY_STYLES[p.id].bg} ${PRIORITY_STYLES[p.id].text} border-current`
                      : 'bg-white border-ink/10 text-ink/60 hover:bg-ink/5'
                  }`}
                >
                  {PRIORITY_STYLES[p.id].label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Deadline (opsional)</label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl bg-white border border-ink/10 focus:border-sky-400 focus:outline-none"
            />
            {deadline && (
              <button type="button" onClick={() => setDeadline('')} className="text-xs text-ink/50 hover:text-rose-deep mt-1">
                hapus deadline
              </button>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Subtask (langkah-langkah)</label>
            <div className="mt-1 space-y-1.5">
              {subtasks.map((s) => (
                <div key={s.id} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-ink/10">
                  <span className="flex-1 text-sm">{s.text}</span>
                  <button type="button" onClick={() => removeSubtask(s.id)} className="text-ink/40 hover:text-rose-deep">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSubtask() } }}
                  placeholder="Tambah langkah kecil..."
                  className="flex-1 p-2 rounded-lg bg-white border border-ink/10 focus:border-sky-400 focus:outline-none text-sm"
                />
                <button type="button" onClick={addSubtask} className="px-3 py-2 rounded-lg bg-ink/10 hover:bg-ink/15 text-sm">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink/60 uppercase tracking-wider">Catatan (opsional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Detail tambahan, link, atau hal yang perlu diingat..."
              className="w-full mt-1 p-3 rounded-xl bg-white border border-ink/10 focus:border-sky-400 focus:outline-none resize-none"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-ink/5 hover:bg-ink/10 font-semibold"
          >
            Batal
          </button>
          <button
            type="submit"
            className="flex-1 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold"
          >
            {task ? 'Simpan' : 'Tambah'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ===== Pomodoro Timer =====
function PomodoroTimer({ task, onComplete, onClose }) {
  const FOCUS_SECONDS = 25 * 60
  const BREAK_SECONDS = 5 * 60
  const [mode, setMode] = useState('focus') // 'focus' | 'break'
  const [seconds, setSeconds] = useState(FOCUS_SECONDS)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const tick = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          // session complete
          if (mode === 'focus') {
            onComplete()
            // play a soft sound? we'll just rely on visual
            try {
              new Audio('data:audio/mp3;base64,').play().catch(() => {})
            } catch {}
            setMode('break')
            setRunning(false)
            return BREAK_SECONDS
          } else {
            setMode('focus')
            setRunning(false)
            return FOCUS_SECONDS
          }
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(tick)
  }, [running, mode])

  function reset() {
    setRunning(false)
    setSeconds(mode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS)
  }

  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  const total = mode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS
  const progress = ((total - seconds) / total) * 100

  return (
    <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-slide-up text-center ${
          mode === 'focus' ? 'bg-gradient-to-br from-rose-soft/40 to-cream' : 'bg-gradient-to-br from-mint-soft/60 to-cream'
        }`}
      >
        <div className="flex justify-between items-start mb-2">
          <span className={`text-xs font-semibold uppercase tracking-widest ${mode === 'focus' ? 'text-rose-deep' : 'text-mint-deep'}`}>
            {mode === 'focus' ? '🍅 Sesi Fokus' : '☕ Istirahat'}
          </span>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-ink/5">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-ink/60 mb-1 line-clamp-2">{task.title}</p>
        {task.pomodoroCount > 0 && (
          <p className="text-xs text-ink/50 mb-4">Sudah {task.pomodoroCount} sesi selesai 🌟</p>
        )}

        {/* Circular progress */}
        <div className="relative w-48 h-48 mx-auto my-4">
          <svg className="w-full h-full -rotate-90">
            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="6" fill="none" className="text-ink/10" />
            <circle
              cx="96" cy="96" r="88"
              stroke="currentColor" strokeWidth="6" fill="none"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
              className={mode === 'focus' ? 'text-rose-deep' : 'text-mint-deep'}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-bold tabular-nums">
              {String(min).padStart(2, '0')}:{String(sec).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="flex gap-2 justify-center mt-4">
          <button
            onClick={() => setRunning(!running)}
            className={`px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 ${
              mode === 'focus' ? 'bg-rose-deep text-white hover:bg-rose-deep/90' : 'bg-mint-deep text-white hover:bg-mint-deep/90'
            }`}
          >
            {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {running ? 'Jeda' : 'Mulai'}
          </button>
          <button
            onClick={reset}
            className="px-4 py-2.5 rounded-xl bg-ink/10 hover:bg-ink/15 font-semibold flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>

        <p className="text-xs text-ink/40 mt-4 italic">
          {mode === 'focus'
            ? 'Tutup distraksi. Fokus 25 menit, lalu istirahat singkat.'
            : 'Rehat sebentar. Minum air, regangkan tubuh.'}
        </p>
      </div>
    </div>
  )
}
