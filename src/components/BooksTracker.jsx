import { useMemo, useState } from 'react'
import { BookOpen, Plus, Star, Trash2, Pencil, X, Heart } from 'lucide-react'

const CATEGORIES = ['Self Improvement', 'Novel', 'Religi', 'Biografi', 'Sains', 'Lainnya']
const STATUS = [
  { id: 'beli', label: 'Beli sendiri', emoji: '🛍️' },
  { id: 'pinjam', label: 'Pinjam', emoji: '🤝' },
  { id: 'hadiah', label: 'Hadiah', emoji: '🎁' },
  { id: 'ebook', label: 'E-book', emoji: '📱' },
]

const blank = () => ({
  id: crypto.randomUUID(),
  title: '',
  author: '',
  category: 'Self Improvement',
  status: 'beli',
  borrowedFrom: '',
  duration: '',
  rating: 4,
  insight: '',
  finishedAt: new Date().toISOString().slice(0, 10),
})

export default function BooksTracker({ data, setData }) {
  const [editing, setEditing] = useState(null)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')

  const books = data.books || []
  const filtered = useMemo(() => {
    return books
      .filter((b) => (filter === 'all' ? true : b.category === filter))
      .filter((b) =>
        query.trim()
          ? (b.title + b.author + b.insight).toLowerCase().includes(query.toLowerCase())
          : true,
      )
      .sort((a, b) => (a.finishedAt < b.finishedAt ? 1 : -1))
  }, [books, filter, query])

  function save(book) {
    const exists = books.find((b) => b.id === book.id)
    const next = exists
      ? books.map((b) => (b.id === book.id ? book : b))
      : [book, ...books]
    setData({ ...data, books: next })
    setEditing(null)
  }
  function remove(id) {
    if (!confirm('Hapus buku ini?')) return
    setData({ ...data, books: books.filter((b) => b.id !== id) })
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <BookOpen className="w-7 h-7 text-sky-600" />
        <h1 className="text-3xl font-serif-italic">Buku-buku yang sudah kubaca</h1>
      </div>
      <p className="text-ink/60 mb-6">Setiap buku meninggalkan jejak. Catat insight-mu di sini.</p>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button
          onClick={() => setEditing(blank())}
          className="px-4 py-2 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Tambah buku
        </button>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari judul / penulis / insight..."
          className="flex-1 min-w-[200px] px-4 py-2 rounded-xl border border-sky-200 glass focus:outline-none focus:border-sky-400"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-sky-200 glass"
        >
          <option value="all">Semua kategori</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 glass rounded-3xl border border-white/60">
          <div className="text-5xl mb-3">📖</div>
          <p className="text-ink/60">Belum ada buku. Tambahkan buku pertamamu yuk!</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((b) => (
          <BookCard key={b.id} book={b} onEdit={() => setEditing(b)} onDelete={() => remove(b.id)} />
        ))}
      </div>

      {editing && (
        <BookEditor book={editing} onSave={save} onClose={() => setEditing(null)} />
      )}
    </div>
  )
}

function BookCard({ book, onEdit, onDelete }) {
  const status = STATUS.find((s) => s.id === book.status)
  return (
    <div className="p-5 rounded-2xl glass-strong border border-white/70 shadow-sm hover:shadow-md transition group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-sky-600 font-semibold">{book.category}</p>
          <h3 className="font-semibold text-lg leading-tight mt-1">{book.title}</h3>
          <p className="text-sm text-ink/60">{book.author || '—'}</p>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-sky-100"><Pencil className="w-4 h-4" /></button>
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-rose-soft text-rose-deep"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex items-center gap-1 mt-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} className={`w-4 h-4 ${n <= book.rating ? 'fill-lemon-deep text-lemon-deep' : 'text-ink/20'}`} />
        ))}
      </div>

      {book.insight && (
        <p className="mt-3 text-sm text-ink/80 italic line-clamp-4 leading-relaxed">"{book.insight}"</p>
      )}

      <div className="flex flex-wrap gap-2 mt-3 text-xs">
        <span className="px-2 py-1 rounded-full bg-sky-100 text-sky-700">
          {status?.emoji} {status?.label}{book.status === 'pinjam' && book.borrowedFrom ? ` · ${book.borrowedFrom}` : ''}
        </span>
        {book.duration && (
          <span className="px-2 py-1 rounded-full bg-mint-soft text-mint-deep">⏱ {book.duration}</span>
        )}
      </div>
    </div>
  )
}

function BookEditor({ book, onSave, onClose }) {
  const [b, setB] = useState(book)
  const set = (k, v) => setB({ ...b, [k]: v })

  function submit() {
    if (!b.title.trim()) return alert('Judul wajib diisi')
    onSave({ ...b, title: b.title.trim() })
  }

  return (
    <div className="fixed inset-0 z-50 bg-sky-700/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div
        className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-serif-italic">{book.title ? 'Edit buku' : 'Buku baru'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-ink/5"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-3">
          <Field label="Judul">
            <input value={b.title} onChange={(e) => set('title', e.target.value)} className={inp} placeholder="Filosofi Teras..." />
          </Field>
          <Field label="Penulis">
            <input value={b.author} onChange={(e) => set('author', e.target.value)} className={inp} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Kategori">
              <select value={b.category} onChange={(e) => set('category', e.target.value)} className={inp}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select value={b.status} onChange={(e) => set('status', e.target.value)} className={inp}>
                {STATUS.map((s) => <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>)}
              </select>
            </Field>
          </div>
          {b.status === 'pinjam' && (
            <Field label="Pinjam dari siapa">
              <input value={b.borrowedFrom} onChange={(e) => set('borrowedFrom', e.target.value)} className={inp} placeholder="Nama teman / perpustakaan" />
            </Field>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Lama membaca">
              <input value={b.duration} onChange={(e) => set('duration', e.target.value)} className={inp} placeholder="2 minggu" />
            </Field>
            <Field label="Tanggal selesai">
              <input type="date" value={b.finishedAt} onChange={(e) => set('finishedAt', e.target.value)} className={inp} />
            </Field>
          </div>

          <Field label={`Seberapa suka? (${b.rating}/5)`}>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => set('rating', n)}
                  className="p-1"
                  aria-label={`Rating ${n}`}
                >
                  <Star className={`w-7 h-7 ${n <= b.rating ? 'fill-lemon-deep text-lemon-deep' : 'text-ink/20'}`} />
                </button>
              ))}
            </div>
          </Field>

          <Field label="Insight yang kamu dapat">
            <textarea
              value={b.insight}
              onChange={(e) => set('insight', e.target.value)}
              rows={5}
              className={inp + ' resize-none'}
              placeholder="Apa pelajaran terbesar yang kamu bawa pulang dari buku ini?"
            />
          </Field>
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-ink/10 hover:bg-ink/5">Batal</button>
          <button onClick={submit} className="flex-1 py-3 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 flex items-center justify-center gap-2">
            <Heart className="w-4 h-4" /> Simpan
          </button>
        </div>
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
