import { X, Coffee, CreditCard } from 'lucide-react';

export default function DonateModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
      <div 
        className="w-full max-w-md rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden"
        style={{ backgroundColor: 'var(--bg-color)' }}
      >
        {/* Header */}
        <div className="p-8 pb-6 text-center relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            style={{ color: 'var(--sub-color)' }}
          >
            <X size={24} />
          </button>
          <h2 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--main-color)' }}>Support TypeGiggle</h2>
          <p className="text-sm" style={{ color: 'var(--sub-color)' }}>
            Help keep TypeGiggle free and ad-light for everyone.
          </p>
        </div>

        {/* Content */}
        <div className="px-8 pb-10 space-y-4">
          
          {/* Razorpay Option */}
          <div className="relative group">
            <button 
              disabled
              className="w-full py-4 rounded-xl border border-white/10 flex items-center justify-between px-6 opacity-50 cursor-not-allowed"
              style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
            >
              <div className="flex items-center gap-3">
                <CreditCard size={24} style={{ color: 'var(--text-color)' }} />
                <div className="text-left">
                  <p className="font-bold" style={{ color: 'var(--text-color)' }}>Razorpay</p>
                  <p className="text-xs" style={{ color: 'var(--sub-color)' }}>UPI, Cards, Netbanking (India)</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded bg-white/10" style={{ color: 'var(--sub-color)' }}>
                Coming Soon
              </span>
            </button>
          </div>

          {/* Buy Me a Coffee Option */}
          <a 
            href="https://buymeacoffee.com/your_username" // REPLACE WITH YOUR BMC LINK
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full py-4 rounded-xl flex items-center justify-between px-6 transition-transform hover:scale-[1.02] shadow-lg"
            style={{ backgroundColor: '#FFDD00', color: '#000000' }}
          >
            <div className="flex items-center gap-3">
              <Coffee size={24} />
              <div className="text-left">
                <p className="font-extrabold text-lg">Buy Me a Coffee</p>
                <p className="text-xs font-semibold opacity-70">Cards, Apple Pay, Google Pay</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded bg-black/10">
              International
            </span>
          </a>

        </div>
      </div>
    </div>
  );
}