import { useMemo } from 'react'
import { calcGratitudeStreak, totalGratitudeDays, todayKey, habitCompletionLast30 } from '../lib/storage'
import { Flame, Heart, Calendar, Award } from 'lucide-react'

export default function Stats({ data }) {
  const streak = calcGratitudeStreak(data.entries)
  const totalDays = totalGratitudeDays(data.entries)

  // Build last 70 days heatmap of gratitude entries
  const heatmap = useMemo(() => {
    const arr = []
    const d = new Date()
    for (let i = 69; i >= 0; i--) {
      const day = new Date(d)
      day.setDate(d.getDate() - i)
      const key = todayKey(day)
      const e = data.entries[key]
      const filled = e?.gratitude?.filter((g) => g && g.trim()).length || 0
      arr.push({ key, day, filled })
    }
    return arr
  }, [data.entries])

  // Compute longest streak ever
  const longest = useMemo(() => {
    const keys = Object.keys(data.entries).sort()
    let best = 0, cur = 0, prev = null
    for (const k of keys) {
      const e = data.entries[k]
      const has = e?.gratitude?.some((g) => g && g.trim())
      if (!has) { cur = 0; prev = null; continue }
      if (prev) {
        const p = new Date(prev), c = new Date(k)
        const diff = Math.round((c - p) / 86400000)
        cur = diff === 1 ? cur + 1 : 1
      } else cur = 1
      if (cur > best) best = cur
      prev = k
    }
    return best
  }, [data.entries])

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 animate-fade-in">
      <h1 className="text-3xl font-serif-italic mb-2">Statistik</h1>
      <p className="text-ink/60 mb-8">Lihat seberapa jauh kamu sudah melangkah.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <StatCard icon={<Flame className="w-5 h-5" />} value={streak} label="Hari beruntun" color="bg-gold/20 text-gold" />
        <StatCard icon={<Award className="w-5 h-5" />} value={longest} label="Rekor terpanjang" color="bg-rose-soft/60 text-rose-deep" />
        <StatCard icon={<Heart className="w-5 h-5" />} value={totalDays} label="Total hari" color="bg-rose-soft/60 text-rose-deep" />
        <StatCard icon={<Calendar className="w-5 h-5" />} value={Object.keys(data.entries).length} label="Hari aktif" color="bg-sage-soft text-sage-deep" />
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">10 minggu terakhir</h2>
        <div className="p-5 rounded-2xl bg-white border border-ink/10">
          <div className="grid grid-cols-10 gap-1.5">
            {heatmap.map((c, i) => (
              <div
                key={i}
                title={`${c.key} • ${c.filled} hal`}
                className={`aspect-square rounded ${
                  c.filled === 0 ? 'bg-ink/5' :
                  c.filled === 1 ? 'bg-rose-soft/60' :
                  c.filled === 2 ? 'bg-rose-soft' :
                  'bg-rose-deep'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-ink/50">
            <span>Sedikit</span>
            <div className="w-3 h-3 bg-ink/5 rounded" />
            <div className="w-3 h-3 bg-rose-soft/60 rounded" />
            <div className="w-3 h-3 bg-rose-soft rounded" />
            <div className="w-3 h-3 bg-rose-deep rounded" />
            <span>Banyak</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Konsistensi kebiasaan (30 hari)</h2>
        <div className="space-y-3">
          {data.habits.map((h) => {
            const done = habitCompletionLast30(data.entries, h.id)
            const pct = Math.round((done / 30) * 100)
            return (
              <div key={h.id} className="p-4 rounded-xl bg-white border border-ink/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{h.emoji}</span>
                  <span className="font-medium flex-1">{h.name}</span>
                  <span className="text-sm text-ink/60">{done}/30</span>
                </div>
                <div className="h-2 bg-ink/5 rounded-full overflow-hidden">
                  <div className="h-full bg-sage-deep rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
          {data.habits.length === 0 && <p className="text-ink/50 italic text-sm">Belum ada habit.</p>}
        </div>
      </section>
    </div>
  )
}

function StatCard({ icon, value, label, color }) {
  return (
    <div className="p-4 rounded-2xl bg-white border border-ink/10">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color} mb-2`}>{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-ink/60">{label}</div>
    </div>
  )
}
