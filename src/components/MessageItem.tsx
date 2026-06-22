/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Check, CheckCheck, FileText, Download } from 'lucide-react';
import { Message } from '../types';

interface MessageItemProps {
  key?: React.Key;
  message: Message;
  searchQuery: string;
  themeAccent: string;
}

export default function MessageItem({ message, searchQuery, themeAccent }: MessageItemProps) {
  const isUser = message.sender === 'user';

  // Accent color mapping for the active theme
  const getAccentBg = () => {
    switch (themeAccent) {
      case 'emerald':
        return 'bg-emerald-600 text-white';
      case 'rose':
        return 'bg-rose-600 text-white';
      case 'amber':
        return 'bg-amber-600 text-white';
      case 'indigo':
      default:
        return 'bg-indigo-600 text-white';
    }
  };

  // Helper to escape special regex chars to avoid crash on partial typing
  const escapeRegExp = (str: string) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Helper to render message text highlighting searched terms
  const renderMessageText = (text: string) => {
    if (!searchQuery.trim()) {
      return text;
    }

    try {
      const escaped = escapeRegExp(searchQuery);
      const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
      return parts.map((part, i) =>
        part.toLowerCase() === searchQuery.toLowerCase() ? (
          <mark key={i} className="bg-yellow-250 text-neutral-900 font-medium px-0.5 rounded-sm">
            {part}
          </mark>
        ) : (
          part
        )
      );
    } catch (e) {
      return text;
    }
  };

  // Check if text indicates a simulated attachment
  const isAttachment = message.text.startsWith('📎 ');
  const attachmentName = isAttachment ? message.text.replace('📎 ', '') : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      layout
      className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
      id={`msg-${message.id}`}
    >
      <div className={`max-w-[85%] sm:max-w-[70%] flex flex-col`}>
        {/* Author Label (only on larger screen or subtle header if wanted, let's keep it minimalist and clean) */}
        <div
          className={`text-[10px] font-medium tracking-wide text-neutral-400 mb-1 px-1 flex items-center gap-1 ${
            isUser ? 'justify-end' : 'justify-start'
          }`}
        >
          <span>{isUser ? 'You' : 'Morgan Lee'}</span>
        </div>

        {/* Message bubble */}
        <div
          className={`relative px-4 py-3 rounded-2xl shadow-xs text-sm leading-relaxed transition-colors duration-200 ${
            isUser
              ? `${getAccentBg()} rounded-tr-xs`
              : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100 rounded-tl-xs'
          }`}
        >
          {isAttachment ? (
            <div className="flex items-center gap-3 pr-2 py-1">
              <div className={`p-2 rounded-lg ${isUser ? 'bg-white/10' : 'bg-neutral-200 dark:bg-neutral-700'}`}>
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-xs truncate">{attachmentName}</p>
                <p className="text-[10px] opacity-75">Simulated attachment • 1.4 MB</p>
              </div>
              <button
                type="button"
                className={`p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer`}
                title="Download simulated file"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <p className="whitespace-pre-wrap breakdown-words">{renderMessageText(message.text)}</p>
          )}

          {/* Timestamp and feedback icons */}
          <div
            className={`flex items-center gap-1.5 text-[10px] justify-end mt-1.5 select-none ${
              isUser ? 'text-white/75' : 'text-neutral-400 dark:text-neutral-500'
            }`}
          >
            <span className="font-mono">{message.timestamp}</span>
            {isUser && (
              <span className="flex items-center">
                {message.status === 'sending' && (
                  <span className="w-1.5 h-1.5 rounded-full border border-current border-t-transparent animate-spin inline-block" />
                )}
                {message.status === 'sent' && (
                  <Check className="w-3.5 h-3.5 opacity-80" />
                )}
                {message.status === 'delivered' && (
                  <CheckCheck className="w-3.5 h-3.5 opacity-80" />
                )}
                {message.status === 'read' && (
                  <CheckCheck className="w-3.5 h-3.5 text-blue-300" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
