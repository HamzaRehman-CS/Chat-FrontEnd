/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, MessageSquare, Compass, Sliders, LogOut } from 'lucide-react';
import { Contact, Message } from '../types';

interface ContactSidebarProps {
  contacts: Contact[];
  activeContactId: string;
  onSelectContact: (contactId: string) => void;
  messagesPerContact: { [contactId: string]: Message[] };
  themeAccent: string;
}

export default function ContactSidebar({
  contacts,
  activeContactId,
  onSelectContact,
  messagesPerContact,
  themeAccent,
}: ContactSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Accent mapping for borders or background indicators
  const getAccentBg = () => {
    switch (themeAccent) {
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500';
      case 'rose':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500';
      case 'amber':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500';
      case 'indigo':
      default:
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500';
    }
  };

  const getAccentText = () => {
    switch (themeAccent) {
      case 'emerald':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'rose':
        return 'text-rose-600 dark:text-rose-400';
      case 'amber':
        return 'text-amber-600 dark:text-amber-400';
      case 'indigo':
      default:
        return 'text-indigo-600 dark:text-indigo-400';
    }
  };

  // Filter contacts by name or role matches
  const filteredContacts = contacts.filter((contact) => {
    const q = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(q) ||
      contact.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full md:w-80 h-full border-r border-neutral-250 dark:border-neutral-750 bg-neutral-50 dark:bg-neutral-900 flex flex-col shrink-0">
      
      {/* Brand & Workspace Title */}
      <div className="px-4 py-[15px] border-b border-neutral-250 dark:border-neutral-750 bg-white dark:bg-neutral-900 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-neutral-950 dark:bg-neutral-800 text-white flex items-center justify-center shadow-xs">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 leading-tight">
            My Chat
          </h2>
        </div>
      </div>

      {/* Dynamic Member Search Bar block */}
      <div className="p-3 border-b border-neutral-200/50 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/30">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400 transition-colors">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search discussion threads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-750 rounded-xl text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500/30 transition-all focus:bg-white dark:focus:bg-neutral-900"
          />
        </div>
      </div>

      {/* Main List of Contacts */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-3 py-2">
          Direct Messages
        </p>

        {filteredContacts.length === 0 ? (
          <div className="text-center py-8 px-4 text-xs text-neutral-450 dark:text-neutral-505 select-none">
            No contacts match &ldquo;{searchQuery}&rdquo;
          </div>
        ) : (
          filteredContacts.map((contact) => {
            const isActive = contact.id === activeContactId;
            const itemMessages = messagesPerContact[contact.id] || [];
            const lastMessage = itemMessages[itemMessages.length - 1];

            return (
              <button
                key={contact.id}
                onClick={() => onSelectContact(contact.id)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all relative cursor-pointer group ${
                  isActive
                    ? `${getAccentBg()} border-l-3`
                    : 'border-l-3 border-transparent hover:bg-neutral-200/40 dark:hover:bg-neutral-800/40 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {/* Profile Circle Avatar */}
                <div className="relative shrink-0 select-none">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${contact.avatarGradient} text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-inner`}>
                    {contact.initials}
                  </div>
                  {/* Presence indicator */}
                  {contact.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-neutral-900 animate-pulse" />
                  )}
                </div>

                {/* Name, Snippet and Meta info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 truncate pr-1">
                      {contact.name}
                    </span>
                    {lastMessage && (
                      <span className="text-[9px] font-mono text-neutral-400 shrink-0">
                        {lastMessage.timestamp}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className={`text-[11px] truncate ${isActive ? 'text-neutral-800 dark:text-neutral-205 font-medium' : 'text-neutral-450 dark:text-neutral-505 font-normal'}`}>
                      {lastMessage
                        ? lastMessage.text.startsWith('📎 ')
                          ? `📎 Document Attachment`
                          : lastMessage.text
                        : contact.role}
                    </p>
                    
                    {/* Unread dot or tiny icon indicator */}
                    {!isActive && contact.isOnline && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block shrink-0" />
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Minimal clean spacer */}
      <div className="h-4 bg-transparent shrink-0" />
    </div>
  );
}
