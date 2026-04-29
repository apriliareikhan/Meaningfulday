import { useState } from 'react'
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react'
import { habitCompletionLast30 } from '../lib/storage'

const EMOJI_OPTIONS = ['💧', '🏃', '📚', '🧘', '🥗', '😴', '✍️', '🎨', '🎵', '🌱', '☀️', '🙏', '💪', '🧠', '❤️']

export default function HabitsManager({ data, setData }) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🌱')
  const [editingId, setEditingId] = useState(null)

  function addHabit() {
    if (!name.trim()) return
    const next = {
      ...data,
      habits: [...data.habits, { id: crypto.randomUUID(), name: name.trim(), emoji }],
    }
    setData(next)
    setName(''); setEmoji('🌱'); setAdding(false)
  }

  function deleteHabit(id) {
    if (!confirm('Hapus kebiasaan ini? Riwayatnya akan tetap tersimpan.')) return
    setData({ ...data, habits: data.habits.filter((h) => h.id !== id) })
  }

  function updateHabit(id, updates) {
    setData({ ...data, habits: data.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)) })
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 animate-fade-in">
      <div className="flex items-baseline justify-between mb-2">
        <h1 className="text-3xl font-serif-italic">Kebiasaan</h1>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="px-4 py-2 rounded-xl bg-rose-deep text-white text-sm font-semibold hover:bg-rose-deep/90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        )}
      </div>
      <p className="text-ink/60 mb-6">Pilih kebiasaan kecil yang ingin kamu rawat. Tidak perlu banyak — yang penting konsisten.</p>

      {adding && (
        <div className="mb-6 p-5 rounded-2xl bg-white border border-ink/10 animate-slide-up">
          <h3 className="font-semibold mb-3">Kebiasaan baru</h3>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Meditasi 5 menit"
            className="w-full p-3 rounded-xl border border-ink/10 focus:border-rose-deep focus:outline-none mb-3"
            autoFocus
          />
          <div className="flex flex-wrap gap-1 mb-4">
            {EMOJI_OPTIONS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`w-10 h-10 rounded-lg text-2xl transition ${emoji === e ? 'bg-gold/30 scale-110' : 'hover:bg-ink/5'}`}
              >
                {e}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={addHabit} className="px-4 py-2 rounded-xl bg-rose-deep text-white font-semibold hover:bg-rose-deep/90 flex items-center gap-2">
              <Check className="w-4 h-4" /> Simpan
            </button>
            <button onClick={() => { setAdding(false); setName(''); setEmoji('🌱') }} className="px-4 py-2 rounded-xl bg-ink/5 hover:bg-ink/10 flex items-center gap-2">
              <X className="w-4 h-4" /> Batal
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {data.habits.map((h) => {
          const done30 = habitCompletionLast30(data.entries, h.id)
          const pct = Math.round((done30 / 30) * 100)
          const isEditing = editingId === h.id
          return (
            <div key={h.id} className="p-4 rounded-xl bg-white border border-ink/10">
              {isEditing ? (
                <EditRow habit={h} onSave={(updates) => { updateHabit(h.id, updates); setEditingId(null) }} onCancel={() => setEditingId(null)} />
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{h.emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium">{h.name}</div>
                    <div className="text-xs text-ink/60 mt-1">{done30}/30 hari terakhir ({pct}%)</div>
                    <div className="mt-2 h-1.5 bg-ink/5 rounded-full overflow-hidden">
                      <div className="h-full bg-sage-deep rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <button onClick={() => setEditingId(h.id)} className="p-2 rounded-lg hover:bg-ink/5"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => deleteHabit(h.id)} className="p-2 rounded-lg hover:bg-rose-soft/50 text-rose-deep"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          )
        })}
        {data.habits.length === 0 && !adding && (
          <p className="text-ink/50 italic text-center py-12">Belum ada kebiasaan. Mulai dari satu yang paling kecil dulu 🌱</p>
        )}
      </div>
    </div>
  )
}

function EditRow({ habit, onSave, onCancel }) {
  const [name, setName] = useState(habit.name)
  const [emoji, setEmoji] = useState(habit.emoji)
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 p-2 rounded-lg border border-ink/10 focus:border-rose-deep focus:outline-none"
        />
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {EMOJI_OPTIONS.map((e) => (
          <button key={e} onClick={() => setEmoji(e)} className={`w-8 h-8 rounded-lg text-xl ${emoji === e ? 'bg-gold/30' : 'hover:bg-ink/5'}`}>{e}</button>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave({ name: name.trim() || habit.name, emoji })} className="px-3 py-1.5 rounded-lg bg-rose-deep text-white text-sm">Simpan</button>
        <button onClick={onCancel} className="px-3 py-1.5 rounded-lg bg-ink/5 text-sm">Batal</button>
      </div>
    </div>
  )
}
