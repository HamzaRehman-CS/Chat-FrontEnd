/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X } from 'lucide-react';

interface SearchPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isOpen: boolean;
  matchCount: number;
}

export default function SearchPanel({ searchQuery, setSearchQuery, isOpen, matchCount }: SearchPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-neutral-50 dark:bg-neutral-850 border-b border-neutral-200 dark:border-neutral-750 overflow-hidden"
        >
          <div className="px-4 py-2.5 flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search words in this chat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-750 rounded-xl text-xs text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Match Counter Display */}
            {searchQuery.trim() !== '' && (
              <div className="text-[11px] font-mono text-neutral-500 whitespace-nowrap bg-neutral-150 dark:bg-neutral-850 px-2 py-1 rounded-sm">
                {matchCount === 0 ? 'No matches' : `${matchCount} ${matchCount === 1 ? 'match' : 'matches'}`}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
