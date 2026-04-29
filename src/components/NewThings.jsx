import { useState } from 'react'
import { Sparkle, Plus, Trash2, Pencil, X, ThumbsUp, ThumbsDown, BookHeart } from 'lucide-react'

const blankThing = () => ({
  id: crypto.randomUUID(),
  title: '',
  date: new Date().toISOString().slice(0, 10),
  pros: '',
  cons: '',
  liked: 'suka', // suka | biasa | nggak
  lesson: '',
})

const blankJournal = () => ({
  id: crypto.randomUUID(),
  date: new Date().toISOString().slice(0, 10),
  title: '',
  content: '',
})

export default function NewThings({ data, setData }) {
  const [tab, setTab] = useState('things')
  const [editing, setEditing] = useState(null)
  const [journalEditing, setJournalEditing] = useState(null)

  const things = data.newThings || []
  const journals = data.newMeJournal || []

  function saveThing(t) {
    if (!t.title.trim()) return alert('Beri nama hal barunya')
    const exists = things.find((x) => x.id === t.id)
    const next = exists ? things.map((x) => (x.id === t.id ? t : x)) : [t, ...things]
    setData({ ...data, newThings: next })
    setEditing(null)
  }
  function removeThing(id) {
    if (!confirm('Hapus catatan ini?')) return
    setData({ ...data, newThings: things.filter((x) => x.id !== id) })
  }
  function saveJournal(j) {
    if (!j.content.trim()) return alert('Tulis isi jurnal terlebih dahulu')
    const exists = journals.find((x) => x.id === j.id)
    const next = exists ? journals.map((x) => (x.id === j.id ? j : x)) : [j, ...journals]
    setData({ ...data, newMeJournal: next })
    setJournalEditing(null)
  }
  function removeJournal(id) {
    if (!confirm('Hapus jurnal ini?')) return
    setData({ ...data, newMeJournal: journals.filter((x) => x.id !== id) })
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <Sparkle className="w-7 h-7 text-mint-deep" />
        <h1 className="text-3xl font-serif-italic">Hal-hal baru & New Me</h1>
      </div>
      <p className="text-ink/60 mb-6">Setiap hal baru adalah versi baru dari dirimu.</p>

      <div className="inline-flex p-1 rounded-2xl glass-strong border border-white/70 mb-6">
        <TabBtn active={tab === 'things'} onClick={() => setTab('things')}>
          <Sparkle className="w-4 h-4" /> Hal yang kucoba
        </TabBtn>
        <TabBtn active={tab === 'journal'} onClick={() => setTab('journal')}>
          <BookHeart className="w-4 h-4" /> Jurnal "New Me"
        </TabBtn>
      </div>

      {tab === 'things' && (
        <>
          <button
            onClick={() => setEditing(blankThing())}
            className="px-4 py-2 rounded-xl bg-mint-deep text-white font-semibold hover:bg-mint-deep/90 flex items-center gap-2 mb-5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Catat hal baru
          </button>

          {things.length === 0 && <Empty emoji="🌱" text="Belum ada hal baru tercatat. Coba sesuatu dan tuliskan di sini!" />}

          <div className="grid sm:grid-cols-2 gap-4">
            {things.map((t) => (
              <ThingCard key={t.id} thing={t} onEdit={() => setEditing(t)} onDelete={() => removeThing(t.id)} />
            ))}
          </div>
        </>
      )}

      {tab === 'journal' && (
        <>
          <button
            onClick={() => setJournalEditing(blankJournal())}
            className="px-4 py-2 rounded-xl bg-lilac-deep text-white font-semibold hover:bg-lilac-deep/90 flex items-center gap-2 mb-5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Tulis jurnal baru
          </button>

          {journals.length === 0 && <Empty emoji="✍️" text="Tempat untuk merenungkan dirimu yang sedang tumbuh." />}

          <div className="space-y-3">
            {journals.map((j) => (
              <JournalCard key={j.id} journal={j} onEdit={() => setJournalEditing(j)} onDelete={() => removeJournal(j.id)} />
            ))}
          </div>
        </>
      )}

      {editing && <ThingEditor thing={editing} onSave={saveThing} onClose={() => setEditing(null)} />}
      {journalEditing && <JournalEditor journal={journalEditing} onSave={saveJournal} onClose={() => setJournalEditing(null)} />}
    </div>
  )
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition ${
        active ? 'bg-sky-500 text-white shadow' : 'text-ink/60 hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

function Empty({ emoji, text }) {
  return (
    <div className="text-center py-16 glass rounded-3xl border border-white/60">
      <div className="text-5xl mb-3">{emoji}</div>
      <p className="text-ink/60">{text}</p>
    </div>
  )
}

const LIKED = {
  suka: { emoji: '💚', label: 'Suka banget', color: 'bg-mint-soft text-mint-deep' },
  biasa: { emoji: '🤍', label: 'Biasa aja', color: 'bg-sky-100 text-sky-700' },
  nggak: { emoji: '💔', label: 'Nggak suka', color: 'bg-rose-soft text-rose-deep' },
}

function ThingCard({ thing, onEdit, onDelete }) {
  const liked = LIKED[thing.liked] || LIKED.biasa
  return (
    <div className="p-5 rounded-2xl glass-strong border border-white/70 shadow-sm hover:shadow-md transition group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-ink/50">{new Date(thing.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <h3 className="font-semibold text-lg leading-tight mt-1">{thing.title}</h3>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-sky-100"><Pencil className="w-4 h-4" /></button>
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-rose-soft text-rose-deep"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>

      <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${liked.color}`}>
        {liked.emoji} {liked.label}
      </span>

      {thing.pros && (
        <p className="mt-3 text-sm text-ink/80 flex gap-2"><ThumbsUp className="w-4 h-4 text-mint-deep shrink-0 mt-0.5" /> {thing.pros}</p>
      )}
      {thing.cons && (
        <p className="mt-2 text-sm text-ink/80 flex gap-2"><ThumbsDown className="w-4 h-4 text-rose-deep shrink-0 mt-0.5" /> {thing.cons}</p>
      )}
      {thing.lesson && (
        <div className="mt-3 p-3 rounded-xl bg-lemon-soft text-sm text-ink/80">
          <span className="font-semibold">Pelajaran: </span>{thing.lesson}
        </div>
      )}
    </div>
  )
}

function JournalCard({ journal, onEdit, onDelete }) {
  return (
    <div className="p-5 rounded-2xl glass-strong border border-white/70 shadow-sm hover:shadow-md transition group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-[11px] text-ink/50">{new Date(journal.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          {journal.title && <h3 className="font-serif-italic text-xl mt-1">{journal.title}</h3>}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-sky-100"><Pencil className="w-4 h-4" /></button>
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-rose-soft text-rose-deep"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
      <p className="text-ink/80 whitespace-pre-wrap leading-relaxed">{journal.content}</p>
    </div>
  )
}

function ThingEditor({ thing, onSave, onClose }) {
  const [t, setT] = useState(thing)
  const set = (k, v) => setT({ ...t, [k]: v })
  return (
    <Modal onClose={onClose} title={thing.title ? 'Edit hal baru' : 'Hal baru yang kucoba'}>
      <Field label="Apa yang kamu coba?">
        <input value={t.title} onChange={(e) => set('title', e.target.value)} className={inp} placeholder="Cold brew, kursus melukis, rute baru ke kantor..." />
      </Field>
      <Field label="Tanggal">
        <input type="date" value={t.date} onChange={(e) => set('date', e.target.value)} className={inp} />
      </Field>
      <Field label="Plus / hal yang oke">
        <textarea value={t.pros} onChange={(e) => set('pros', e.target.value)} rows={2} className={inp + ' resize-none'} />
      </Field>
      <Field label="Minus / hal yang kurang">
        <textarea value={t.cons} onChange={(e) => set('cons', e.target.value)} rows={2} className={inp + ' resize-none'} />
      </Field>
      <Field label="Suka / nggak?">
        <div className="flex gap-2 flex-wrap">
          {Object.entries(LIKED).map(([id, v]) => (
            <button
              key={id}
              type="button"
              onClick={() => set('liked', id)}
              className={`px-3 py-2 rounded-xl border-2 ${t.liked === id ? 'border-sky-400 bg-white' : 'border-transparent bg-white/60'}`}
            >
              {v.emoji} {v.label}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Apa yang bisa dipelajari?">
        <textarea value={t.lesson} onChange={(e) => set('lesson', e.target.value)} rows={3} className={inp + ' resize-none'} placeholder="Pelajaran kecil yang kamu bawa pulang..." />
      </Field>
      <div className="flex gap-2 mt-5">
        <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-ink/10 hover:bg-ink/5">Batal</button>
        <button onClick={() => onSave(t)} className="flex-1 py-3 rounded-xl bg-mint-deep text-white font-semibold hover:bg-mint-deep/90">Simpan</button>
      </div>
    </Modal>
  )
}

function JournalEditor({ journal, onSave, onClose }) {
  const [j, setJ] = useState(journal)
  const set = (k, v) => setJ({ ...j, [k]: v })
  return (
    <Modal onClose={onClose} title={journal.content ? 'Edit jurnal New Me' : 'Jurnal New Me'}>
      <Field label="Tanggal">
        <input type="date" value={j.date} onChange={(e) => set('date', e.target.value)} className={inp} />
      </Field>
      <Field label="Judul (opsional)">
        <input value={j.title} onChange={(e) => set('title', e.target.value)} className={inp} placeholder="Aku yang sekarang..." />
      </Field>
      <Field label="Apa yang ingin kamu ceritakan ke diri masa depanmu?">
        <textarea
          value={j.content}
          onChange={(e) => set('content', e.target.value)}
          rows={10}
          className={inp + ' resize-none leading-relaxed'}
          placeholder="Tulis bebas — tentang siapa dirimu sekarang, apa yang sedang berubah, apa yang sedang kamu pelajari tentang diri sendiri..."
        />
      </Field>
      <div className="flex gap-2 mt-5">
        <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-ink/10 hover:bg-ink/5">Batal</button>
        <button onClick={() => onSave(j)} className="flex-1 py-3 rounded-xl bg-lilac-deep text-white font-semibold hover:bg-lilac-deep/90">Simpan</button>
      </div>
    </Modal>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 bg-sky-700/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto space-y-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-serif-italic">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-ink/5"><X className="w-5 h-5" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

const inp = 'w-full px-3 py-2 rounded-xl border border-sky-200 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 bg-white'
function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink/70 mb-1 block">{label}</span>
      {children}
    </label>
  )
}
