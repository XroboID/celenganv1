import { useEffect, useState } from 'react'

export default function Home() {
  const [total, setTotal] = useState(0)
  const [nominal, setNominal] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/uang')
      .then(r => r.json())
      .then(data => setTotal(data.total || 0))
      .catch(() => setMsg('Gagal memuat total'))
  }, [])

  async function addNominal(e) {
    e.preventDefault()
    const value = parseInt(nominal.replace(/[^0-9]/g, ''), 10)
    if (!value || value <= 0) {
      setMsg('Masukkan nominal valid (lebih dari 0)')
      return
    }
    setLoading(true)
    setMsg('')
    try {
      const res = await fetch('/api/uang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ add: value })
      })
      const json = await res.json()
      if (res.ok) {
        setTotal(json.total)
        setNominal('')
        setMsg('Berhasil menambahkan!')
      } else {
        setMsg(json.error || 'Terjadi kesalahan')
      }
    } catch (err) {
      setMsg('Kesalahan jaringan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-2">Celengan Digital</h1>
        <p className="text-sm text-gray-500 mb-4">Simpan nominal, deploy ke Vercel.</p>

        <div className="bg-slate-50 rounded-lg p-4 mb-4">
          <div className="text-xs text-gray-500">Total Terkumpul</div>
          <div className="text-3xl font-bold">Rp {total.toLocaleString('id-ID')}</div>
        </div>

        <form onSubmit={addNominal} className="flex gap-2">
          <input
            value={nominal}
            onChange={e => setNominal(e.target.value)}
            placeholder="Masukkan nominal (contoh: 5000)"
            className="flex-1 p-3 rounded-lg border"
            inputMode="numeric"
          />
          <button className="px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold" disabled={loading}>
            {loading ? 'Memproses...' : 'Tambah'}
          </button>
        </form>

        {msg && <div className="mt-3 text-sm text-center text-gray-700">{msg}</div>}
      </div>
    </main>
  )
}