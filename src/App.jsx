import { useEffect, useState } from 'react'
import {
  Home, ListChecks, BookOpen, BarChart3, Settings as SettingsIcon,
  Library, Lightbulb, Sparkles, Sparkle, Menu, X, Cloud,
} from 'lucide-react'
import { loadData, saveData } from './lib/storage'
import Dashboard from './components/Dashboard'
import HabitsManager from './components/HabitsManager'
import JournalHistory from './components/JournalHistory'
import Stats from './components/Stats'
import Settings from './components/Settings'
import BooksTracker from './components/BooksTracker'
import IdeasBoard from './components/IdeasBoard'
import Motivation from './components/Motivation'
import NewThings from './components/NewThings'

const NAV_GROUPS = [
  {
    label: 'Meaningful Days',
    items: [
      { id: 'home', label: 'Hari Ini', icon: Home },
      { id: 'habits', label: 'Kebiasaan', icon: ListChecks },
      { id: 'journal', label: 'Jurnal', icon: BookOpen },
      { id: 'stats', label: 'Statistik', icon: BarChart3 },
    ],
  },
  {
    label: 'Ruang Diri',
    items: [
      { id: 'books', label: 'Buku', icon: Library },
      { id: 'ideas', label: 'Ide-ide', icon: Lightbulb },
      { id: 'motivation', label: 'Motivasi', icon: Sparkles },
      { id: 'newthings', label: 'Hal Baru & New Me', icon: Sparkle },
    ],
  },
  {
    label: 'Lainnya',
    items: [{ id: 'settings', label: 'Pengaturan', icon: SettingsIcon }],
  },
]

const ALL_TABS = NAV_GROUPS.flatMap((g) => g.items)

export default function App() {
  const [data, setDataState] = useState(() => loadData())
  const [tab, setTab] = useState('home')
  const [welcomeOpen, setWelcomeOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    if (!data.user.name) setWelcomeOpen(true)
  }, [])

  function setData(next) {
    setDataState(next)
    saveData(next)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      <CloudLayer />

      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col p-6 glass-strong border-r border-white/60 sticky top-0 h-screen z-10">
        <Logo />
        <nav className="space-y-5 flex-1 overflow-y-auto -mx-2 px-2 mt-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] uppercase tracking-widest text-sky-700/60 font-semibold mb-2 px-3">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((t) => (
                  <NavBtn key={t.id} item={t} active={tab === t.id} onClick={() => setTab(t.id)} />
                ))}
              </div>
            </div>
          ))}
        </nav>
        <p className="text-[11px] text-ink/40 leading-relaxed mt-4">
          Dibuat dengan ☁️<br />Data kamu aman di perangkat ini.
        </p>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between px-5 py-3 glass-strong border-b border-white/60 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Cloud className="w-5 h-5 text-sky-500" />
          <h1 className="text-lg font-serif-italic">Ruang Langit</h1>
        </div>
        <button onClick={() => setMobileNavOpen(true)} className="p-2 rounded-lg hover:bg-sky-100">
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 animate-fade-in" onClick={() => setMobileNavOpen(false)}>
          <div className="absolute inset-0 bg-sky-700/30 backdrop-blur-sm" />
          <aside
            className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] glass-strong p-6 overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <Logo />
              <button onClick={() => setMobileNavOpen(false)} className="p-2 rounded-lg hover:bg-sky-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="space-y-5">
              {NAV_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="text-[10px] uppercase tracking-widest text-sky-700/60 font-semibold mb-2 px-3">
                    {group.label}
                  </p>
                  <div className="space-y-1">
                    {group.items.map((t) => (
                      <NavBtn key={t.id} item={t} active={tab === t.id} onClick={() => { setTab(t.id); setMobileNavOpen(false) }} />
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <main className="flex-1 pb-24 md:pb-6 relative z-10">
        {tab === 'home' && <Dashboard data={data} setData={setData} />}
        {tab === 'habits' && <HabitsManager data={data} setData={setData} />}
        {tab === 'journal' && <JournalHistory data={data} />}
        {tab === 'stats' && <Stats data={data} />}
        {tab === 'books' && <BooksTracker data={data} setData={setData} />}
        {tab === 'ideas' && <IdeasBoard data={data} setData={setData} />}
        {tab === 'motivation' && <Motivation data={data} setData={setData} />}
        {tab === 'newthings' && <NewThings data={data} setData={setData} />}
        {tab === 'settings' && <Settings data={data} setData={setData} />}
      </main>

      {/* Mobile bottom nav (quick access to top 5) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 glass-strong border-t border-white/60 px-2 py-2 flex justify-around z-30">
        {[ALL_TABS[0], ALL_TABS[4], ALL_TABS[5], ALL_TABS[6], ALL_TABS[7]].map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-lg text-[10px] font-medium ${
                tab === t.id ? 'text-sky-600' : 'text-ink/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              {t.label}
            </button>
          )
        })}
      </nav>

      {welcomeOpen && (
        <Welcome
          onDone={(name) => {
            setData({ ...data, user: { ...data.user, name } })
            setWelcomeOpen(false)
          }}
        />
      )}
    </div>
  )
}

function Logo() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Cloud className="w-7 h-7 text-sky-500" />
        <h1 className="text-2xl font-serif-italic leading-tight">Ruang Langit</h1>
      </div>
      <p className="text-xs text-ink/50 mt-1 ml-9">tempat kecil untuk dirimu</p>
    </div>
  )
}

function NavBtn({ item, active, onClick }) {
  const Icon = item.icon
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
        active
          ? 'bg-sky-500 text-white shadow-sm shadow-sky-300/50'
          : 'text-ink/70 hover:bg-sky-100/60'
      }`}
    >
      <Icon className="w-4 h-4" />
      {item.label}
    </button>
  )
}

function CloudLayer() {
  // Five floating clouds at different y/sizes/speeds
  const clouds = [
    { top: '8%', size: 70, speed: 'animate-float-slow', delay: '0s', opacity: 0.85 },
    { top: '22%', size: 50, speed: 'animate-float-mid', delay: '-12s', opacity: 0.7 },
    { top: '45%', size: 90, speed: 'animate-float-slow', delay: '-30s', opacity: 0.6 },
    { top: '68%', size: 60, speed: 'animate-float-fast', delay: '-8s', opacity: 0.75 },
    { top: '85%', size: 80, speed: 'animate-float-mid', delay: '-22s', opacity: 0.55 },
  ]
  return (
    <div className="cloud-layer">
      {clouds.map((c, i) => (
        <div
          key={i}
          className={c.speed}
          style={{ position: 'absolute', top: c.top, animationDelay: c.delay }}
        >
          <div
            className="cloud"
            style={{ width: `${c.size}px`, height: `${c.size * 0.45}px`, opacity: c.opacity }}
          />
        </div>
      ))}
    </div>
  )
}

function Welcome({ onDone }) {
  const [name, setName] = useState('')
  return (
    <div className="fixed inset-0 z-50 bg-sky-700/40 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 max-w-md shadow-2xl animate-slide-up">
        <div className="text-5xl mb-3 animate-bob">☁️</div>
        <h2 className="text-2xl font-serif-italic mb-2">Selamat datang di Ruang Langit</h2>
        <p className="text-ink/70 leading-relaxed mb-5">
          Sebuah ruang lapang seluas langit — untuk merawat dirimu, mencatat buku, menampung ide,
          dan bertumbuh perlahan.
        </p>
        <p className="text-sm text-ink/60 mb-2">Bagaimana ingin dipanggil?</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && name.trim() && onDone(name.trim())}
          placeholder="Namamu..."
          autoFocus
          className="w-full p-3 rounded-xl border border-sky-200 focus:border-sky-400 focus:outline-none mb-4"
        />
        <button
          onClick={() => onDone(name.trim() || 'sahabat')}
          className="w-full py-3 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600"
        >
          Mulai perjalanan ✨
        </button>
      </div>
    </div>
  )
}
