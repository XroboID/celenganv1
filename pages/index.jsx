import { useEffect, useState } from 'react';

// Simple SVG icon components for better readability
const PiggyBankIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2 text-indigo-500">
    <path d="M10 20.5c0 .8.7 1.5 1.5 1.5.8 0 1.5-.7 1.5-1.5v-2.5h-3v2.5zM12 18V6.2c0-1.1-.9-2-2-2h-.5c-.3 0-.5-.2-.5-.5s.2-.5.5-.5h7c.3 0 .5.2.5.5s-.2.5-.5.5h-.5c-1.1 0-2 .9-2 2V18" />
    <path d="M7.5 18h9c1.4 0 2.5-1.1 2.5-2.5V9.4C19 8.1 18.1 7 16.9 7h-9.8c-1.2 0-2.1 1.1-2.1 2.4V15.5C5 16.9 6.1 18 7.5 18z" />
    <path d="M14.2 12.2c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4z" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);


export default function Home() {
  const [total, setTotal] = useState(0);
  const [nominal, setNominal] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/uang')
      .then(r => r.json())
      .then(data => setTotal(data.total || 0))
      .catch(() => setMsg('Gagal memuat total simpanan'));
  }, []);

  async function addNominal(e) {
    e.preventDefault();
    const value = parseInt(nominal.replace(/[^0-9]/g, ''), 10);
    if (!value || value <= 0) {
      setMsg('Masukkan nominal yang valid (lebih dari 0)');
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch('/api/uang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ add: value })
      });
      const json = await res.json();
      if (res.ok) {
        setTotal(json.total);
        setNominal('');
        setMsg('Nominal berhasil ditambahkan!');
      } else {
        setMsg(json.error || 'Terjadi kesalahan pada server');
      }
    } catch (err) {
      setMsg('Tidak dapat terhubung ke server. Periksa koneksi Anda.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/80 p-6 md:p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
            <PiggyBankIcon />
            Celengan Digital
          </h1>
          <p className="text-sm text-gray-500 mt-1">Lacak tabunganmu dengan mudah.</p>
        </div>

        <div className="bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-xl p-6 mb-6 text-white shadow-indigo-200/50 shadow-lg">
          <div className="text-sm font-light uppercase tracking-wider opacity-80">Total Terkumpul</div>
          <div className="text-4xl md:text-5xl font-bold mt-1">
            <span className="opacity-80">Rp</span> {total.toLocaleString('id-ID')}
          </div>
        </div>

        <form onSubmit={addNominal}>
          <div className="relative flex items-center mb-3">
            <span className="absolute left-4 font-bold text-gray-400">Rp</span>
            <input
              value={nominal}
              onChange={e => setNominal(e.target.value)}
              placeholder="50.000"
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-shadow duration-200"
              inputMode="numeric"
            />
          </div>
          <button 
            className="w-full flex items-center justify-center px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed" 
            disabled={loading}
          >
            {loading ? (
              <>
                <SpinnerIcon />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <PlusIcon />
                <span>Tambah</span>
              </>
            )}
          </button>
        </form>

        {msg && <div className="mt-4 text-sm text-center font-medium text-gray-700">{msg}</div>}
      </div>
    </main>
  );
  }
