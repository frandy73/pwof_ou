import React from "react";
import { motion } from "motion/react";
import { User, Bot } from "lucide-react";
import { Message } from "../types";

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === "user";
  const text = message.parts[0].text;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full mb-6 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`flex max-w-[85%] md:max-w-[80%] gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        <div className={`flex-shrink-0 shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
          isUser ? "bg-blue-900" : "bg-red-600"
        }`}>
          <span className="text-white font-bold text-xs">
            {isUser ? "M" : "P"}
          </span>
        </div>
        
        <div 
          className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-colors duration-300 ${
            isUser 
              ? "bg-blue-600 text-white rounded-tr-none shadow-blue-600/20" 
              : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none"
          }`}
        >
          <div className="whitespace-pre-wrap">{text}</div>
        </div>
      </div>
    </motion.div>
  );
}
