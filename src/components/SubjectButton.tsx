import React from "react";
import { Subject } from "../types";
import { motion } from "motion/react";

interface SubjectButtonProps {
  subject: Subject;
  active: boolean;
  onClick: () => void;
}

export const SubjectButton: React.FC<SubjectButtonProps> = ({ subject, active, onClick }) => {
  const getIcon = (s: Subject) => {
    switch(s) {
      case 'Matematik': return '📐';
      case 'Chimi': return '🧪';
      case 'Fizik': return '⚡';
      case 'Istwa': return '🏛️';
      case 'Kreyòl': return '✍️';
      case 'Biyoloji': return '🧬';
      case 'Angle': return '🔤';
      case 'Fransè': return '🇫🇷';
      case 'Jewografi': return '🌍';
      default: return '📚';
    }
  };

  return (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-semibold text-left ${
        active 
          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm" 
          : "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
      }`}
    >
      <span className="text-lg">{getIcon(subject)}</span>
      {subject}
    </motion.button>
  );
}
