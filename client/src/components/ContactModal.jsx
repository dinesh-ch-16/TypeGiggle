import { X, HelpCircle, MessageSquare, Bug, User, Briefcase, MoreHorizontal } from 'lucide-react';

export default function ContactModal({ isOpen, onClose, email = "contact.typegiggle@gmail.com" }) {
  if (!isOpen) return null;

  const options = [
    { 
      title: "Question", 
      icon: <HelpCircle size={20} />, 
      subject: "TypeGiggle - Question",
      body: "Hi TypeGiggle team,\n\nI have a question:\n\n" 
    },
    { 
      title: "Feedback", 
      icon: <MessageSquare size={20} />, 
      subject: "TypeGiggle - Feedback",
      body: "Hi TypeGiggle team,\n\nI have some feedback:\n\n" 
    },
    { 
      title: "Bug Report", 
      icon: <Bug size={20} />, 
      subject: "TypeGiggle - Bug Report",
      body: "Hi TypeGiggle team,\n\nI found a bug!\n\nWhat happened:\n\nSteps to reproduce:\n\nBrowser/Device:\n" 
    },
    { 
      title: "Account Help", 
      icon: <User size={20} />, 
      subject: "TypeGiggle - Account Help",
      body: "Hi TypeGiggle team,\n\nI need help with my account.\nMy username is: \n\nThe issue is:\n\n" 
    },
    { 
      title: "Business Inquiry", 
      icon: <Briefcase size={20} />, 
      subject: "TypeGiggle - Business Inquiry",
      body: "Hi TypeGiggle team,\n\nI am reaching out regarding a business opportunity.\n\n" 
    },
    { 
      title: "Other", 
      icon: <MoreHorizontal size={20} />, 
      subject: "TypeGiggle - General Inquiry",
      body: "Hi TypeGiggle team,\n\n" 
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
      <div 
        className="w-full max-w-2xl rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden"
        style={{ backgroundColor: 'var(--bg-color)' }}
      >
        <div className="p-8 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--main-color)' }}>Contact</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--sub-color)' }}>
              Feel free to send an email to <strong style={{ color: 'var(--text-color)' }}>{email}</strong>.<br/>
              Choose a topic below to open a pre-filled email in your browser.
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            style={{ color: 'var(--sub-color)' }}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((opt, index) => {
            const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(opt.subject)}&body=${encodeURIComponent(opt.body)}`;
            
            return (
              <a
                key={index}
                href={gmailLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setTimeout(onClose, 100)}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all text-left group cursor-pointer"
              >
                <div 
                  className="p-2 rounded-lg bg-black/30 group-hover:scale-110 transition-transform"
                  style={{ color: 'var(--main-color)' }}
                >
                  {opt.icon}
                </div>
                <span className="font-bold text-lg" style={{ color: 'var(--text-color)' }}>
                  {opt.title}
                </span>
              </a>
            );
          })}
        </div>

        <div className="p-6 pt-0 text-center">
          <p className="text-xs" style={{ color: 'var(--sub-color)' }}>
            Clicking a topic will open a new tab with the email pre-written.
          </p>
        </div>
      </div>
    </div>
  );
}