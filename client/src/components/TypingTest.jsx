import { useState, useEffect, useRef, useContext } from 'react';
import { commonWords, punctuation, numbers } from '../data/words';
import { quotes } from '../data/quotes';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { RotateCcw, Mail, Heart, Shield } from 'lucide-react';
import { FaDiscord, FaXTwitter } from 'react-icons/fa6';
import SEO from './SEO';

export default function TypingTest() {
  const { token } = useContext(AuthContext);
  
  const customText = localStorage.getItem('customPracticeText');
  const customTime = localStorage.getItem('customPracticeTime');
  const isCustom = !!customText;

  const [mode, setMode] = useState('time'); 
  const [config, setConfig] = useState({ 
    time: isCustom ? parseInt(customTime) : 15, 
    punctuation: false, 
    numbers: false 
  });
  
  const [timeLeft, setTimeLeft] = useState(isCustom ? parseInt(customTime) : 15);
  const [words, setWords] = useState(isCustom ? customText.split('') : []);
  const [typed, setTyped] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const [wpm, setWpm] = useState(0);
  const [rawWpm, setRawWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [consistency, setConsistency] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [wpmHistory, setWpmHistory] = useState([]);
  const [zenTimeElapsed, setZenTimeElapsed] = useState(0);

  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const zenTimerRef = useRef(null);
  const zenStartTime = useRef(null); 
  const isTestFinished = useRef(false); 
  const statsRef = useRef({ correct: 0, incorrect: 0, history: [] });
  const wordsContainerRef = useRef(null);

  useEffect(() => {
    if (isCustom) {
      localStorage.removeItem('customPracticeText');
      localStorage.removeItem('customPracticeTime');
      setMode('custom');
    } else {
      generateWords(15, false, false);
    }
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (mode === 'quote') {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      const fullText = `"${randomQuote.text}" - ${randomQuote.author}`;
      setWords(fullText.split(''));
      setConfig(prev => ({ ...prev, time: 60 }));
      setTimeLeft(60);
      resetTest(60);
    } else if (mode === 'zen') {
      generateWords(500, false, false);
      setTimeLeft(99999);
      resetTest(99999);
    } else if (mode === 'time') {
      generateWords(config.time, config.punctuation, config.numbers);
      setTimeLeft(config.time);
      resetTest(config.time);
    }
  }, [mode]);

  const generateWords = (time, usePunctuation, useNumbers) => {
    const newWords = [];
    for (let i = 0; i < 500; i++) {
      let word = "";
      if (useNumbers && Math.random() < 0.1) {
        word = numbers[Math.floor(Math.random() * numbers.length)];
      } else {
        word = commonWords[Math.floor(Math.random() * commonWords.length)];
        if (usePunctuation) {
          if (Math.random() < 0.2) word = word.charAt(0).toUpperCase() + word.slice(1);
          if (Math.random() < 0.15) word += punctuation[Math.floor(Math.random() * punctuation.length)];
        }
      }
      newWords.push(word);
    }
    setWords(newWords.join(' ').split(''));
  };

  const handleConfigChange = (newConfig) => {
    setConfig(newConfig);
    generateWords(newConfig.time, newConfig.punctuation, newConfig.numbers);
    resetTest(newConfig.time);
  };

  const handleInput = (e) => {
    if (timeLeft === 0 && mode !== 'zen') return;

    if (!isActive) {
      setIsActive(true);
      if (mode !== 'zen') {
        startTimer();
      } else {
        zenStartTime.current = Date.now();
        zenTimerRef.current = setInterval(() => {
          const elapsedSecs = Math.floor((Date.now() - zenStartTime.current) / 1000);
          setZenTimeElapsed(elapsedSecs);
          if (elapsedSecs > 0) {
            const currentCorrect = statsRef.current.correct;
            const currentWpm = Math.round((currentCorrect / 5) / (elapsedSecs / 60)) || 0;
            setWpmHistory((prev) => [...prev, { time: elapsedSecs, wpm: currentWpm }]);
            statsRef.current.history.push({ time: elapsedSecs, wpm: currentWpm });
          }
        }, 1000);
      }
    }

    const newTyped = e.target.value;
    setTyped(newTyped);

    let correct = 0;
    let incorrect = 0;
    for (let i = 0; i < newTyped.length; i++) {
      if (newTyped[i] === words[i]) correct++;
      else incorrect++;
    }
    
    setCorrectChars(correct);
    setIncorrectChars(incorrect);
    statsRef.current.correct = correct;
    statsRef.current.incorrect = incorrect;

    if (newTyped.length > 0 && newTyped[newTyped.length - 1] === ' ') {
      const activeChar = document.getElementById(`char-${newTyped.length}`);
      if (activeChar) {
        activeChar.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }

    if (mode === 'quote' && newTyped.length === words.length) {
      clearInterval(timerRef.current); 
      finishTest(); 
    }
  };

  const startTimer = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        const elapsedTime = config.time - newTime;
        if (elapsedTime > 0) {
          const currentCorrect = statsRef.current.correct;
          const currentWpm = Math.round((currentCorrect / 5) / (elapsedTime / 60)) || 0;
          setWpmHistory((prev) => [...prev, { time: elapsedTime, wpm: currentWpm }]);
          statsRef.current.history.push({ time: elapsedTime, wpm: currentWpm });
        }
        if (newTime <= 0) {
          clearInterval(timerRef.current);
          finishTest();
          return 0;
        }
        return newTime;
      });
    }, 1000);
  };

  const finishTest = () => {
    if (isTestFinished.current) return; 
    isTestFinished.current = true;

    if (timerRef.current) clearInterval(timerRef.current);
    if (zenTimerRef.current) clearInterval(zenTimerRef.current);

    setIsActive(false);
    setShowResults(true);
    if (inputRef.current) inputRef.current.blur();
    
    const finalCorrect = statsRef.current.correct;
    const finalIncorrect = statsRef.current.incorrect;
    const totalTyped = finalCorrect + finalIncorrect;
    
    let timeSpentInMinutes = 0;
    let secondsSpent = 0;

    if (mode === 'zen') {
      const endTime = Date.now();
      secondsSpent = Math.max(1, (endTime - zenStartTime.current) / 1000); 
      timeSpentInMinutes = secondsSpent / 60;
    } else if (mode === 'quote') {
      secondsSpent = config.time - timeLeft;
      timeSpentInMinutes = secondsSpent / 60;
    } else {
      secondsSpent = config.time;
      timeSpentInMinutes = config.time / 60;
    }

    const finalWpm = Math.round((finalCorrect / 5) / timeSpentInMinutes) || 0;
    const finalRawWpm = Math.round((totalTyped / 5) / timeSpentInMinutes) || 0;
    const finalAcc = totalTyped > 0 ? Math.round((finalCorrect / totalTyped) * 100) : 0;

    setWpm(finalWpm);
    setRawWpm(finalRawWpm);
    setAccuracy(finalAcc);
    setCorrectChars(finalCorrect);
    setIncorrectChars(finalIncorrect);
    setTimeLeft(Math.round(secondsSpent)); 

    let calcConsistency = 0;
    if (statsRef.current.history.length > 1) {
      const wpms = statsRef.current.history.map(d => d.wpm);
      const avg = wpms.reduce((a, b) => a + b, 0) / wpms.length;
      const variance = wpms.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / wpms.length;
      const stdDev = Math.sqrt(variance);
      calcConsistency = Math.max(0, Math.round(100 - (stdDev / avg) * 100));
      if (isNaN(calcConsistency)) calcConsistency = 0;
    }
    setConsistency(calcConsistency);

    // 1. If logged in, save score normally
    if (token && finalWpm > 0) {
      axios.post(`${import.meta.env.VITE_API_URL}/api/auth/save-score`, {
        wpm: finalWpm, rawWpm: finalRawWpm, consistency: calcConsistency, accuracy: finalAcc,
        mode: mode === 'zen' ? 'zen' : mode === 'quote' ? 'quote' : `${config.time}s`
      }, {
        headers: { Authorization: token }
      }).catch(err => console.error("Failed to save score", err));
    } 
    // 2. If NOT logged in, track as a guest for global stats
    else if (!token && finalWpm > 0) {
      axios.post(`${import.meta.env.VITE_API_URL}/api/auth/track-guest`, {
        wpm: finalWpm,
        seconds: Math.round(secondsSpent)
      }).catch(err => console.error("Failed to track guest", err));
    }
  };

  const resetTest = (newTime) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (zenTimerRef.current) clearInterval(zenTimerRef.current);
    timerRef.current = null;
    isTestFinished.current = false; 
    statsRef.current = { correct: 0, incorrect: 0, history: [] };
    zenStartTime.current = null;
    
    setZenTimeElapsed(0);
    setTyped('');
    setTimeLeft(newTime || config.time);
    setIsActive(false);
    setShowResults(false);
    setWpmHistory([]);
    setCorrectChars(0);
    setIncorrectChars(0);
    
    if (mode === 'time') {
      generateWords(config.time, config.punctuation, config.numbers);
    } else if (mode === 'quote') {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setWords(`"${randomQuote.text}" - ${randomQuote.author}`.split(''));
    }

    if (wordsContainerRef.current) wordsContainerRef.current.scrollTop = 0;
    if (inputRef.current) inputRef.current.focus();
  };

  const progressPercent = mode === 'zen' ? 100 : (timeLeft / config.time) * 100;

  return (
    <div className="w-full max-w-4xl z-10 px-4 md:px-0">
      <SEO title="Typing Speed Test" description="Test your WPM and accuracy with TypeGiggle." />
      
      {/* Configuration Bar */}
      {!showResults && mode !== 'custom' && (
        <div 
          className="flex flex-wrap gap-3 md:gap-4 items-center justify-center mb-12 px-6 py-3 rounded-2xl mx-auto w-fit backdrop-blur-md transition-all shadow-lg" 
          style={{ backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--sub-color)' }}
        >
          <button onClick={() => setMode('time')} className={`hover:text-[var(--text-color)] transition-colors cursor-pointer text-sm font-semibold ${mode === 'time' ? 'text-[var(--main-color)]' : ''}`}>⏱ time</button>
          <button onClick={() => setMode('quote')} className={`hover:text-[var(--text-color)] transition-colors cursor-pointer text-sm font-semibold ${mode === 'quote' ? 'text-[var(--main-color)]' : ''}`}>“ quote</button>
          <button onClick={() => setMode('zen')} className={`hover:text-[var(--text-color)] transition-colors cursor-pointer text-sm font-semibold ${mode === 'zen' ? 'text-[var(--main-color)]' : ''}`}>🧘 zen</button>
          
          {mode === 'time' && (
            <>
              <div className="w-[1px] h-4 mx-1 md:mx-2" style={{ backgroundColor: 'var(--sub-color)', opacity: 0.5 }}></div>
              <button onClick={() => handleConfigChange({...config, punctuation: !config.punctuation})} className={`hover:text-[var(--text-color)] transition-colors cursor-pointer text-sm font-semibold ${config.punctuation ? 'text-[var(--main-color)]' : ''}`}>@ punctuation</button>
              <button onClick={() => handleConfigChange({...config, numbers: !config.numbers})} className={`hover:text-[var(--text-color)] transition-colors cursor-pointer text-sm font-semibold ${config.numbers ? 'text-[var(--main-color)]' : ''}`}># numbers</button>
              <div className="w-[1px] h-4 mx-1 md:mx-2" style={{ backgroundColor: 'var(--sub-color)', opacity: 0.5 }}></div>
              {[15, 30, 60].map(t => (
                <button key={t} onClick={() => handleConfigChange({...config, time: t})} className={`hover:text-[var(--text-color)] transition-colors cursor-pointer text-sm font-semibold ${config.time === t ? 'text-[var(--main-color)]' : ''}`}>{t}</button>
              ))}
            </>
          )}
        </div>
      )}

      {/* Typing Area */}
      {!showResults && (
        <div className="w-full animate-fade-in">
          <div className="flex justify-between items-center mb-6 px-4 md:px-0">
            <div className="text-3xl font-mono font-bold" style={{ color: 'var(--main-color)' }}>
              {mode === 'zen' ? zenTimeElapsed : timeLeft}
            </div>
            <button onClick={() => resetTest()} className="p-2 rounded-lg hover:bg-white/10 transition-colors" style={{ color: 'var(--sub-color)' }}>
              <RotateCcw size={20} />
            </button>
          </div>

          <input ref={inputRef} type="text" value={typed} onChange={handleInput} className="opacity-0 absolute w-0 h-0" autoFocus readOnly={timeLeft === 0 && mode !== 'zen'} />

          <div 
            ref={wordsContainerRef}
            className="text-2xl md:text-3xl leading-relaxed md:leading-relaxed tracking-wide select-none font-mono h-[150px] overflow-hidden flex flex-wrap w-full cursor-text px-4 md:px-0"
            onClick={() => { if(timeLeft > 0 || mode === 'zen') inputRef.current.focus() }}
          >
            {words.map((char, index) => {
              let className = "char-untyped";
              if (index < typed.length) {
                className = typed[index] === char ? "char-correct" : "char-incorrect";
              }
              const isCurrent = index === typed.length && (timeLeft > 0 || mode === 'zen');
              const displayChar = char === ' ' ? '\u00A0' : char;
              return (
                <span id={`char-${index}`} key={index} className={`${className} ${isCurrent ? 'caret' : ''}`}>
                  {displayChar}
                </span>
              );
            })}
          </div>
          
          {mode === 'zen' && (
             <div className="flex justify-center mt-8">
                <button onClick={finishTest} className="px-6 py-2 rounded-lg font-bold text-sm bg-[var(--main-color)] text-[var(--bg-color)] hover:scale-105 transition-transform">Finish Test</button>
             </div>
          )}
        </div>
      )}

      {/* Results Screen */}
      {showResults && (
        <div className="w-full animate-fade-in flex flex-col items-center">
          
          <div className="flex flex-col md:flex-row justify-between items-center w-full mb-8 gap-8 px-4 md:px-0">
            <div className="flex gap-12">
              <div>
                <p className="text-sm font-bold mb-1" style={{ color: 'var(--sub-color)' }}>wpm</p>
                <p className="text-6xl md:text-7xl font-extrabold" style={{ color: 'var(--main-color)' }}>{wpm}</p>
              </div>
              <div>
                <p className="text-sm font-bold mb-1" style={{ color: 'var(--sub-color)' }}>acc</p>
                <p className="text-6xl md:text-7xl font-extrabold" style={{ color: 'var(--text-color)' }}>{accuracy}%</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: 'var(--sub-color)' }}>test type</p>
                <p className="font-bold text-lg" style={{ color: 'var(--main-color)' }}>{mode} {mode === 'time' ? config.time : ''}</p>
              </div>
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: 'var(--sub-color)' }}>raw</p>
                <p className="font-bold text-lg" style={{ color: 'var(--text-color)' }}>{rawWpm}</p>
              </div>
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: 'var(--sub-color)' }}>characters</p>
                <p className="font-bold text-lg" style={{ color: 'var(--text-color)' }}>{correctChars}/{incorrectChars}</p>
              </div>
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: 'var(--sub-color)' }}>consistency</p>
                <p className="font-bold text-lg" style={{ color: 'var(--text-color)' }}>{consistency}%</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button onClick={() => resetTest()} className="px-6 py-3 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition-colors flex items-center gap-2" style={{ color: 'var(--text-color)' }}>
              <RotateCcw size={18} /> Restart
            </button>
          </div>

          <div className="w-full h-[250px] md:h-[300px] mb-12 px-4 md:px-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wpmHistory}>
                <XAxis dataKey="time" stroke="var(--sub-color)" tick={{fill: 'var(--sub-color)', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--sub-color)" tick={{fill: 'var(--sub-color)', fontSize: 12}} domain={[0, 'dataMax + 20']} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--main-color)', borderRadius: '8px', color: 'var(--text-color)' }}
                  itemStyle={{ color: 'var(--main-color)' }}
                />
                <Line type="monotone" dataKey="wpm" stroke="var(--main-color)" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full border-t py-8 mt-16 flex flex-col items-center justify-center gap-6" style={{ borderColor: 'var(--sub-color)' }}>
        <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-mono" style={{ color: 'var(--sub-color)' }}>
          <span><kbd className="px-2 py-1 rounded bg-black/10 border border-black/10">tab</kbd> + <kbd className="px-2 py-1 rounded bg-black/10 border border-black/10">enter</kbd> - restart test</span>
          <span><kbd className="px-2 py-1 rounded bg-black/10 border border-black/10">esc</kbd> - command line</span>
        </div>

        <div className="w-full max-w-4xl h-[1px] mx-auto" style={{ backgroundColor: 'var(--sub-color)', opacity: 0.3 }}></div>

        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 text-sm font-bold" style={{ color: 'var(--sub-color)' }}>
          <a href="mailto:contact@typegiggle.com" className="hover:text-[var(--main-color)] transition-colors flex items-center gap-2"><Mail size={16} /> contact</a>
          <a href="https://x.com/TypeGiggle" target="_blank" rel="noreferrer" className="hover:text-[var(--main-color)] transition-colors flex items-center gap-2"><FaXTwitter size={16} /> twitter</a>
          <a href="https://discord.gg/bP4RpvtzM" target="_blank" rel="noreferrer" className="hover:text-[var(--main-color)] transition-colors flex items-center gap-2"><FaDiscord size={16} /> discord</a>
          <a href="mailto:support@typegiggle.com" className="hover:text-[var(--main-color)] transition-colors flex items-center gap-2"><Heart size={16} /> support</a>
          <a href="/privacy-policy" className="hover:text-[var(--main-color)] transition-colors flex items-center gap-2"><Shield size={16} /> privacy</a>
        </div>

        <p className="text-xs" style={{ color: 'var(--sub-color)' }}>
          © 2026 TypeGiggle. Built for fun.
        </p>
      </footer>
    </div>
  );
}