import { useState } from 'react';
import SEO from '../components/SEO';

export default function WpmCalculator() {
  const [chars, setChars] = useState('');
  const [time, setTime] = useState('');
  const [result, setResult] = useState(null);

  const calculate = (e) => {
    e.preventDefault();
    if (!chars || !time) return;
    const minutes = time / 60;
    const wpm = Math.round((parseInt(chars) / 5) / minutes);
    setResult(wpm);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-4">
      <SEO 
        title="WPM Calculator" 
        description="Calculate your Words Per Minute (WPM) manually. Enter your typed characters and time to find out your exact typing speed." 
      />
      
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">WPM Calculator</h1>
        <p className="text-gray-400 text-lg">Calculate your exact words per minute manually.</p>
      </div>

      <div className="max-w-md mx-auto p-8 rounded-3xl border border-white/10 shadow-2xl" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
        <form onSubmit={calculate} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Total Characters Typed (including spaces)</label>
            <input 
              type="number" 
              value={chars} 
              onChange={(e) => setChars(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-[var(--main-color)]"
              placeholder="e.g. 250"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Time taken (in seconds)</label>
            <input 
              type="number" 
              value={time} 
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-[var(--main-color)]"
              placeholder="e.g. 60"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-lg transition-transform hover:scale-105"
            style={{ backgroundColor: 'var(--main-color)', color: 'var(--bg-color)' }}
          >
            Calculate WPM
          </button>
        </form>

        {result !== null && (
          <div className="mt-8 p-6 rounded-2xl text-center bg-white/5 border border-white/10">
            <p className="text-sm font-bold text-gray-400 mb-2">Your Typing Speed</p>
            <p className="text-5xl font-extrabold text-[var(--main-color)]">{result} WPM</p>
          </div>
        )}
      </div>
    </div>
  );
}