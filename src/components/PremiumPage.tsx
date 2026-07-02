import React from "react";
import { motion } from "motion/react";
import { Crown, Check, ArrowLeft, Smartphone, BookOpen, Sparkles, Infinity, MessageCircle } from "lucide-react";

interface PremiumPageProps {
  onBack: () => void;
  isDarkMode: boolean;
}

const BENEFITS = [
  "Kesyon san limit — pa gen baryè chak jou",
  "Egzèsis korije ak eksplikasyon detaye",
  "Similasyon Egzamen Leta ak nòt otomatik",
  "Estatistik avansman pèsonèl ou",
  "Repons pi vit ak modèl AI premium",
  "Aksè nan tout matyè san restriksyon"
];

const STEPS = [
  {
    icon: Smartphone,
    title: "1. Open Mon Cash",
    desc: "Louvri aplikasyon Mon Cash ou oswa konpoze *155#"
  },
  {
    icon: MessageCircle,
    title: "2. Chwazi \"Transfert\"",
    desc: "Chwazi opsyon transfert lajan an"
  },
  {
    icon: BookOpen,
    title: "3. Antre enfòmasyon yo",
    desc: "Nimewo: 509 34 45 9601 /* Non Konplè */ Montant: 1000 Gdes"
  },
  {
    icon: Check,
    title: "4. Konfime epi voye",
    desc: "Verifie enfòmasyon yo epi konfime."
  }
];

export const PremiumPage: React.FC<PremiumPageProps> = ({ onBack, isDarkMode }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <nav className="h-16 bg-blue-900 dark:bg-slate-900 text-white flex items-center justify-between px-6 shrink-0 shadow-md z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-blue-200 hover:text-white hover:bg-blue-800 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-bold text-xl ring-2 ring-white/20 italic">P</div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Pwof Ou Ayiti Premium</h1>
            <p className="text-[10px] text-blue-200 dark:text-slate-400 uppercase tracking-widest font-semibold">Plan Premium</p>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-lg shadow-yellow-500/30 mx-auto"
          >
            <Crown size={40} className="text-white" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold">Pwoteje Avansman Ou</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
			Jwenn aksè san limit nan tout karateristik AI Pwof Ou Ayiti a epi prepare w byen pou egzamen w yo.
          </p>
        </div>

        {/* Pricing Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="relative max-w-md mx-auto"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-3xl blur-xl opacity-30" />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-[10px] font-bold uppercase px-4 py-1 rounded-full tracking-wider">
                  Pi popilè
            </div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Plan Mansyèl</p>
            <div className="flex items-baseline justify-center gap-1 mb-6">
              <span className="text-5xl font-black">1,000</span>
              <span className="text-lg font-semibold text-slate-400">Gdes</span>
            </div>
            <p className="text-xs text-slate-400 mb-6">pa mwa • anile nenpòt lè</p>

            <ul className="text-left space-y-3 mb-8">
              {BENEFITS.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <Check size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* How to Pay */}
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-bold text-center mb-6 flex items-center justify-center gap-2">
            <Smartphone size={22} className="text-yellow-500" />
            Kouman Peye ak Mon Cash
          </h3>
          <div className="space-y-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * i }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex gap-4 shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 flex items-center justify-center shrink-0">
                  <step.icon size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">{step.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* After Payment */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-md mx-auto bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6 text-center"
        >
          <Sparkles size={24} className="text-blue-500 mx-auto mb-2" />
          <h4 className="font-bold text-sm mb-1">Apre Paiement an?</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Voye yon foto resi a nan nimewo WhatsApp <strong>509 34 45 9601</strong> 
            epi n ap aktive kont premium ou anndan 24 èdtan.
          </p>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-[10px] text-slate-400 dark:text-slate-600 pb-4">
          Pwof Ou Ayiti © {new Date().getFullYear()} — Tout Dwa Rezève
        </p>
      </div>
    </div>
  );
};
