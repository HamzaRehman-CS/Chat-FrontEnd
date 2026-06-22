/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Phone, Video, Search, RotateCcw, Info, X, ChevronLeft } from 'lucide-react';
import { Contact } from '../types';

interface ChatHeaderProps {
  activeContact: Contact;
  onBackToContacts?: () => void;
  onToggleSearch: () => void;
  isSearchOpen: boolean;
  onResetChat: () => void;
  onToggleInfoPanel: () => void;
  isInfoPanelOpen: boolean;
  themeAccent: string;
}

export default function ChatHeader({
  activeContact,
  onBackToContacts,
  onToggleSearch,
  isSearchOpen,
  onResetChat,
  onToggleInfoPanel,
  isInfoPanelOpen,
  themeAccent,
}: ChatHeaderProps) {
  // Map color to small design elements
  const getAccentColor = () => {
    switch (themeAccent) {
      case 'emerald':
        return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-150';
      case 'rose':
        return 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-150';
      case 'amber':
        return 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-150';
      case 'indigo':
      default:
        return 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-150';
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-3.5 border-b border-neutral-250 dark:border-neutral-750 bg-white dark:bg-neutral-900 sticky top-0 z-20">
      {/* Contact Profile Metadata */}
      <div className="flex items-center gap-2">
        {onBackToContacts && (
          <button
            type="button"
            onClick={onBackToContacts}
            className="md:hidden p-2 -ml-2 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer mr-1"
            title="Back to contacts"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-3">
          {/* Contact Initial Avatar */}
          <div className="relative">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${activeContact.avatarGradient} text-white flex items-center justify-center font-semibold text-sm tracking-wider shadow-inner select-none`}>
              {activeContact.initials}
            </div>
            {/* Activity dot based on online status */}
            {activeContact.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-neutral-900 animate-pulse" />
            )}
          </div>

          <div>
            <h1 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 leading-tight">
              {activeContact.name}
            </h1>
            <p className="text-xs text-neutral-400 dark:text-neutral-505 select-none">
              {activeContact.role}
            </p>
          </div>
        </div>
      </div>

      {/* Action shortcuts */}
      <div className="flex items-center gap-1">
        {/* Simulated Phone Call */}
        <button
          type="button"
          className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          title="Demo Line Call"
          onClick={() => alert("Simulated System Call: Workspace communication is currently offline.")}
        >
          <Phone className="w-4 h-4" />
        </button>

        {/* Simulated Video Board */}
        <button
          type="button"
          className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          title="Demo Video Broadcast"
          onClick={() => alert("Simulated System Broadcast: High-definition peer pipeline offline.")}
        >
          <Video className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-neutral-200 dark:bg-neutral-750 mx-1" />

        {/* Toggle Search Bar */}
        <button
          type="button"
          onClick={onToggleSearch}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            isSearchOpen
              ? 'text-neutral-800 bg-neutral-100 dark:text-neutral-200 dark:bg-neutral-800'
              : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800'
          }`}
          title="Search this Conversation"
        >
          {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
        </button>

        {/* Reset Conversation */}
        <button
          type="button"
          onClick={onResetChat}
          className="p-2 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
          title="Reset Thread State"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Toggle Info Sidebar Drawer */}
        <button
          type="button"
          onClick={onToggleInfoPanel}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            isInfoPanelOpen
              ? 'text-neutral-800 bg-neutral-100 dark:text-neutral-200 dark:bg-neutral-800'
              : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800'
          }`}
          title="Show Thread Settings & Info"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
