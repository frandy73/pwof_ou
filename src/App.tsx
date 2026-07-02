import React, { useState, useRef, useEffect } from "react";
import { Send, GraduationCap, BookOpen, Trash2, Loader2, Sparkles, Bot, Moon, Sun, Download, ChevronDown, Crown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ChatBubble } from "./components/ChatBubble";
import { SubjectButton } from "./components/SubjectButton";
import { PremiumPage } from "./components/PremiumPage";
import { Message, Subject } from "./types";
import { sendMessage, sendMessageStream } from "./lib/api";

const SUBJECTS: Subject[] = [
  'Tout', 'Matematik', 'Fizik', 'Chimi', 'Biyoloji', 'Angle', 'Kreyòl', 'Fransè', 'Istwa', 'Jewografi'
];

export default function App() {
  const WELCOME_MESSAGE: Message = {
    role: 'model',
    parts: [{ text: "Bonjou! Mwen se Pwof Ou Ayiti. Mwen la pou m ede w prepare egzamen 9ème AF oswa Bacc ou. Sou ki sa ou ta renmen nou travay jodi a?" }]
  };

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chat_messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return [WELCOME_MESSAGE];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeSubject, setActiveSubject] = useState<Subject>('Tout');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });
  const [mobileSubjectOpen, setMobileSubjectOpen] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    checkInstalled();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstalled(true);
    }
  };

  useEffect(() => {
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      parts: [{ text: input }]
    };

    const prompt = activeSubject !== 'Tout'
      ? `[Sijè: ${activeSubject}] ${input}`
      : input;

    const history = [...messages];
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    await sendMessageStream(
      prompt,
      history,
      (chunk) => {
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last.role !== 'model') return [...prev, { role: 'model', parts: [{ text: chunk }] }];
          const updated: Message = { ...last, parts: [{ text: last.parts[0].text + chunk }] };
          return [...prev.slice(0, -1), updated];
        });
      },
      () => setIsLoading(false),
      (error) => {
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last.role === 'model' && last.parts[0].text === '') {
            const updated: Message = { ...last, parts: [{ text: error }] };
            return [...prev.slice(0, -1), updated];
          }
          return [...prev, { role: 'model', parts: [{ text: error }] }];
        });
        setIsLoading(false);
      }
    );
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    localStorage.removeItem('chat_messages');
  };

  const handleExerciseRequest = async () => {
    if (isLoading) return;

    const subject = activeSubject === 'Tout' ? 'jeneral' : activeSubject;
    const text = `Ban m yon egzèsis sou ${subject} tankou sa yo bay nan Egzamen Leta.`;
    const userMessage: Message = { role: 'user', parts: [{ text }] };

    const prompt = activeSubject !== 'Tout'
      ? `[Sijè: ${activeSubject}] ${text}`
      : text;

    const history = [...messages];
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    await sendMessageStream(
      prompt,
      history,
      (chunk) => {
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last.role !== 'model') return [...prev, { role: 'model', parts: [{ text: chunk }] }];
          const updated: Message = { ...last, parts: [{ text: last.parts[0].text + chunk }] };
          return [...prev.slice(0, -1), updated];
        });
      },
      () => setIsLoading(false),
      (error) => {
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last.role === 'model' && last.parts[0].text === '') {
            const updated: Message = { ...last, parts: [{ text: error }] };
            return [...prev.slice(0, -1), updated];
          }
          return [...prev, { role: 'model', parts: [{ text: error }] }];
        });
        setIsLoading(false);
      }
    );
  };

  if (showPremium) {
    return <PremiumPage onBack={() => setShowPremium(false)} isDarkMode={isDarkMode} />;
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 overflow-hidden transition-colors duration-300">
      {/* Top Navigation Bar */}
      <nav className="h-16 bg-blue-900 dark:bg-slate-900 text-white flex items-center justify-between px-6 shrink-0 shadow-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-bold text-xl ring-2 ring-white/20 italic">P</div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Pwof Ou Ayiti</h1>
            <p className="text-[10px] text-blue-200 dark:text-slate-400 uppercase tracking-widest font-semibold">Asistan Edikatif Nasyonal</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!isInstalled && deferredPrompt && (
            <button 
              onClick={handleInstall}
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Enstale App</span>
            </button>
          )}
          <button
            onClick={() => setShowPremium(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg text-xs font-bold transition-all shadow-lg shadow-yellow-500/20 active:scale-95"
          >
            <Crown size={14} />
            <span className="hidden sm:inline">Premium</span>
          </button>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-blue-200 hover:text-white hover:bg-blue-800 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title={isDarkMode ? "Limyè" : "Nwa"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {/* Mobile Subject Dropdown */}
          <div className="relative lg:hidden">
            <button
              onClick={() => setMobileSubjectOpen(!mobileSubjectOpen)}
              className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-blue-200 hover:text-white transition-colors"
            >
              {activeSubject}
              <ChevronDown size={14} className={`transition-transform ${mobileSubjectOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileSubjectOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMobileSubjectOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                  {SUBJECTS.map(subject => (
                    <button
                      key={subject}
                      onClick={() => { setActiveSubject(subject); setMobileSubjectOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        activeSubject === subject
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <button 
            onClick={clearChat}
            className="p-2 text-blue-200 hover:text-white hover:bg-blue-800 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Efase konvèsasyon"
          >
            <Trash2 size={20} />
          </button>
          <div className="w-10 h-10 rounded-full bg-blue-700 border-2 border-blue-400 flex items-center justify-center font-semibold">
            EL
          </div>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: Subjects */}
        <aside className="hidden lg:flex w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col p-6 overflow-y-auto no-scrollbar transition-colors duration-300">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Matyè yo</h2>
          <div className="space-y-1 mb-8">
            {SUBJECTS.map((subject) => (
              <SubjectButton
                key={subject}
                subject={subject}
                active={activeSubject === subject}
                onClick={() => setActiveSubject(subject)}
              />
            ))}
          </div>

          {(() => {
            const EXAM_DATE = new Date(2026, 5, 15);
            const now = new Date();
            const total = EXAM_DATE.getTime() - new Date(2025, 8, 1).getTime();
            const elapsed = now.getTime() - new Date(2025, 8, 1).getTime();
            const pct = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
            const diff = Math.ceil((EXAM_DATE.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            const days = diff > 0 ? diff : 0;
            return (
              <>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Objektif Egzamen</h2>
                <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl p-4 text-white mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-blue-400 uppercase">Bacc 2026</span>
                    <span className="text-xs">{days} Jou rès</span>
                  </div>
                  <div className="w-full bg-slate-700 dark:bg-slate-800 h-2 rounded-full mb-3">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-80 italic">"Travay di se kle siksè."</p>
                </div>
              </>
            );
          })()}

          <div className={`mt-auto p-3 rounded-xl border flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${
            isInstalled 
              ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400" 
              : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400"
          }`}>
            {isInstalled ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ✓ Aplikasyon Instale
              </>
            ) : (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                Vèsyon Web
              </>
            )}
          </div>
        </aside>

        {/* Main Interface */}
        <main className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-950 p-4 md:p-6 gap-6 overflow-hidden transition-colors duration-300">
          {/* Active Lesson Header */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 md:p-5 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm transition-colors duration-300">
            <div>
              <h3 className="font-bold text-lg md:text-xl text-slate-800 dark:text-slate-100">
                {activeSubject === 'Tout' ? 'Konvèsasyon Jeneral' : `Revizyon: ${activeSubject}`}
              </h3>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                {activeSubject === 'Tout' 
                  ? 'Pratik pou Egzamen Leta (9ème AF / Bacc)' 
                  : `Egzèsis tip Egzamen Leta • ${activeSubject}`}
              </p>
            </div>
            <button
              onClick={handleExerciseRequest}
              disabled={isLoading}
              className="hidden sm:block px-4 py-2 bg-blue-900 dark:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mande yon Egzèsis
            </button>
          </div>

          {/* AI Conversation Area */}
          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-sm transition-colors duration-300">
            <div 
              ref={scrollRef}
              className="flex-1 p-4 md:p-6 overflow-y-auto"
            >
              <div className="space-y-2">
                {messages.map((msg, idx) => (
                  <ChatBubble key={idx} message={msg} />
                ))}
                
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-4 mb-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shrink-0 shadow-md">
                      <span className="text-white font-bold text-xs animate-pulse">P</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-2 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm italic transition-colors duration-300">
                      <Loader2 size={16} className="animate-spin text-red-500" />
                      Pwof la ap reflechi...
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex gap-3 transition-colors duration-300">
              <button className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors shrink-0">
                <BookOpen size={20} />
              </button>
              <div className="flex-1 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 flex items-center px-4 focus-within:border-blue-500 transition-colors">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSend();
                    }
                  }}
                  placeholder="Poze yon kesyon oswa bay yon repons..." 
                  className="w-full text-sm outline-none bg-transparent py-3 dark:text-slate-100"
                />
              </div>
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                  input.trim() && !isLoading
                    ? "bg-blue-900 dark:bg-blue-700 text-white shadow-lg shadow-blue-900/30"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                }`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </main>

        {/* Right Panel: Context */}
        <aside className="hidden xl:flex w-72 bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 flex-col gap-6 overflow-y-auto no-scrollbar transition-colors duration-300">
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Dènye Leson yo</h2>
            <div className="space-y-3">
              <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex gap-3 transition-colors duration-300">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center font-bold text-xs shrink-0">H</div>
                <div>
                  <p className="text-xs font-bold dark:text-slate-200">Batay Vètyè</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Istwa • 15 min de sa</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex gap-3 transition-colors duration-300">
                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-xs shrink-0">F</div>
                <div>
                  <p className="text-xs font-bold dark:text-slate-200">Lwa Ohm yo</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Fizik • 2 èdtan de sa</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-end">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl p-4 shadow-sm transition-colors duration-300">
              <h4 className="text-red-700 dark:text-red-400 font-bold text-sm mb-2 flex items-center gap-2">
                <Sparkles size={16} className="text-red-500" /> Alèt Revizyon
              </h4>
              <p className="text-[11px] text-red-600 dark:text-red-300 leading-relaxed mb-3">
                Ou gen 2 jou depi ou pa fè egzèsis sou Chimi. Pa kite sa dèyè!
              </p>
              <button 
                onClick={() => setActiveSubject('Chimi')}
                className="w-full py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg text-xs font-bold shadow-md shadow-red-600/20 active:scale-95 transition-transform"
              >
                Kòmanse Kounye a
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
