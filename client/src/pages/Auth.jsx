import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Globe, Keyboard, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function Auth() {
  const [view, setView] = useState('login'); // 'login', 'register', 'verify', 'forgot', 'reset'
  const [formData, setFormData] = useState({ 
    username: '', email: '', password: '', code: '', newPassword: '' 
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/profile');
  }, [user, navigate]);

  const evaluatePassword = (pass) => {
    let score = 0;
    if (!pass) return setPasswordStrength({ score: 0, label: '', color: 'transparent' });
    
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) setPasswordStrength({ score: 1, label: 'Weak', color: '#ef4444' });
    else if (score === 3 || score === 4) setPasswordStrength({ score: 2, label: 'Good', color: '#eab308' });
    else setPasswordStrength({ score: 3, label: 'Strong', color: '#22c55e' });
  };

  const handlePasswordChange = (e) => {
    const pass = e.target.value;
    setFormData({...formData, password: pass});
    evaluatePassword(pass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      if (view === 'login') {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email: formData.email, password: formData.password });
        login(res.data.user, res.data.token);
        navigate('/profile');
      } 
      else if (view === 'register') {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData);
        setView('verify');
      } 
      else if (view === 'verify') {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify`, { email: formData.email, code: formData.code });
        login(res.data.user, res.data.token);
        navigate('/profile');
      }
      else if (view === 'forgot') {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, { email: formData.email });
        setSuccess('Reset code sent! Check your email.');
        setView('reset');
      }
      else if (view === 'reset') {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, { 
          email: formData.email, 
          code: formData.code, 
          newPassword: formData.newPassword 
        });
        setSuccess('Password reset! You can now log in.');
        setView('login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const switchView = (newView) => {
    setView(newView);
    setError('');
    setSuccess('');
    setPasswordStrength({ score: 0, label: '', color: 'transparent' });
  };

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center py-10 px-4 animate-fade-in">
      
      <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl border border-white/10" style={{ backgroundColor: 'var(--bg-color)' }}>
        
        {/* Left Side - Branding */}
        <div className="hidden md:flex w-1/2 p-12 flex-col justify-between relative overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] blur-[100px] opacity-20 pointer-events-none" style={{ backgroundColor: 'var(--main-color)' }}></div>
          
          <Link to="/" className="relative z-10 flex items-center gap-2 text-2xl font-extrabold hover:opacity-80 transition-opacity" style={{ color: 'var(--text-color)' }}>
            <ArrowLeft size={24} /> Back to typing
          </Link>

          <div className="relative z-10">
            <Keyboard size={64} className="mb-6 opacity-80" style={{ color: 'var(--main-color)' }} />
            <h2 className="text-4xl font-extrabold mb-4 leading-tight" style={{ color: 'var(--text-color)' }}>
              Join the fastest growing typing community.
            </h2>
            <p className="text-lg" style={{ color: 'var(--sub-color)' }}>
              Track your WPM history, climb the global leaderboard, and save your custom themes.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
          
          <div className="text-center mb-8 md:text-left">
            <h2 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--text-color)' }}>
              {view === 'login' ? 'Welcome back' : 
               view === 'register' ? 'Create an account' : 
               view === 'verify' ? 'Verify your email' :
               view === 'forgot' ? 'Forgot Password' : 'Reset Password'}
            </h2>
            <p className="text-sm" style={{ color: 'var(--sub-color)' }}>
              {view === 'login' && 'Enter your details to access your dashboard.'}
              {view === 'register' && 'Start typing and save your progress today.'}
              {view === 'verify' && `We sent a 6-digit code to ${formData.email}.`}
              {view === 'forgot' && 'Enter your email to receive a reset code.'}
              {view === 'reset' && `Enter the code sent to ${formData.email} and your new password.`}
            </p>
          </div>

          {view !== 'verify' && view !== 'forgot' && view !== 'reset' && (
            <>
              <button 
                onClick={() => setError('Google OAuth coming soon!')}
                className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors flex items-center justify-center gap-2 font-bold mb-6" 
                style={{ color: 'var(--text-color)' }}
              >
                <Globe size={20} /> Continue with Google
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-[1px]" style={{ backgroundColor: 'var(--sub-color)', opacity: 0.3 }}></div>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--sub-color)' }}>or</span>
                <div className="flex-1 h-[1px]" style={{ backgroundColor: 'var(--sub-color)', opacity: 0.3 }}></div>
              </div>
            </>
          )}

          {error && (
            <div className="mb-6 p-3 rounded-lg text-sm font-semibold text-center border border-red-500/50 bg-red-500/10 text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 rounded-lg text-sm font-semibold text-center border border-green-500/50 bg-green-500/10 text-green-400">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {view === 'register' && (
              <div>
                <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--sub-color)' }}>Username</label>
                <input type="text" required className="w-full p-3 rounded-xl bg-black/20 border border-white/10 outline-none focus:border-[var(--main-color)]" style={{ color: 'var(--text-color)' }} onChange={(e) => setFormData({...formData, username: e.target.value})} />
              </div>
            )}
            
            {(view === 'login' || view === 'register' || view === 'forgot') && (
              <div>
                <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--sub-color)' }}>Email</label>
                <input type="email" required className="w-full p-3 rounded-xl bg-black/20 border border-white/10 outline-none focus:border-[var(--main-color)]" style={{ color: 'var(--text-color)' }} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
            )}

            {(view === 'login' || view === 'register') && (
              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--sub-color)' }}>Password</label>
                  {view === 'login' && <button type="button" onClick={() => switchView('forgot')} className="text-xs font-bold hover:underline" style={{ color: 'var(--main-color)' }}>Forgot?</button>}
                </div>
                
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    className="w-full p-3 pr-10 rounded-xl bg-black/20 border border-white/10 outline-none focus:border-[var(--main-color)]" 
                    style={{ color: 'var(--text-color)' }} 
                    onChange={handlePasswordChange} 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                  >
                    {showPassword ? <EyeOff size={18} color="var(--text-color)" /> : <Eye size={18} color="var(--text-color)" />}
                  </button>
                </div>

                {view === 'register' && formData.password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 h-1.5 mb-1">
                      {[1, 2, 3].map((level) => (
                        <div 
                          key={level} 
                          className="flex-1 rounded-full transition-all duration-300"
                          style={{ 
                            backgroundColor: passwordStrength.score >= level ? passwordStrength.color : 'rgba(255,255,255,0.1)' 
                          }}
                        ></div>
                      ))}
                    </div>
                    <p className="text-xs font-semibold text-right" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </p>
                  </div>
                )}
              </div>
            )}

            {view === 'verify' && (
              <div>
                <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-center" style={{ color: 'var(--sub-color)' }}>6-Digit Code</label>
                <input type="text" required maxLength="6" className="w-full p-4 text-center text-3xl tracking-[0.5em] font-mono rounded-xl bg-black/20 border border-white/10 outline-none focus:border-[var(--main-color)]" style={{ color: 'var(--text-color)' }} onChange={(e) => setFormData({...formData, code: e.target.value})} />
              </div>
            )}

            {view === 'reset' && (
              <>
                <div>
                  <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-center" style={{ color: 'var(--sub-color)' }}>Reset Code</label>
                  <input type="text" required maxLength="6" className="w-full p-3 text-center text-xl font-mono rounded-xl bg-black/20 border border-white/10 outline-none focus:border-[var(--main-color)]" style={{ color: 'var(--text-color)' }} onChange={(e) => setFormData({...formData, code: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--sub-color)' }}>New Password</label>
                  <div className="relative">
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      required 
                      className="w-full p-3 pr-10 rounded-xl bg-black/20 border border-white/10 outline-none focus:border-[var(--main-color)]" 
                      style={{ color: 'var(--text-color)' }} 
                      onChange={(e) => setFormData({...formData, newPassword: e.target.value})} 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                    >
                      {showNewPassword ? <EyeOff size={18} color="var(--text-color)" /> : <Eye size={18} color="var(--text-color)" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <button type="submit" disabled={loading} className={`mt-4 p-4 rounded-xl font-bold text-lg transition-all ${loading ? 'opacity-50' : 'hover:scale-[1.02] shadow-xl'}`} style={{ backgroundColor: 'var(--main-color)', color: 'var(--bg-color)' }}>
              {loading ? 'Processing...' : (
                view === 'login' ? 'Sign In' : 
                view === 'register' ? 'Create Account' : 
                view === 'verify' ? 'Verify & Login' : 
                view === 'forgot' ? 'Send Reset Code' : 'Reset Password'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium" style={{ color: 'var(--sub-color)' }}>
            {view === 'login' ? "New to TypeGiggle? " : view === 'register' ? "Already have an account? " : "Remember your password? "}
            <button onClick={() => switchView(view === 'login' ? 'register' : 'login')} className="font-bold hover:underline transition-all" style={{ color: 'var(--main-color)' }}>
              {view === 'login' ? 'Create an account' : 'Sign in'}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}