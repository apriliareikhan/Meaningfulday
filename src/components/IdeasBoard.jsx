import { useMemo, useState } from 'react'
import { Lightbulb, Plus, Trash2, Pin, PinOff, Tag } from 'lucide-react'

const COLORS = ['lemon-soft', 'mint-soft', 'rose-soft', 'lilac-soft', 'sky-100']
const colorBg = {
  'lemon-soft': 'bg-lemon-soft',
  'mint-soft': 'bg-mint-soft',
  'rose-soft': 'bg-rose-soft',
  'lilac-soft': 'bg-lilac-soft',
  'sky-100': 'bg-sky-100',
}

export default function IdeasBoard({ data, setData }) {
  const ideas = data.ideas || []
  const [text, setText] = useState('')
  const [tag, setTag] = useState('')
  const [filter, setFilter] = useState('')

  const tags = useMemo(() => {
    const s = new Set()
    ideas.forEach((i) => i.tag && s.add(i.tag))
    return Array.from(s)
  }, [ideas])

  const filtered = useMemo(() => {
    const list = filter ? ideas.filter((i) => i.tag === filter) : ideas
    return [...list].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return b.createdAt.localeCompare(a.createdAt)
    })
  }, [ideas, filter])

  function add() {
    if (!text.trim()) return
    const idea = {
      id: crypto.randomUUID(),
      text: text.trim(),
      tag: tag.trim(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      pinned: false,
      createdAt: new Date().toISOString(),
    }
    setData({ ...data, ideas: [idea, ...ideas] })
    setText('')
    setTag('')
  }
  function update(id, patch) {
    setData({ ...data, ideas: ideas.map((i) => (i.id === id ? { ...i, ...patch } : i)) })
  }
  function remove(id) {
    setData({ ...data, ideas: ideas.filter((i) => i.id !== id) })
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <Lightbulb className="w-7 h-7 text-lemon-deep" />
        <h1 className="text-3xl font-serif-italic">Ide-ide di kepalaku</h1>
      </div>
      <p className="text-ink/60 mb-6">Tuangkan semua yang berseliweran di kepalamu — biar tidak penuh.</p>

      <div className="p-4 rounded-2xl glass-strong border border-white/70 mb-6 shadow-sm">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) add() }}
          placeholder="Apa yang ada di pikiranmu sekarang? Tulis bebas..."
          rows={3}
          className="w-full p-3 rounded-xl border border-sky-100 focus:border-sky-400 focus:outline-none resize-none bg-white"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Tag (opsional): bisnis, fiksi, refleksi..."
            className="flex-1 min-w-[180px] px-3 py-2 rounded-xl border border-sky-100 focus:border-sky-400 focus:outline-none bg-white text-sm"
          />
          <button
            onClick={add}
            className="px-5 py-2 rounded-xl bg-lemon-deep text-ink font-semibold hover:bg-lemon-deep/90 flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Tuang ide
          </button>
        </div>
        <p className="text-xs text-ink/40 mt-2">Tip: tekan Ctrl/Cmd + Enter untuk simpan cepat.</p>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setFilter('')}
            className={`px-3 py-1 rounded-full text-xs font-medium ${!filter ? 'bg-sky-500 text-white' : 'bg-white/70 text-ink/70'}`}
          >
            Semua ({ideas.length})
          </button>
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t === filter ? '' : t)}
              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                filter === t ? 'bg-sky-500 text-white' : 'bg-white/70 text-ink/70 hover:bg-white'
              }`}
            >
              <Tag className="w-3 h-3" /> {t}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 glass rounded-3xl border border-white/60">
          <div className="text-5xl mb-3">💭</div>
          <p className="text-ink/60">Belum ada ide. Ide pertamamu menunggu.</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((i) => (
          <div
            key={i.id}
            className={`p-4 rounded-2xl border border-white/70 ${colorBg[i.color] || 'bg-white'} shadow-sm transition hover:shadow-md group`}
            style={{ transform: i.pinned ? 'rotate(-0.5deg)' : 'none' }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-sm whitespace-pre-wrap leading-relaxed flex-1">{i.text}</p>
              <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => update(i.id, { pinned: !i.pinned })}
                  className="p-1 rounded hover:bg-white/60"
                  title={i.pinned ? 'Lepas pin' : 'Pin'}
                >
                  {i.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                </button>
                <button onClick={() => remove(i.id)} className="p-1 rounded hover:bg-white/60 text-rose-deep">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-ink/50">
              <span>{new Date(i.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
              {i.tag && <span className="px-2 py-0.5 rounded-full bg-white/60">#{i.tag}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
