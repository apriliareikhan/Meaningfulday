import { useState } from 'react'
import { Download, Upload, Trash2 } from 'lucide-react'

export default function Settings({ data, setData }) {
  const [name, setName] = useState(data.user.name || '')

  function saveName() {
    setData({ ...data, user: { ...data.user, name: name.trim() } })
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `meaningful-days-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function importJson(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result)
        if (!parsed.habits || !parsed.entries) throw new Error('Format tidak valid')
        if (!confirm('Ini akan mengganti semua data. Lanjut?')) return
        setData(parsed)
      } catch (err) {
        alert('File tidak valid: ' + err.message)
      }
    }
    reader.readAsText(file)
  }

  function resetAll() {
    if (!confirm('Yakin ingin menghapus SEMUA data? Tindakan ini tidak bisa dibatalkan.')) return
    if (!confirm('Sungguh yakin? Pikirkan sekali lagi.')) return
    localStorage.clear()
    location.reload()
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 animate-fade-in">
      <h1 className="text-3xl font-serif-italic mb-2">Pengaturan</h1>
      <p className="text-ink/60 mb-8">Atur preferensi & data kamu.</p>

      <section className="mb-8 p-5 rounded-2xl bg-white border border-ink/10">
        <h2 className="font-semibold mb-2">Namamu</h2>
        <p className="text-sm text-ink/60 mb-3">Aplikasi akan menggunakan namamu di pesan apresiasi.</p>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tulis namamu..."
            className="flex-1 p-3 rounded-xl border border-ink/10 focus:border-rose-deep focus:outline-none"
          />
          <button onClick={saveName} className="px-4 py-2 rounded-xl bg-rose-deep text-white font-semibold hover:bg-rose-deep/90">
            Simpan
          </button>
        </div>
      </section>

      <section className="mb-8 p-5 rounded-2xl bg-white border border-ink/10">
        <h2 className="font-semibold mb-3">Backup data</h2>
        <p className="text-sm text-ink/60 mb-4">Data kamu hanya disimpan di browser ini. Backup berkala disarankan.</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportJson} className="px-4 py-2 rounded-xl bg-sage-deep text-white font-semibold hover:bg-sage-deep/90 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export JSON
          </button>
          <label className="px-4 py-2 rounded-xl bg-ink/5 hover:bg-ink/10 font-semibold flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" /> Import JSON
            <input type="file" accept="application/json" onChange={importJson} className="hidden" />
          </label>
        </div>
      </section>

      <section className="p-5 rounded-2xl bg-rose-soft/30 border border-rose-soft">
        <h2 className="font-semibold mb-2 text-rose-deep">Zona berbahaya</h2>
        <button onClick={resetAll} className="px-4 py-2 rounded-xl bg-rose-deep text-white font-semibold hover:bg-rose-deep/90 flex items-center gap-2">
          <Trash2 className="w-4 h-4" /> Hapus semua data
        </button>
      </section>
    </div>
  )
}
