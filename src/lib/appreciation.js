// Appreciation engine — pesan hangat, milestones, prompts
import confetti from 'canvas-confetti'

const ROTATING_MESSAGES = [
  'Hari ini kamu sudah hadir untuk dirimu sendiri. Itu hal besar. 🌷',
  'Setiap kata syukur yang kamu tulis menanam benih kebahagiaan. 🌱',
  'Kamu lebih kuat dari yang kamu kira. Terima kasih sudah konsisten. ✨',
  'Diri kamu yang besok akan berterima kasih atas yang kamu lakukan hari ini. 💌',
  'Tidak harus sempurna — cukup hadir. Dan kamu sudah hadir hari ini. 🌸',
  'Pelan-pelan saja. Kamu sedang membangun hidup yang berarti. 🕊️',
  'Sekecil apapun langkahnya, itu tetap langkah maju. 👣',
  'Bersyukur bukan tentang banyaknya, tapi tentang kesadaran. Dan kamu sadar. 🌅',
  'Kamu pantas merasa bangga pada dirimu hari ini. 🤍',
  'Hidup bermakna dibangun dari hari-hari sederhana seperti ini. 📖',
]

const MILESTONE_MESSAGES = {
  1: { title: 'Hari pertama! 🎉', body: 'Awal yang berani. Banyak orang tidak pernah memulai — kamu sudah.' },
  3: { title: '3 hari berturut-turut! 🌱', body: 'Kebiasaan kecil mulai berakar. Terus rawat ya.' },
  7: { title: 'Satu minggu penuh! 🌻', body: 'Kamu baru saja membuktikan bahwa kamu bisa berkomitmen pada dirimu sendiri.' },
  14: { title: 'Dua minggu! 💫', body: 'Ini bukan kebetulan. Ini bukti bahwa kamu serius dengan hidupmu.' },
  21: { title: '21 hari! 🏆', body: 'Kata orang, butuh 21 hari untuk membentuk kebiasaan. Selamat — kamu sudah di sini.' },
  30: { title: 'Sebulan penuh! 🌙', body: 'Sebulan kamu memilih untuk hadir bagi dirimu. Itu pencapaian yang luar biasa.' },
  60: { title: '60 hari! 🔥', body: 'Konsistensimu inspiratif. Kamu sedang menulis cerita hidup yang indah.' },
  100: { title: '100 HARI! 👑', body: 'Tiga digit. Kamu adalah bukti hidup bahwa kebiasaan kecil membentuk hidup yang besar.' },
  365: { title: 'SATU TAHUN! 🎆', body: 'Kamu sudah mengubah hidupmu, satu hari pada satu waktu. Ini sangat luar biasa.' },
}

// Prompt-prompt untuk inspirasi gratitude
export const GRATITUDE_PROMPTS = [
  'Apa yang membuatmu tersenyum hari ini?',
  'Siapa yang patut kamu syukuri kehadirannya?',
  'Hal kecil apa yang biasanya kamu anggap remeh, tapi sebenarnya berharga?',
  'Apa kemajuan kecil yang kamu buat hari ini?',
  'Apa yang ingin kamu ucapkan terima kasih pada tubuhmu?',
  'Momen tenang apa yang kamu nikmati hari ini?',
  'Apa yang baru kamu pelajari?',
  'Apa yang membuatmu merasa hidup hari ini?',
]

export function getDailyMessage(seed = new Date().toDateString()) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return ROTATING_MESSAGES[h % ROTATING_MESSAGES.length]
}

export function getDailyPrompt(seed = new Date().toDateString()) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 17 + seed.charCodeAt(i)) >>> 0
  return GRATITUDE_PROMPTS[h % GRATITUDE_PROMPTS.length]
}

export function getMilestoneFor(streak) {
  return MILESTONE_MESSAGES[streak] || null
}

export function fireConfetti(intensity = 'normal') {
  const counts = { soft: 50, normal: 120, big: 220 }
  const count = counts[intensity] || 120
  const defaults = { origin: { y: 0.7 }, colors: ['#C97B7B', '#D4A574', '#7A9B72', '#F5D4D4', '#D8E4D5'] }
  function shoot(ratio, opts) {
    confetti({ ...defaults, ...opts, particleCount: Math.floor(count * ratio) })
  }
  shoot(0.25, { spread: 26, startVelocity: 55 })
  shoot(0.2, { spread: 60 })
  shoot(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
  shoot(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
  shoot(0.1, { spread: 120, startVelocity: 45 })
}

export function appreciationFor({ name, streak, totalDays }) {
  const n = name?.trim() || 'kamu'
  const lines = [
    `Terima kasih ${n}, sudah meluangkan waktu untuk dirimu hari ini. 🤍`,
    `${capitalize(n)}, ini hari ke-${totalDays} kamu menulis. Itu bukan angka biasa.`,
    `Aku bangga padamu, ${n}. Sungguh.`,
    `Hari ini, ${n} memilih kesadaran. Itu pilihan yang indah.`,
  ]
  if (streak >= 7) lines.push(`${capitalize(n)}, ${streak} hari berturut-turut. Kamu konsisten dan itu mengagumkan.`)
  let h = (Date.now() / 86400000) | 0
  return lines[h % lines.length]
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1) }
