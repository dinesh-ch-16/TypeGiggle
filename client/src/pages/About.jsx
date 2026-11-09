import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Info, BookOpen, Keyboard, BarChart2, Activity, Mail, Heart } from 'lucide-react';
import { FaDiscord, FaXTwitter } from 'react-icons/fa6';
import ContactModal from '../components/ContactModal'; 
import DonateModal from '../components/DonateModal';
import SEO from '../components/SEO';

export default function About() {
  const [stats, setStats] = useState({ totalTests: 0, totalHours: "0.00", chartData: [] });
  const [isContactModalOpen, setIsContactModalOpen] = useState(false); 
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/stats`);
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load stats");
      }
    };
    fetchStats();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-lg shadow-xl border border-white/20 text-sm font-mono" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <p className="font-bold mb-1" style={{ color: 'var(--main-color)' }}>{label}</p>
          <p style={{ color: 'var(--text-color)' }}>Users: <span className="font-bold">{payload[0].value}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-16 px-6 animate-fade-in" style={{ color: 'var(--text-color)' }}>
      <SEO 
        title="About" 
        description="Learn about TypeGiggle, the fun and free typing platform. Track your progress, climb the leaderboard, and improve your speed." 
      />
      
      {/* Header Stats */}
      <div className="text-center mb-16">
        <p className="text-lg font-medium mb-2" style={{ color: 'var(--sub-color)' }}>Created with love by TypeGiggle.</p>
        <p className="text-lg font-medium mb-2" style={{ color: 'var(--sub-color)' }}>Supported and expanded by awesome people.</p>
        <p className="text-lg font-medium" style={{ color: 'var(--sub-color)' }}>Launched in 2026.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-center">
        <div>
          <p className="text-lg font-bold mb-2" style={{ color: 'var(--sub-color)' }}>total tests started</p>
          <p className="text-6xl font-extrabold" style={{ color: 'var(--text-color)' }}>{stats.totalTests.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-lg font-bold mb-2" style={{ color: 'var(--sub-color)' }}>total typing time</p>
          <p className="text-6xl font-extrabold" style={{ color: 'var(--text-color)' }}>{stats.totalHours}</p>
          <p className="text-lg font-bold mt-2" style={{ color: 'var(--sub-color)' }}>hours</p>
        </div>
        <div>
          <p className="text-lg font-bold mb-2" style={{ color: 'var(--sub-color)' }}>total tests completed</p>
          <p className="text-6xl font-extrabold" style={{ color: 'var(--text-color)' }}>{stats.totalTests.toLocaleString()}</p>
        </div>
      </div>

      <div className="w-full h-[350px] mb-20">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.chartData} margin={{ top: 20, right: 0, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="range" stroke="var(--sub-color)" tick={{ fill: 'var(--sub-color)', fontSize: 12 }} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} angle={-45} textAnchor="end" />
            <YAxis stroke="var(--sub-color)" tick={{ fill: 'var(--sub-color)', fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey="users" fill="var(--main-color)" radius={[4, 4, 0, 0]} maxBarSize={50} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-center mt-4 text-sm font-mono" style={{ color: 'var(--sub-color)' }}>distribution of time 60 leaderboard results (wpm)</p>
      </div>

      {/* Main Content Structure */}
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* About */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: 'var(--text-color)' }}>
            <Info size={24} style={{ color: 'var(--main-color)' }} /> about
          </h2>
          <p className="leading-relaxed" style={{ color: 'var(--sub-color)' }}>
            TypeGiggle is a minimalistic and customizable typing test. It features many test modes, an account system to save your typing speed history, and user-configurable features such as themes, a smooth caret, and more. TypeGiggle attempts to emulate the experience of natural keyboard typing during a typing test, by unobtrusively presenting the text prompts and displaying typed characters in-place, providing straightforward, real-time feedback on typos, speed, and accuracy.
          </p>
          <p className="mt-4 font-bold" style={{ color: 'var(--text-color)' }}>
            Test yourself in various modes, track your progress and improve your speed.
          </p>
        </section>

        {/* Word Set */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: 'var(--text-color)' }}>
             <BookOpen size={24} style={{ color: 'var(--main-color)' }} /> word set
          </h2>
          <p className="leading-relaxed" style={{ color: 'var(--sub-color)' }}>
            By default, this website uses the most common 200 words in the English language to generate its tests. You can change to an expanded set (1000 most common words) in the options, or change the language entirely.
          </p>
        </section>

        {/* Keybinds */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: 'var(--text-color)' }}>
            <Keyboard size={24} style={{ color: 'var(--main-color)' }} /> keybinds
          </h2>
          <p className="leading-relaxed" style={{ color: 'var(--sub-color)' }}>
            You can use <kbd className="px-2 py-1 rounded bg-black/30 border border-white/10 text-xs font-mono">tab</kbd> &gt; <kbd className="px-2 py-1 rounded bg-black/30 border border-white/10 text-xs font-mono">enter</kbd> to restart the typing test. Open the command line by pressing <kbd className="px-2 py-1 rounded bg-black/30 border border-white/10 text-xs font-mono">escape</kbd> or <kbd className="px-2 py-1 rounded bg-black/30 border border-white/10 text-xs font-mono">ctrl + shift + p</kbd> - there you can access all the functionality you need without touching your mouse.
          </p>
        </section>

        {/* Stats Explanation */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: 'var(--text-color)' }}>
            <BarChart2 size={24} style={{ color: 'var(--main-color)' }} /> stats
          </h2>
          <div className="space-y-3 font-mono text-sm" style={{ color: 'var(--sub-color)' }}>
            <p><strong className="text-white" style={{ color: 'var(--main-color)' }}>wpm</strong> - total number of characters in the correctly typed words (including spaces), divided by 5 and normalised to 60 seconds.</p>
            <p><strong className="text-white" style={{ color: 'var(--main-color)' }}>raw wpm</strong> - calculated just like wpm, but also includes incorrect words.</p>
            <p><strong className="text-white" style={{ color: 'var(--main-color)' }}>acc</strong> - percentage of correctly pressed keys.</p>
            <p><strong className="text-white" style={{ color: 'var(--main-color)' }}>char</strong> - correct characters / incorrect characters. Calculated after the test has ended.</p>
            <p><strong className="text-white" style={{ color: 'var(--main-color)' }}>consistency</strong> - based on the variance of your raw wpm. Closer to 100% is better. Calculated using the coefficient of variation of raw wpm and mapped onto a scale from 0 to 100.</p>
          </div>
        </section>

        {/* Results Screen */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: 'var(--text-color)' }}>
            <Activity size={24} style={{ color: 'var(--main-color)' }} /> results screen
          </h2>
          <p className="leading-relaxed" style={{ color: 'var(--sub-color)' }}>
            After completing a test you will be able to see your wpm, raw wpm, accuracy, character stats, test length, leaderboards info and test info. You can also see a graph of your wpm and raw over the duration of the test. Remember that the wpm line is a global average, while the raw wpm line is a local, momentary value.
          </p>
        </section>

        {/* Contact / Support Grid */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Contact Us */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: 'var(--text-color)' }}>
                <Mail size={24} style={{ color: 'var(--main-color)' }} /> contact
              </h2>
              <p className="leading-relaxed mb-6" style={{ color: 'var(--sub-color)' }}>
                If you encounter a bug, have a feature request or just want to say hi - here are the different ways you can contact us directly.
              </p>
              <div className="flex flex-col gap-3">
                
                <button 
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors flex items-center justify-center gap-2 text-sm font-bold" 
                  style={{ color: 'var(--text-color)' }}
                >
                  <Mail size={18} /> Email Us
                </button>

                <div className="flex gap-3">
                  <a 
                    href="https://x.com/TypeGiggle" 
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors flex items-center justify-center gap-2 text-sm font-bold" 
                    style={{ color: 'var(--text-color)' }}
                  >
                    <FaXTwitter size={18} /> X (Twitter)
                  </a>
                  
                  <a 
                    href="https://discord.gg/bP4RpvtzM" 
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors flex items-center justify-center gap-2 text-sm font-bold" 
                    style={{ color: 'var(--text-color)' }}
                  >
                    <FaDiscord size={18} /> Discord
                  </a>
                </div>
              </div>
            </div>

            {/* Support / Donate */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: 'var(--text-color)' }}>
                <Heart size={24} style={{ color: 'var(--main-color)' }} /> support
              </h2>
              <p className="leading-relaxed mb-6" style={{ color: 'var(--sub-color)' }}>
                Thanks to everyone who has supported this project. It would not be possible without you and your continued support. Help keep TypeGiggle ad-light and free forever.
              </p>
              
              <button 
                onClick={() => setIsDonateModalOpen(true)}
                className="w-full py-3 rounded-xl border hover:bg-white/5 transition-colors flex items-center justify-center gap-2 text-sm font-bold" 
                style={{ color: 'var(--main-color)', borderColor: 'var(--main-color)' }}
              >
                <Heart size={18} /> Donate Us
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* The Modals */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
        email="contact.typegiggle@gmail.com" 
      />
      
      <DonateModal 
        isOpen={isDonateModalOpen} 
        onClose={() => setIsDonateModalOpen(false)} 
      />
    </div>
  );
}