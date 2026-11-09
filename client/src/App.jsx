import { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import TypingTest from './components/TypingTest';
import Leaderboard from './components/Leaderboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import About from './pages/About';
import Custom from './pages/Custom';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import ThemeModal from './components/ThemeModal';
import { User, Palette } from 'lucide-react';

function Navbar({ openThemeModal }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="flex flex-col lg:flex-row justify-between items-center px-4 md:px-8 py-4 md:py-6 max-w-7xl w-full mx-auto gap-4 relative z-50">
      <div className="flex justify-between items-center w-full lg:w-auto">
        <Link to="/" className="flex items-center gap-2 text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-color)' }}>
          type<span style={{ color: 'var(--main-color)' }}>giggle</span>
        </Link>
        
        <div className="flex lg:hidden gap-2">
          <button onClick={openThemeModal} className="p-2 rounded-lg hover:bg-black/10 transition-colors" style={{ color: 'var(--sub-color)' }}>
            <Palette size={20} />
          </button>
          {user ? (
            <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold border" style={{ borderColor: 'var(--main-color)', color: 'var(--main-color)' }}>
              <User size={16} />
            </Link>
          ) : (
            <Link to="/login" className="px-4 py-1.5 rounded-xl font-bold text-sm" style={{ backgroundColor: 'var(--main-color)', color: 'var(--bg-color)' }}>
              Login
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full lg:w-auto">
        <nav className="flex items-center justify-center gap-4 lg:gap-6 text-sm font-bold w-full md:w-auto">
          <Link to="/leaderboard" className="hover:opacity-100 opacity-70 transition-opacity" style={{ color: 'var(--text-color)' }}>Leaderboard</Link>
          <Link to="/custom" className="hover:opacity-100 opacity-70 transition-opacity" style={{ color: 'var(--text-color)' }}>Custom</Link>
          <Link to="/blog" className="hover:opacity-100 opacity-70 transition-opacity" style={{ color: 'var(--text-color)' }}>Blog</Link>
          <Link to="/about" className="hover:opacity-100 opacity-70 transition-opacity" style={{ color: 'var(--text-color)' }}>About</Link>
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <button onClick={openThemeModal} className="p-2 rounded-lg hover:bg-black/10 transition-colors" style={{ color: 'var(--sub-color)' }} title="Change Theme">
            <Palette size={20} />
          </button>

          {user ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all hover:scale-105 border ml-2" style={{ backgroundColor: 'rgba(0,0,0,0.05)', borderColor: 'var(--main-color)', color: 'var(--main-color)' }}>
                <User size={18} />
                <span>{user.username}</span>
              </Link>
              <button onClick={logout} className="text-sm font-semibold hover:text-red-500 transition-colors ml-2" style={{ color: 'var(--sub-color)' }}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="px-6 py-2 rounded-xl font-bold transition-transform hover:scale-105 text-sm ml-2" style={{ backgroundColor: 'var(--main-color)', color: 'var(--bg-color)' }}>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function App() {
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans relative overflow-x-hidden">
        <Navbar openThemeModal={() => setIsThemeModalOpen(true)} />
        
        <main className="flex-grow flex flex-col items-center justify-center w-full px-4 relative pt-4 md:pt-8 pb-12">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[120px] opacity-10 pointer-events-none" style={{ backgroundColor: 'var(--main-color)' }}></div>
          
          <Routes>
            <Route path="/" element={<TypingTest />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/custom" element={<Custom />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
        </main>

        <ThemeModal isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)} />
      </div>
    </Router>
  );
}

export default App;