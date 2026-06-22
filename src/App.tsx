/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Paperclip, Smile } from 'lucide-react';
import ChatHeader from './components/ChatHeader';
import MessageItem from './components/MessageItem';
import SearchPanel from './components/SearchPanel';
import ConversationInfo from './components/ConversationInfo';
import ContactSidebar from './components/ContactSidebar';
import { Message, Contact } from './types';
import { CONTACTS_LIST, getCurrentTimeStr } from './data/cannedResponses';

const STORAGE_KEY = 'realtime_chat_workspace_history_v3';
const THEME_KEY = 'realtime_chat_theme_accent_v2';

export default function App() {
  const [messagesPerContact, setMessagesPerContact] = useState<{ [contactId: string]: Message[] }>({});
  const [activeContactId, setActiveContactId] = useState<string>('hamza-rahman');
  const [mobileShowList, setMobileShowList] = useState(true);

  // Input states
  const [inputText, setInputText] = useState('');
  const [themeAccent, setThemeAccent] = useState('indigo');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Hidden file input reference
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active contact info derived state
  const activeContact: Contact = CONTACTS_LIST.find((c) => c.id === activeContactId) || CONTACTS_LIST[0];
  const currentMessages = messagesPerContact[activeContactId] || [];

  // Load chat history & accent styling configurations
  useEffect(() => {
    const cachedHistory = localStorage.getItem(STORAGE_KEY);
    const initialMap: { [contactId: string]: Message[] } = {};
    
    // Build initial conversations mapped by contact ID
    CONTACTS_LIST.forEach((contact) => {
      initialMap[contact.id] = contact.initialConversation;
    });

    if (cachedHistory) {
      try {
        const parsed = JSON.parse(cachedHistory);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          // Standard dictionary map
          setMessagesPerContact({
            ...initialMap,
            ...parsed
          });
        } else if (Array.isArray(parsed)) {
          // Backward compatibility from flat lists
          setMessagesPerContact({
            ...initialMap,
            'hamza-rahman': parsed
          });
        } else {
          setMessagesPerContact(initialMap);
        }
      } catch (e) {
        setMessagesPerContact(initialMap);
      }
    } else {
      setMessagesPerContact(initialMap);
    }

    const cachedTheme = localStorage.getItem(THEME_KEY);
    if (cachedTheme) {
      setThemeAccent(cachedTheme);
    }
  }, []);

  // Sync state mutations to storage
  useEffect(() => {
    if (Object.keys(messagesPerContact).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messagesPerContact));
    }
  }, [messagesPerContact]);

  // Sync chosen workspace styling
  useEffect(() => {
    localStorage.setItem(THEME_KEY, themeAccent);
  }, [themeAccent]);

  // Push scroll-to-bottom upon message insertion
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isPartnerTyping]);

  // Accent mapping for workspace visuals
  const getAccentClass = (type: 'text' | 'bg' | 'border' | 'focus-ring') => {
    switch (themeAccent) {
      case 'emerald':
        if (type === 'text') return 'text-emerald-600';
        if (type === 'bg') return 'bg-emerald-600 hover:bg-emerald-700';
        if (type === 'border') return 'border-emerald-500';
        return 'focus:ring-emerald-500/30';
      case 'rose':
        if (type === 'text') return 'text-rose-600';
        if (type === 'bg') return 'bg-rose-600 hover:bg-rose-700';
        if (type === 'border') return 'border-rose-500';
        return 'focus:ring-rose-500/30';
      case 'amber':
        if (type === 'text') return 'text-amber-600';
        if (type === 'bg') return 'bg-amber-600 hover:bg-amber-700';
        if (type === 'border') return 'border-amber-500';
        return 'focus:ring-amber-500/30';
      case 'indigo':
      default:
        if (type === 'text') return 'text-indigo-600';
        if (type === 'bg') return 'bg-indigo-600 hover:bg-indigo-700';
        if (type === 'border') return 'border-indigo-500';
        return 'focus:ring-indigo-500/30';
    }
  };

  // Searching matcher implementation
  const filteredMessages = currentMessages.filter((msg) => {
    if (!searchQuery.trim()) return true;
    return msg.text.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getMatchCount = () => {
    if (!searchQuery.trim()) return 0;
    return filteredMessages.length;
  };

  // Re-seed conversation thread strictly for active contact
  const handleResetChat = () => {
    const confirmReset = window.confirm(
      `Are you sure you want to reset the conversation with ${activeContact.name}? This will restore original seed conversations.`
    );
    if (confirmReset) {
      setMessagesPerContact((prev) => ({
        ...prev,
        [activeContactId]: activeContact.initialConversation,
      }));
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const computeAutomatedResponse = (userText: string): string => {
    const formattedText = userText.toLowerCase();

    // Loop through current contact's specific triggers
    for (const trigger of activeContact.smartTriggers) {
      const isMatch = trigger.keywords.some((keyword) => formattedText.includes(keyword));
      if (isMatch) {
        const randomIndex = Math.floor(Math.random() * trigger.replies.length);
        return trigger.replies[randomIndex];
      }
    }

    // Attachment special logic
    if (formattedText.startsWith('📎') || formattedText.includes('attached') || formattedText.includes('file')) {
      return `Got the document! I'll read through this and get back to you with comments.`;
    }

    // Default reply pool fallback
    const defaults = activeContact.defaultReplies;
    const randomIndex = Math.floor(Math.random() * defaults.length);
    return defaults[randomIndex];
  };

  // Automated typing simulator
  const triggerPartnerReply = (triggeringUserText: string) => {
    setTimeout(() => {
      setMessagesPerContact((prev) => {
        const list = prev[activeContactId] || [];
        const index = list.length - 1;
        if (index >= 0 && list[index].sender === 'user') {
          const updated = [...list];
          updated[index] = { ...updated[index], status: 'delivered' };
          return { ...prev, [activeContactId]: updated };
        }
        return prev;
      });
    }, 400);

    setTimeout(() => {
      setMessagesPerContact((prev) => {
        const list = prev[activeContactId] || [];
        const index = list.length - 1;
        if (index >= 0 && list[index].sender === 'user') {
          const updated = [...list];
          updated[index] = { ...updated[index], status: 'read' };
          return { ...prev, [activeContactId]: updated };
        }
        return prev;
      });
      setIsPartnerTyping(true);
    }, 1100);

    const typingDuration = 1600 + Math.random() * 1200;
    setTimeout(() => {
      setIsPartnerTyping(false);
      const computedText = computeAutomatedResponse(triggeringUserText);
      const { timestamp, epoch } = getCurrentTimeStr();

      const responseMessage: Message = {
        id: `automated-${Date.now()}`,
        sender: 'partner',
        text: computedText,
        timestamp,
        epoch,
      };

      setMessagesPerContact((prev) => ({
        ...prev,
        [activeContactId]: [...(prev[activeContactId] || []), responseMessage],
      }));
    }, 1100 + typingDuration);
  };

  // Send trigger
  const handleSendMessage = (textToSend = inputText) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    const { timestamp, epoch } = getCurrentTimeStr();
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp,
      epoch,
      status: 'sending',
    };

    setMessagesPerContact((prev) => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), userMessage],
    }));

    setInputText('');
    setShowEmojiPicker(false);

    setTimeout(() => {
      setMessagesPerContact((prev) => {
        const list = prev[activeContactId] || [];
        const updated = list.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: 'sent' as const } : msg
        );
        return { ...prev, [activeContactId]: updated };
      });
    }, 250);

    triggerPartnerReply(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const label = `📎 ${file.name}`;
    e.target.value = '';

    const { timestamp, epoch } = getCurrentTimeStr();
    const fileMessage: Message = {
      id: `attachment-${Date.now()}`,
      sender: 'user',
      text: label,
      timestamp,
      epoch,
      status: 'sending',
    };

    setMessagesPerContact((prev) => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), fileMessage],
    }));

    setTimeout(() => {
      setMessagesPerContact((prev) => {
        const list = prev[activeContactId] || [];
        const updated = list.map((msg) =>
          msg.id === fileMessage.id ? { ...msg, status: 'sent' as const } : msg
        );
        return { ...prev, [activeContactId]: updated };
      });
    }, 250);

    triggerPartnerReply(label);
  };

  const popularEmojis = ['👍', '😊', '💡', '🔥', '📅', '📎', '💻', '💡', '🙌', '🚀', '⭐', '✔'];

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 flex flex-col items-center justify-center p-0 sm:p-4 text-neutral-800 dark:text-neutral-100 font-sans transition-colors duration-200">
      
      {/* Container Frame styling */}
      <div className="w-full max-w-5xl h-screen sm:h-[88vh] bg-white dark:bg-neutral-900 sm:rounded-3xl sm:shadow-2xl border-0 sm:border border-neutral-250 dark:sm:border-neutral-750 flex overflow-hidden relative">
        
        {/* Left contacts list sidebar - responsive layout toggle */}
        <div className={`${mobileShowList ? 'flex' : 'hidden'} md:flex w-full md:w-auto h-full shrink-0`}>
          <ContactSidebar
            contacts={CONTACTS_LIST}
            activeContactId={activeContactId}
            onSelectContact={(id) => {
              setActiveContactId(id);
              setMobileShowList(false);
              setSearchQuery('');
              setIsSearchOpen(false);
            }}
            messagesPerContact={messagesPerContact}
            themeAccent={themeAccent}
          />
        </div>

        {/* Right workspace chat module - responsive layout toggle */}
        <div className={`${!mobileShowList ? 'flex' : 'hidden'} md:flex flex-1 flex-col h-full min-w-0 bg-white dark:bg-neutral-900 justify-between`}>
          
          {/* Header */}
          <ChatHeader
            activeContact={activeContact}
            onBackToContacts={() => setMobileShowList(true)}
            onToggleSearch={() => {
              setIsSearchOpen(!isSearchOpen);
              setSearchQuery('');
            }}
            isSearchOpen={isSearchOpen}
            onResetChat={handleResetChat}
            onToggleInfoPanel={() => setIsInfoPanelOpen(!isInfoPanelOpen)}
            isInfoPanelOpen={isInfoPanelOpen}
            themeAccent={themeAccent}
          />

          {/* Collapsible search control widget */}
          <SearchPanel
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isOpen={isSearchOpen}
            matchCount={getMatchCount()}
          />

          {/* Chat scrolling log */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3 relative bg-neutral-50/40 dark:bg-neutral-950/20">
            
            {searchQuery.trim() !== '' && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 rounded-xl p-3 text-xs mb-3 flex items-center justify-between shadow-xs select-none">
                <span>
                  Filtering thread for: <strong>&ldquo;{searchQuery}&rdquo;</strong>. Showing matched messages only.
                </span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-amber-600 hover:text-amber-800 dark:text-amber-400 font-semibold cursor-pointer"
                >
                  Clear filter
                </button>
              </div>
            )}

            {/* Render message nodes */}
            <AnimatePresence initial={false}>
              {filteredMessages.map((msg) => (
                <MessageItem
                  key={msg.id}
                  message={msg}
                  searchQuery={searchQuery}
                  themeAccent={themeAccent}
                />
              ))}

              {/* Real-time typing loop placeholder */}
              {isPartnerTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="flex w-full justify-start mb-4 select-none"
                >
                  <div className="max-w-[70%]">
                    <p className="text-[10px] font-medium text-neutral-400 mb-1 px-1">
                      {activeContact.name} is typing...
                    </p>
                    <div className="bg-neutral-100 dark:bg-neutral-800 px-4 py-3 rounded-2xl rounded-tl-xs flex items-center gap-1.5 shadow-xs w-20 justify-center">
                      <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Action Footer controls */}
          <div className="border-t border-neutral-250 dark:border-neutral-750 bg-white dark:bg-neutral-900 px-4 py-3 space-y-3.5 relative z-10 shrink-0">
            
            {/* Quick action recommended reply options */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none scrollbar-none">
              <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 shrink-0 self-center">
                Suggest:
              </span>
              <div className="flex gap-2">
                {activeContact.cannedRecommendations.map((rec) => (
                  <button
                    key={rec}
                    onClick={() => handleSendMessage(rec)}
                    className="text-xs bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-neutral-600 dark:text-neutral-300 px-3 py-1.5 rounded-full border border-neutral-200/50 dark:border-neutral-750 font-medium transition-colors whitespace-nowrap cursor-pointer hover:shadow-2xs"
                  >
                    {rec}
                  </button>
                ))}
              </div>
            </div>

            {/* Hidden file selector */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelectionChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.svg,.xlsx,.ppt"
            />

            {/* Message input text elements styling */}
            <div className="flex items-end gap-2.5 relative">
              <div className="flex-1 bg-neutral-50 dark:bg-neutral-850 border border-neutral-250 dark:border-neutral-750 rounded-2xl px-3.5 py-1.5 flex items-end gap-2 focus-within:ring-1 focus-within:ring-indigo-500/20 focus-within:border-neutral-400 transition-all">
                
                {/* Simulated file attachments */}
                <button
                  type="button"
                  onClick={handleFileUploadClick}
                  className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors shrink-0 cursor-pointer animate-pulse"
                  title="Attach workspace file"
                >
                  <Paperclip className="w-4.5 h-4.5" />
                </button>

                {/* Growable input bar */}
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Write a reply to ${activeContact.name}...`}
                  className="flex-1 text-sm bg-transparent border-0 focus:outline-none placeholder-neutral-400 max-h-24 min-h-[36px] items-center self-center py-2 resize-none text-neutral-800 dark:text-neutral-100 leading-relaxed outline-hidden"
                  rows={1}
                />

                {/* Emoji popover trigger */}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`p-1.5 transition-colors cursor-pointer ${
                      showEmojiPicker
                        ? getAccentClass('text')
                        : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
                    }`}
                    title="Insert emoji characters"
                  >
                    <Smile className="w-4.5 h-4.5" />
                  </button>

                  {/* Built-in simple emoji picker */}
                  <AnimatePresence>
                    {showEmojiPicker && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 15 }}
                        className="absolute bottom-11 right-0 bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 p-2 rounded-xl shadow-lg grid grid-cols-4 gap-1.5 w-36 z-50 text-base"
                      >
                        {popularEmojis.map((em) => (
                          <button
                            key={em}
                            type="button"
                            onClick={() => setInputText((prev) => prev + em)}
                            className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-750 rounded-lg text-center transition-colors cursor-pointer active:scale-95"
                          >
                            {em}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Submit triggers button */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className={`p-3.5 rounded-2xl text-white font-medium shadow-sm transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                  inputText.trim()
                    ? `${getAccentClass('bg')} active:scale-95`
                    : 'bg-neutral-200 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600 pointer-events-none'
                }`}
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible profile details panel */}
        <ConversationInfo
          isOpen={isInfoPanelOpen}
          onClose={() => setIsInfoPanelOpen(false)}
          themeAccent={themeAccent}
          setThemeAccent={setThemeAccent}
          messages={currentMessages}
          activeContact={activeContact}
        />
      </div>
    </div>
  );
}
