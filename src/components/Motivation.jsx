import { useEffect, useMemo, useState } from 'react'
import { Sparkles, RefreshCw, Heart } from 'lucide-react'
import { MOODS, QURAN_BY_MOOD, getQuoteForMood } from '../lib/quran'

const MOOD_BG = {
  lemon: 'from-lemon-soft to-white',
  mint: 'from-mint-soft to-white',
  sky: 'from-sky-100 to-white',
  lilac: 'from-lilac-soft to-white',
  rose: 'from-rose-soft to-white',
}

export default function Motivation({ data, setData }) {
  const [mood, setMood] = useState(null)
  const [seed, setSeed] = useState(Date.now())

  useEffect(() => {
    // Auto-pick from latest gratitude entry mood if available
    const todayMood = Object.values(data.entries || {}).slice(-1)[0]?.mood
    if (todayMood && MOODS.find((m) => m.id === todayMood)) setMood(todayMood)
  }, [])

  const moodObj = MOODS.find((m) => m.id === mood)
  const quote = useMemo(() => (mood ? getQuoteForMood(mood, seed) : null), [mood, seed])
  const quoteCount = mood ? QURAN_BY_MOOD[mood]?.length || 0 : 0

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <Sparkles className="w-7 h-7 text-lilac-deep" />
        <h1 className="text-3xl font-serif-italic">Motivasi untukmu</h1>
      </div>
      <p className="text-ink/60 mb-6">
        Pilih suasana hatimu, biar Al-Qur'an yang menemani hari ini.
      </p>

      <div className="mb-6">
        <p className="text-sm font-medium text-ink/70 mb-3">Bagaimana perasaanmu sekarang?</p>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m.id}
              onClick={() => { setMood(m.id); setSeed(Date.now()) }}
              className={`px-4 py-3 rounded-2xl border-2 transition-all ${
                mood === m.id
                  ? 'bg-white border-sky-400 scale-105 shadow-md'
                  : 'glass border-white/60 hover:border-sky-200'
              }`}
            >
              <span className="text-2xl mr-2">{m.emoji}</span>
              <span className="text-sm font-medium">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {!quote && (
        <div className="text-center py-16 glass rounded-3xl border border-white/60">
          <div className="text-5xl mb-3 animate-bob">🤲</div>
          <p className="text-ink/60">Pilih suasana hatimu untuk menerima ayat hari ini.</p>
        </div>
      )}

      {quote && moodObj && (
        <div
          className={`p-8 rounded-3xl bg-gradient-to-br ${MOOD_BG[moodObj.color] || 'from-sky-100 to-white'} border border-white/70 shadow-lg animate-slide-up`}
        >
          <p className="text-3xl md:text-4xl text-right leading-loose font-serif-italic text-ink mb-4" dir="rtl" lang="ar">
            {quote.arab}
          </p>
          <p className="text-sm text-ink/60 italic mb-3">{quote.latin}</p>
          <div className="h-px bg-ink/10 my-4" />
          <p className="text-lg leading-relaxed text-ink/90 mb-3">"{quote.terjemah}"</p>
          <p className="text-sm font-semibold text-sky-700">
            — QS. {quote.surah}: {quote.ayat}
          </p>
          <div className="mt-5 p-4 rounded-xl bg-white/70 border border-white/80">
            <p className="text-xs uppercase tracking-wider text-ink/50 mb-1 flex items-center gap-1">
              <Heart className="w-3 h-3 text-rose-deep" /> Refleksi
            </p>
            <p className="text-ink/80 leading-relaxed">{quote.refleksi}</p>
          </div>

          {quoteCount > 1 && (
            <button
              onClick={() => setSeed(seed + 1000)}
              className="mt-5 w-full py-3 rounded-xl bg-white/80 hover:bg-white border border-sky-200 font-medium flex items-center justify-center gap-2 text-sky-700"
            >
              <RefreshCw className="w-4 h-4" /> Ayat lain untuk {moodObj.label.toLowerCase()}
            </button>
          )}
        </div>
      )}

      <p className="text-xs text-ink/40 mt-6 text-center italic">
        Sumber: Al-Qur'an. Disusun untuk pengingat lembut bagi diri sendiri.
      </p>
    </div>
  )
}
