'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [news, setNews] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, FRIENDLY, OFFICIAL
  const [searchQuery, setSearchQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    fetch('/api/matches').then(res => res.json()).then(data => setMatches(data.matches || []));
    fetch('/api/news').then(res => res.json()).then(data => setNews(data.news || []));
  }, []);

  const handleAiSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoadingAi(true);
    setAiAnswer('');

    try {
      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      setAiAnswer(data.result);
    } catch (err) {
      setAiAnswer("عذراً، حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.");
    } finally {
      setLoadingAi(false);
    }
  };

  const filteredMatches = matches.filter(m => {
    if (filter === 'FRIENDLY') return m.type === 'FRIENDLY';
    if (filter === 'OFFICIAL') return m.type === 'OFFICIAL';
    return true;
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white dir-rtl p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center pb-6 border-b border-slate-800 gap-4">
        <h1 className="text-3xl font-extrabold text-emerald-400">⚽ KoraMind AI</h1>
        <p className="text-slate-400 text-sm">منصتك الذكية للمباريات المباشرة والتحليل الرياضي</p>
      </header>

      {/* AI Search Bar Section */}
      <section className="my-8 bg-slate-900/80 p-6 rounded-2xl border border-emerald-500/30 shadow-lg shadow-emerald-500/5">
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-emerald-300">
          🤖 البحث والتحليل بالذكاء الاصطناعي
        </h2>
        <form onSubmit={handleAiSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="اسأل الـ AI (مثال: تحليلات المباريات الودية، توقعات الكلاسيكو...)"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm"
          />
          <button
            type="submit"
            disabled={loadingAi}
            className="bg-emerald-500 hover:bg-emerald-600 font-bold px-6 py-3 rounded-xl transition text-sm text-slate-950 disabled:opacity-50"
          >
            {loadingAi ? 'جاري التحليل...' : 'بحث AI'}
          </button>
        </form>

        {aiAnswer && (
          <div className="mt-4 p-4 bg-slate-800/90 rounded-xl border-right-4 border-emerald-400 text-slate-200 text-sm leading-relaxed">
            <strong className="text-emerald-400 block mb-1">نتيجة التحليل الذكي:</strong>
            {aiAnswer}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Matches Section */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">المباريات</h2>
            <div className="flex gap-2 bg-slate-900 p-1 rounded-xl text-xs">
              <button 
                onClick={() => setFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg ${filter === 'ALL' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
              >
                الكل
              </button>
              <button 
                onClick={() => setFilter('FRIENDLY')}
                className={`px-3 py-1.5 rounded-lg ${filter === 'FRIENDLY' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
              >
                ودية 🤝
              </button>
              <button 
                onClick={() => setFilter('OFFICIAL')}
                className={`px-3 py-1.5 rounded-lg ${filter === 'OFFICIAL' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
              >
                رسمية 🏆
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredMatches.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">لا توجد مباريات حالياً في هذا القسم.</p>
            ) : (
              filteredMatches.map(m => (
                <div key={m.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex-1 text-center font-bold">{m.homeTeam}</div>
                  <div className="px-4 text-center">
                    <span className="text-xs text-emerald-400 font-semibold block mb-1">{m.league}</span>
                    <div className="text-lg font-black bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                      {m.status === 'UPCOMING' ? m.time : `${m.homeScore} - ${m.awayScore}`}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {m.status === 'LIVE' ? `مباشر ${m.minute}` : m.status === 'FINISHED' ? 'انتهت' : 'قريباً'}
                    </span>
                  </div>
                  <div className="flex-1 text-center font-bold">{m.awayTeam}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* News Section */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-white">📰 أحدث الأخبار</h2>
          <div className="space-y-3">
            {news.map(n => (
              <div key={n.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div className="flex items-center justify-between text-xs text-emerald-400 mb-2">
                  <span>{n.category}</span>
                  <span className="text-slate-500">{n.date}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-200 leading-snug">{n.image} {n.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}