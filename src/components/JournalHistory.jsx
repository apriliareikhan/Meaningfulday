import { useMemo } from 'react'
import { Heart } from 'lucide-react'

const MOOD_EMOJI = { great: '😄', good: '🙂', okay: '😐', low: '😔', tired: '😴' }

export default function JournalHistory({ data }) {
  const sorted = useMemo(() => {
    return Object.entries(data.entries)
      .filter(([, e]) => e?.gratitude?.some((g) => g && g.trim()))
      .sort(([a], [b]) => (a < b ? 1 : -1))
  }, [data.entries])

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 animate-fade-in">
      <h1 className="text-3xl font-serif-italic">Jurnal</h1>
      <p className="text-ink/60 mb-8">Setiap entri adalah kepingan dirimu. Sesekali kembalilah ke sini untuk mengingat.</p>

      {sorted.length === 0 && (
        <div className="text-center py-16 text-ink/50 italic">Belum ada entri. Mulai dari hari ini 🌷</div>
      )}

      <div className="space-y-4">
        {sorted.map(([date, entry]) => {
          const d = new Date(date)
          const formatted = d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
          return (
            <div key={date} className="p-5 rounded-2xl bg-white border border-ink/10 hover:border-rose-soft transition">
              <div className="flex items-baseline justify-between mb-3">
                <div>
                  <div className="text-xs text-ink/50 uppercase tracking-wide">{formatted}</div>
                </div>
                {entry.mood && <span className="text-2xl">{MOOD_EMOJI[entry.mood]}</span>}
              </div>
              <ul className="space-y-2">
                {entry.gratitude.map((g, i) => g && g.trim() ? (
                  <li key={i} className="flex gap-3">
                    <Heart className="w-4 h-4 text-rose-deep mt-1 shrink-0" />
                    <span className="leading-relaxed">{g}</span>
                  </li>
                ) : null)}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
