import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import SEO from './SEO';

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [filteredScores, setFilteredScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('15s');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/leaderboard`);
      setScores(res.data);
      setFilteredScores(res.data.filter(s => s.mode === '15s'));
    } catch (err) {
      console.error("Failed to fetch leaderboard");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    setFilteredScores(scores.filter(s => s.mode === filter));
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 md:py-8 px-4 animate-fade-in flex flex-col lg:flex-row gap-6 md:gap-8">
      <SEO 
        title="Global Leaderboard" 
        description="See the fastest typists in the world. Check your rank and see top WPM scores on TypeGiggle." 
      />
      
      {/* Sidebar Filters */}
      <div className="w-full lg:w-64 flex-shrink-0">
        <div className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
          <div className="hidden lg:block mb-2 text-xs font-bold uppercase tracking-wider px-4" style={{ color: 'var(--sub-color)' }}>time</div>
          {['15s', '30s', '60s'].map(t => (
            <button 
              key={t}
              onClick={() => handleFilter(t)}
              className={`flex-shrink-0 flex items-center justify-center lg:justify-start gap-2 md:gap-3 px-4 md:px-6 lg:px-4 py-2 md:py-3 rounded-xl font-bold text-xs md:text-sm transition-colors ${activeFilter === t ? 'bg-[var(--main-color)] text-[var(--bg-color)]' : 'hover:bg-white/5'}`}
              style={{ color: activeFilter === t ? 'var(--bg-color)' : 'var(--sub-color)', backgroundColor: activeFilter === t ? 'var(--main-color)' : 'rgba(0,0,0,0.2)' }}
            >
              <span className="text-base md:text-lg">⏱</span> time {t.replace('s', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Area */}
      <div className="flex-grow w-full min-w-0">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-6 md:mb-8" style={{ color: 'var(--text-color)' }}>
          All-time Time {activeFilter.replace('s', '')} Leaderboard
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: 'var(--main-color)' }}></div>
          </div>
        ) : filteredScores.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-white/5" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
            <p className="text-lg" style={{ color: 'var(--sub-color)' }}>No scores yet for {activeFilter}. Be the first!</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar rounded-2xl border border-white/5 shadow-xl" style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}>
            <table className="w-full text-left border-collapse min-w-[500px] md:min-w-[600px]">
              <thead>
                <tr className="text-[10px] md:text-xs uppercase tracking-wider border-b border-white/5" style={{ color: 'var(--sub-color)' }}>
                  <th className="p-3 md:p-4 font-semibold w-12 md:w-16">#</th>
                  <th className="p-3 md:p-4 font-semibold">name</th>
                  <th className="p-3 md:p-4 font-semibold text-right">wpm</th>
                  <th className="p-3 md:p-4 font-semibold text-right">acc</th>
                  <th className="p-3 md:p-4 font-semibold text-right hidden md:table-cell">raw</th>
                  <th className="p-3 md:p-4 font-semibold text-right hidden md:table-cell">consistency</th>
                  <th className="p-3 md:p-4 font-semibold text-right hidden lg:table-cell">date</th>
                </tr>
              </thead>
              <tbody>
                {filteredScores.map((score, index) => {
                  const isCurrentUser = user && user.username === score.username;
                  
                  return (
                    <tr 
                      key={index} 
                      className={`border-b border-white/5 transition-colors ${isCurrentUser ? 'bg-[var(--main-color)]/10' : 'hover:bg-white/5'}`}
                    >
                      <td className="p-3 md:p-4 font-bold text-sm md:text-lg" style={{ color: index === 0 ? '#fbbf24' : index === 1 ? '#94a3b8' : index === 2 ? '#b45309' : 'var(--sub-color)' }}>
                        {index === 0 ? '👑' : index + 1}
                      </td>
                      <td className="p-3 md:p-4 font-bold flex items-center gap-2 text-sm md:text-base" style={{ color: isCurrentUser ? 'var(--main-color)' : 'var(--text-color)' }}>
                        {score.username}
                        {isCurrentUser && <span className="text-[9px] md:text-[10px] px-1.5 md:px-2 py-0.5 rounded bg-[var(--main-color)] text-[var(--bg-color)] uppercase tracking-wider hidden sm:inline-block">You</span>}
                      </td>
                      <td className="p-3 md:p-4 font-extrabold text-base md:text-xl text-right" style={{ color: 'var(--main-color)' }}>{Math.round(score.wpm)}</td>
                      <td className="p-3 md:p-4 font-medium text-sm md:text-base text-right" style={{ color: 'var(--text-color)' }}>{Math.round(score.accuracy)}%</td>
                      <td className="p-3 md:p-4 font-medium text-sm md:text-base text-right hidden md:table-cell" style={{ color: 'var(--text-color)' }}>{Math.round(score.rawWpm)}</td>
                      <td className="p-3 md:p-4 font-medium text-sm md:text-base text-right hidden md:table-cell" style={{ color: 'var(--text-color)' }}>{Math.round(score.consistency)}%</td>
                      <td className="p-3 md:p-4 text-xs md:text-sm text-right whitespace-nowrap hidden lg:table-cell" style={{ color: 'var(--sub-color)' }}>
                        {new Date(score.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}