import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Type, Play, FileText, Settings2 } from 'lucide-react';
import SEO from '../components/SEO';

export default function Custom() {
  const [customText, setCustomText] = useState('');
  const [time, setTime] = useState(60);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleStart = () => {
    if (customText.trim().length < 10) {
      setError('Please enter at least 10 characters to practice.');
      return;
    }

    localStorage.setItem('customPracticeText', customText.trim());
    localStorage.setItem('customPracticeTime', time.toString());
    
    navigate('/');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCustomText(text);
    } catch (err) {
      setError('Please allow clipboard access or paste manually.');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-10 md:py-16 px-4 animate-fade-in" style={{ color: 'var(--text-color)' }}>
      <SEO 
        title="Custom Practice" 
        description="Paste any text you want to practice. Whether it's a difficult paragraph, code snippet, or your own notes, type it to perfection on TypeGiggle." 
      />
      
      <div className="flex flex-col lg:flex-row justify-center items-start gap-8">
        
        <div className="w-full max-w-3xl flex-grow">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 flex items-center justify-center gap-3" style={{ color: 'var(--main-color)' }}>
              <FileText size={40} /> Custom Practice
            </h1>
            <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto" style={{ color: 'var(--sub-color)' }}>
              Paste any text you want to practice. Whether it's a difficult paragraph, code, or your own notes, type it to perfection.
            </p>
          </div>

          <div className="p-6 md:p-10 rounded-3xl border border-white/10 shadow-2xl" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
            
            {error && (
              <div className="mb-6 p-3 rounded-lg text-sm font-semibold text-center border border-red-500/50 bg-red-500/10 text-red-400">
                {error}
              </div>
            )}

            <div className="mb-8">
              <div className="flex justify-between items-end mb-2">
                <label className="font-bold flex items-center gap-2" style={{ color: 'var(--text-color)' }}>
                  <Type size={18} /> Your Text
                </label>
                <button 
                  onClick={handlePaste}
                  className="text-sm font-bold hover:underline"
                  style={{ color: 'var(--main-color)' }}
                >
                  Paste from clipboard
                </button>
              </div>
              <textarea
                value={customText}
                onChange={(e) => { setCustomText(e.target.value); setError(''); }}
                placeholder="Paste your paragraph, code snippet, or anything you want to type here..."
                className="w-full h-48 p-4 md:p-6 rounded-2xl bg-black/20 border border-white/10 outline-none transition-colors focus:border-[var(--main-color)] font-mono text-sm md:text-lg resize-none"
                style={{ color: 'var(--text-color)' }}
              />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              
              <div className="flex items-center gap-4 flex-wrap justify-center">
                <Settings2 size={20} style={{ color: 'var(--sub-color)' }} />
                <span className="font-bold text-sm" style={{ color: 'var(--sub-color)' }}>Time Limit:</span>
                <div className="flex gap-2">
                  {[15, 30, 60, 120].map(t => (
                    <button
                      key={t}
                      onClick={() => setTime(t)}
                      className={`px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-colors ${time === t ? 'bg-[var(--main-color)]' : 'bg-black/20 hover:bg-black/40'}`}
                      style={{ color: time === t ? 'var(--bg-color)' : 'var(--text-color)' }}
                    >
                      {t}s
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleStart}
                className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl"
                style={{ backgroundColor: 'var(--main-color)', color: 'var(--bg-color)' }}
              >
                <Play size={20} /> Start Typing
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}