import { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../ThemeContext';
import { X, Search } from 'lucide-react';

const themes = [
  { id: 'ocean', bg: '#0f172a', text: '#f8fafc', main: '#38bdf8' },
  { id: 'dark', bg: '#0f172a', text: '#f8fafc', main: '#8b5cf6' },
  { id: 'cyber', bg: '#09090b', text: '#e4e4e7', main: '#22d3ee' },
  { id: 'vampire', bg: '#282a36', text: '#f8f8f2', main: '#bd93f9' },
  { id: 'forest', bg: '#282828', text: '#ebdbb2', main: '#d79921' },
  { id: 'tokyo', bg: '#1a1b26', text: '#c0caf5', main: '#7aa2f7' },
  { id: 'carbon', bg: '#161616', text: '#f4f4f4', main: '#f8f8f8' },
  { id: 'matrix', bg: '#000000', text: '#00ff00', main: '#00ff00' },
  { id: 'coffee', bg: '#2c1e16', text: '#f5ede6', main: '#c79c7e' },
  { id: 'mocha', bg: '#1e1e2e', text: '#cdd6f4', main: '#cba6f7' },
  { id: 'grape', bg: '#2e1065', text: '#ede9fe', main: '#a78bfa' },
  { id: 'mint', bg: '#064e3b', text: '#ecfdf5', main: '#34d399' },
  { id: 'ruby', bg: '#4c0519', text: '#fff1f2', main: '#fb7185' },
  { id: 'slate', bg: '#334155', text: '#f8fafc', main: '#94a3b8' },
  { id: 'emerald', bg: '#022c22', text: '#ecfdf5', main: '#10b981' },
  { id: 'volcano', bg: '#450a0a', text: '#fef2f2', main: '#ef4444' },
  { id: 'nebula', bg: '#1e1b4b', text: '#e0e7ff', main: '#818cf8' },
  { id: 'neon', bg: '#000000', text: '#ffffff', main: '#ff00ff' },
  { id: 'terminal', bg: '#000000', text: '#22c55e', main: '#22c55e' },
  { id: 'abyss', bg: '#020617', text: '#e2e8f0', main: '#60a5fa' },
  { id: 'aurora', bg: '#0b0f19', text: '#f1f5f9', main: '#2dd4bf' },
  { id: 'crimson', bg: '#1a0505', text: '#fee2e2', main: '#f87171' },
  { id: 'cyber-yellow', bg: '#0f172a', text: '#fef08a', main: '#eab308' },
  { id: 'space', bg: '#111827', text: '#e5e7eb', main: '#8b5cf6' },
  { id: 'mystic', bg: '#1e1b4b', text: '#f3e8ff', main: '#c084fc' },
  { id: 'toxic', bg: '#000000', text: '#ecfccb', main: '#84cc16' },
  
  // Light Themes
  { id: 'sakura', bg: '#fff1f2', text: '#881337', main: '#fb7185' },
  { id: 'sand', bg: '#fde68a', text: '#78350f', main: '#d97706' },
  { id: 'sky', bg: '#e0f2fe', text: '#0c4a6e', main: '#0284c7' },
  { id: 'rose-gold', bg: '#fce7f3', text: '#831843', main: '#db2777' },
  { id: 'vintage', bg: '#fef3c7', text: '#451a03', main: '#92400e' },
  { id: 'ghost', bg: '#f8fafc', text: '#0f172a', main: '#64748b' },
  { id: 'solar', bg: '#fef08a', text: '#422006', main: '#ca8a04' },
  { id: 'glacier', bg: '#e0f2fe', text: '#082f49', main: '#0ea5e9' },
  { id: 'pastel', bg: '#fdf4ff', text: '#701a75', main: '#c026d3' },
  { id: 'arcade', bg: '#27272a', text: '#fafafa', main: '#eab308' },
];

export default function ThemeModal({ isOpen, onClose }) {
  const { theme, setTheme } = useContext(ThemeContext);
  const [search, setSearch] = useState('');
  const [originalTheme, setOriginalTheme] = useState(theme);

  useEffect(() => {
    if (isOpen) {
      setOriginalTheme(theme);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setTheme(originalTheme);
    onClose();
  };

  const filteredThemes = themes.filter(t => t.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div 
        className="w-full max-w-xl rounded-3xl shadow-2xl border relative overflow-hidden flex flex-col h-[80vh]" 
        style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--sub-color)' }}
      >
        
        {/* Header */}
        <div className="p-6 border-b flex items-center gap-4" style={{ borderColor: 'var(--sub-color)' }}>
          <Search size={20} style={{ color: 'var(--sub-color)' }} />
          <input 
            type="text" 
            placeholder="Theme..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow bg-transparent outline-none font-bold text-lg"
            style={{ color: 'var(--text-color)' }}
            autoFocus
          />
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-black/10 transition-colors" style={{ color: 'var(--sub-color)' }}>
            <X size={24} />
          </button>
        </div>

        {/* Single Column List */}
        <div className="flex-grow overflow-y-auto no-scrollbar p-4 flex flex-col gap-1">
          {filteredThemes.map(t => (
            <button
              key={t.id}
              onClick={() => { setTheme(t.id); onClose(); }}
              onMouseEnter={() => setTheme(t.id)}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left ${theme === t.id ? 'border-[var(--main-color)] bg-black/5' : 'border-transparent hover:bg-black/5'}`}
            >
              <span className="font-bold capitalize text-sm md:text-base" style={{ color: theme === t.id ? 'var(--main-color)' : 'var(--text-color)' }}>
                {t.id.replace('-', ' ')}
              </span>
              
              {/* Pill-shaped Color Swatches */}
              <div className="flex bg-black/20 rounded-full p-1 border border-black/10">
                <div className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: t.main }}></div>
                <div className="w-4 h-4 rounded-full border border-black/20 -ml-1" style={{ backgroundColor: t.text }}></div>
                <div className="w-4 h-4 rounded-full border border-black/20 -ml-1" style={{ backgroundColor: t.bg }}></div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}