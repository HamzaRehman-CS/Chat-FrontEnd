/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Message {
  id: string;
  sender: 'user' | 'partner';
  text: string;
  timestamp: string; // Formatting e.g. "10:14 AM"
  epoch: number; // For sorting and storage
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface SmartResponseTrigger {
  keywords: string[];
  replies: string[];
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarGradient: string;
  email: string;
  location: string;
  isOnline: boolean;
  initialConversation: Message[];
  smartTriggers: SmartResponseTrigger[];
  defaultReplies: string[];
  cannedRecommendations: string[];
}

