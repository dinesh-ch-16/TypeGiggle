import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Target, Zap, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, token } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
          headers: { Authorization: token }
        });
        setData(res.data);
      } catch (err) {
        console.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, navigate]);

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--main-color)' }}></div>
      </div>
    );
  }

  const bestWpm = data.history.length > 0 ? Math.max(...data.history.map(h => h.wpm)) : 0;
  const avgWpm = data.history.length > 0 ? Math.round(data.history.reduce((acc, curr) => acc + curr.wpm, 0) / data.history.length) : 0;
  const avgAcc = data.history.length > 0 ? Math.round(data.history.reduce((acc, curr) => acc + curr.accuracy, 0) / data.history.length) : 0;

  const chartData = [...data.history].reverse().map((test, index) => ({
    name: `Test ${index + 1}`,
    wpm: test.wpm,
  }));

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-6 animate-fade-in relative">
      
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-[120px] opacity-10 pointer-events-none rounded-full" style={{ backgroundColor: 'var(--main-color)' }}></div>

      {/* Header Section (No boxes, just clean layout) */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-20 relative z-10 border-b border-white/5 pb-12">
        
        {/* Large Avatar */}
        <div 
          className="w-36 h-36 rounded-full flex items-center justify-center text-7xl font-extrabold shadow-2xl"
          style={{ background: `linear-gradient(135deg, var(--main-color), rgba(0,0,0,0.5))`, color: 'var(--bg-color)' }}
        >
          {data.username.charAt(0).toUpperCase()}
        </div>
        
        <div className="text-center md:text-left flex-grow mt-4">
          <h1 className="text-5xl font-extrabold mb-2 tracking-tight" style={{ color: 'var(--text-color)' }}>
            {data.username}
          </h1>
          <p className="text-xl font-medium mb-6" style={{ color: 'var(--sub-color)' }}>{data.email}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-semibold" style={{ color: 'var(--sub-color)' }}>
            <span className="flex items-center gap-2"><Activity size={16} /> {data.totalTests} Total Tests</span>
            <span className="flex items-center gap-2"><Award size={16} /> Member since 2026</span>
          </div>
        </div>
      </div>

      {/* Stats Section (Clean numbers, no cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 relative z-10">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color: 'var(--sub-color)' }}>
            <Zap size={16} /> Best WPM
          </p>
          <p className="text-6xl font-extrabold" style={{ color: 'var(--main-color)' }}>{bestWpm}</p>
        </div>
        
        <div>
          <p className="text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color: 'var(--sub-color)' }}>
            <Activity size={16} /> Avg WPM
          </p>
          <p className="text-6xl font-extrabold" style={{ color: 'var(--text-color)' }}>{avgWpm}</p>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color: 'var(--sub-color)' }}>
            <Target size={16} /> Accuracy
          </p>
          <p className="text-6xl font-extrabold" style={{ color: 'var(--text-color)' }}>{avgAcc}%</p>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color: 'var(--sub-color)' }}>
            <Award size={16} /> Tests
          </p>
          <p className="text-6xl font-extrabold" style={{ color: 'var(--text-color)' }}>{data.totalTests}</p>
        </div>
      </div>

      {/* Graph Section (Minimal border, no background color) */}
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3" style={{ color: 'var(--text-color)' }}>
          Recent Performance
          <span className="text-sm font-medium px-3 py-1 rounded-full border border-white/10" style={{ color: 'var(--sub-color)' }}>Last 20 Tests</span>
        </h2>

        {chartData.length > 0 ? (
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--sub-color)" tick={{ fill: 'var(--sub-color)', fontSize: 12 }} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                <YAxis stroke="var(--sub-color)" tick={{ fill: 'var(--sub-color)', fontSize: 12 }} tickLine={false} axisLine={false} domain={[0, 'dataMax + 20']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--main-color)', borderRadius: '12px', color: 'var(--text-color)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: 'var(--main-color)', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="wpm" 
                  stroke="var(--main-color)" 
                  strokeWidth={4} 
                  dot={false}
                  activeDot={{ r: 8, fill: 'var(--main-color)', stroke: 'var(--bg-color)', strokeWidth: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] border border-dashed border-white/10 rounded-2xl" style={{ color: 'var(--sub-color)' }}>
            <p className="text-xl font-medium">No tests taken yet.</p>
            <p className="text-sm mt-2">Go to the home page and start typing!</p>
          </div>
        )}
      </div>

    </div>
  );
}