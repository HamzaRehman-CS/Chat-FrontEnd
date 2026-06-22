/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User2, Mail, MapPin, Sparkles, FolderIcon, ChevronRight } from 'lucide-react';
import { Contact, Message } from '../types';

interface ConversationInfoProps {
  isOpen: boolean;
  onClose: () => void;
  themeAccent: string;
  setThemeAccent: (accent: string) => void;
  messages: Message[];
  activeContact: Contact;
}

export default function ConversationInfo({
  isOpen,
  onClose,
  themeAccent,
  setThemeAccent,
  messages,
  activeContact,
}: ConversationInfoProps) {
  // Extract attachment messages
  const attachmentMessages = messages.filter((msg) => msg.text.startsWith('📎 '));

  const accents = [
    { id: 'indigo', name: 'Indigo Sleek', colorBg: 'bg-indigo-600' },
    { id: 'emerald', name: 'Emerald Mint', colorBg: 'bg-emerald-600' },
    { id: 'rose', name: 'Rose Quartz', colorBg: 'bg-rose-600' },
    { id: 'amber', name: 'Amber Core', colorBg: 'bg-amber-600' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="w-full sm:w-80 h-full border-l border-neutral-250 dark:border-neutral-750 bg-neutral-50 dark:bg-neutral-900 flex flex-col z-35 relative shrink-0"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-250 dark:border-neutral-750 bg-white dark:bg-neutral-900">
            <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 uppercase tracking-wider">
              Profile &amp; Settings
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-neutral-150 dark:hover:bg-neutral-800 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Minimalist Profile Card */}
            <div className="flex flex-col items-center text-center pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${activeContact.avatarGradient} text-white flex items-center justify-center font-semibold text-2xl tracking-wider shadow-md mb-3 select-none`}>
                {activeContact.initials}
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {activeContact.name}
              </h3>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-1">
                {activeContact.role}
              </p>
              <p className="text-[10px] uppercase font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded">
                Workspace Contact
              </p>
            </div>

            {/* Custom Theme selection */}
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Workspace Accents
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {accents.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => setThemeAccent(acc.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs border text-left transition-all cursor-pointer ${
                      themeAccent === acc.id
                        ? 'bg-white dark:bg-neutral-850 border-neutral-350 dark:border-neutral-650 shadow-xs font-medium text-neutral-900 dark:text-white'
                        : 'border-transparent text-neutral-500 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/40'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${acc.colorBg} shrink-0 shadow-xs`} />
                    <span className="truncate">{acc.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Information Block */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                <User2 className="w-3.5 h-3.5" /> Member Details
              </h4>
              <div className="space-y-3.5 bg-white dark:bg-neutral-850 p-3 rounded-2xl border border-neutral-200/50 dark:border-neutral-750 text-xs">
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-neutral-400 select-none block text-[10px]">Email Address</span>
                    <span className="text-neutral-700 dark:text-neutral-300 select-all font-mono break-all">
                      {activeContact.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-neutral-400 select-none block text-[10px]">Office Hub</span>
                    <span className="text-neutral-700 dark:text-neutral-300 select-all">
                      {activeContact.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Shared Attachments list */}
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                <FolderIcon className="w-3.5 h-3.5" /> Shared Documents ({attachmentMessages.length})
              </h4>

              {attachmentMessages.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 p-5 text-center text-xs text-neutral-450 dark:text-neutral-650 select-none bg-neutral-100/50 dark:bg-neutral-850/20">
                  No files shared yet in this workspace thread.
                </div>
              ) : (
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {attachmentMessages.map((msg) => {
                    const fileName = msg.text.replace('📎 ', '');
                    return (
                      <div
                        key={msg.id}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/40 dark:border-neutral-750 cursor-pointer text-xs justify-between group"
                        onClick={() => {
                          const element = document.getElementById(`msg-${msg.id}`);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        }}
                        title="Focus file bubble"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-neutral-500 text-xs shrink-0">📎</span>
                          <span className="text-neutral-700 dark:text-neutral-300 font-medium truncate">
                            {fileName}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-400 font-mono shrink-0 group-hover:text-indigo-500 flex items-center transition-colors">
                          View <ChevronRight className="w-3 h-3 ml-0.5" />
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
