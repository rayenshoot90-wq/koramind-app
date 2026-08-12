'use client';

import { useState, useEffect } from 'react';
import { Activity, Bot, RefreshCw, Trophy } from 'lucide-react';

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/matches');
      const data = await res.json();
      setMatches(data.response || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleAnalyze = async (match) => {
    setSelectedMatch(match);
    setAnalyzing(true);
    setAnalysis('');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeTeam: match.teams.home.name,
          awayTeam: match.teams.away.name,
          league: match.league.name,
        }),
      });
      const data = await res.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setAnalysis('عذراً، متعذر تحليل هذه المباراة حالياً.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-slate-800 pb-5 mb-8">
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-emerald-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            KoraMind AI
          </h1>
        </div>
        <button
          onClick={fetchMatches}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          تحديث
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Matches List */}
        <main className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Activity className="text-emerald-400 w-5 h-5" />
            المباريات المباشرة واليومية
          </h2>

          {loading ? (
            <div className="text-center py-12 text-slate-400">جاري تحميل المباريات...</div>
          ) : matches.length === 0 ? (
            <div className="text-center py-12 text-slate-400">لا توجد مباريات متاحة حالياً.</div>
          ) : (
            matches.map((item) => (
              <div
                key={item.fixture.id}
                className="bg-koraCard border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition shadow-lg"
              >
                <div className="text-xs text-slate-400 mb-3 flex justify-between items-center">
                  <span>{item.league.name}</span>
                  <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                    {item.fixture.status.short === '2H' || item.fixture.status.short === '1H'
                      ? `مباشر ${item.fixture.status.elapsed}'`
                      : item.fixture.status.short}
                  </span>
                </div>

                <div className="flex items-center justify-between my-2">
                  {/* Home Team */}
                  <div className="flex items-center gap-3 flex-1">
                    <img src={item.teams.home.logo} alt={item.teams.home.name} className="w-8 h-8 object-contain" />
                    <span className="font-medium text-sm sm:text-base">{item.teams.home.name}</span>
                  </div>

                  {/* Score */}
                  <div className="px-4 py-1 bg-slate-900 rounded-lg text-lg font-bold border border-slate-800">
                    {item.goals.home ?? 0} - {item.goals.away ?? 0}
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center justify-end gap-3 flex-1 dir-ltr">
                    <span className="font-medium text-sm sm:text-base text-right">{item.teams.away.name}</span>
                    <img src={item.teams.away.logo} alt={item.teams.away.name} className="w-8 h-8 object-contain" />
                  </div>
                </div>

                <button
                  onClick={() => handleAnalyze(item)}
                  className="w-full mt-4 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-sm py-2 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <Bot className="w-4 h-4" />
                  تحليل AI للمباراة
                </button>
              </div>
            ))
          )}
        </main>

        {/* AI Analysis Sidebar */}
        <aside className="bg-koraCard border border-slate-800 rounded-xl p-5 h-fit sticky top-6">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-emerald-400 border-b border-slate-800 pb-3">
            <Bot className="w-5 h-5" />
            تحليل الذكاء الاصطناعي
          </h3>

          {!selectedMatch ? (
            <p className="text-slate-400 text-sm text-center py-8">
              اختر أي مباراة للبدء في توليد التحليل الفني التكتيكي.
            </p>
          ) : (
            <div>
              <div className="text-sm font-semibold text-slate-200 mb-2">
                {selectedMatch.teams.home.name} vs {selectedMatch.teams.away.name}
              </div>

              {analyzing ? (
                <div className="flex items-center gap-2 text-slate-400 text-sm py-6">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  جاري تحليل أسلوب اللعب والبيانات...
                </div>
              ) : (
                <div className="text-sm leading-relaxed text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-800/80">
                  {analysis}
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}