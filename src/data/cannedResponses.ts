/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Contact, Message } from '../types';

// Helper function to get relative timestamps
export function getRelativeTimeStr(offsetMinutes: number): { timestamp: string, epoch: number } {
  const current = new Date();
  const target = new Date(current.getTime() - offsetMinutes * 60 * 1000);
  
  let hours = target.getHours();
  const minutes = target.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  
  return {
    timestamp: `${hours}:${minutesStr} ${ampm}`,
    epoch: target.getTime()
  };
}

export function getCurrentTimeStr(): { timestamp: string, epoch: number } {
  return getRelativeTimeStr(0);
}

export const CONTACTS_LIST: Contact[] = [
  {
    id: 'hamza-rahman',
    name: 'Hamza Rahman',
    role: 'Close Friend',
    initials: 'HR',
    avatarGradient: 'from-blue-600 to-indigo-500',
    email: 'hamza.rahman@devworkspace.org',
    location: 'Karachi, PK',
    isOnline: true,
    initialConversation: [
      {
        id: 'hamza-1',
        sender: 'partner',
        text: "Hey! Just pushed the latest React 19 updates to our feature branch.",
        ...getRelativeTimeStr(45),
        status: 'read'
      },
      {
        id: 'hamza-2',
        sender: 'user',
        text: "Nice job Hamza, let me run the lint command on my end to verify.",
        ...getRelativeTimeStr(30),
        status: 'read'
      },
      {
        id: 'hamza-3',
        sender: 'partner',
        text: "Perfect. Let me know if you hit any compilation issues.",
        ...getRelativeTimeStr(25),
        status: 'read'
      }
    ],
    smartTriggers: [
      {
        keywords: ['hello', 'hi', 'hey', 'greetings', 'salam', 'a salaam'],
        replies: [
          "Hello back!",
          "Hey! Hope your coding session is going well.",
          "Hi! What's up on your side today?"
        ]
      },
      {
        keywords: ['how are you', 'how is it going', 'how are you doing', 'how going'],
        replies: [
          "I'm fine, how about you?",
          "I'm doing well, working through some bugs. How's your day going?",
          "All good here! Just tweaking some responsive layouts."
        ]
      },
      {
        keywords: ['what are you doing today', 'doing today', 'what are you doing', 'what you doing'],
        replies: [
          "I am working, coding, etc. What about you?",
          "Just coding some new layout structures and debugging typings. What's on your schedule today?",
          "Debugging a minor state persistence bug. What are you up to?"
        ]
      },
      {
        keywords: ['code', 'typescript', 'react', 'git', 'bug', 'compile', 'build'],
        replies: [
          "Yes, just standard coding. Clean layouts make a big difference.",
          "TypeScript type safety saves so much time during major iterations.",
          "All builds compile green on my node chamber. Standard styling looks neat too!"
        ]
      }
    ],
    defaultReplies: [
      "Hello back!",
      "I'm fine.",
      "I am working, coding, etc.",
      "Sounds logical. Let's keep working on it."
    ],
    cannedRecommendations: [
      "Hello",
      "How are you?",
      "What are you doing today?",
      "Awesome work"
    ]
  },
  {
    id: 'zain-malik',
    name: 'Zain Malik',
    role: 'Close Friend',
    initials: 'ZM',
    avatarGradient: 'from-emerald-600 to-teal-500',
    email: 'zain.malik@vibecheck.net',
    location: 'Lahore, PK',
    isOnline: true,
    initialConversation: [
      {
        id: 'zain-1',
        sender: 'partner',
        text: "Oi! Are you free this weekend? We haven't caught up in ages.",
        ...getRelativeTimeStr(120),
        status: 'read'
      },
      {
        id: 'zain-2',
        sender: 'user',
        text: "Hey! Yes absolutely. We definitely need to hunt down some good food.",
        ...getRelativeTimeStr(90),
        status: 'read'
      },
      {
        id: 'zain-3',
        sender: 'partner',
        text: "Haha you read my mind! I've been craving some authentic street food or karahi lately.",
        ...getRelativeTimeStr(85),
        status: 'read'
      }
    ],
    smartTriggers: [
      {
        keywords: ['when can we meet', 'meet', 'when meet', 'catch up', 'when free', 'meet up'],
        replies: [
          "Let's meet tomorrow evening! Standard timing around 7:30 PM works best on my end.",
          "I'm free this Saturday afternoon. Maybe we can grab lunch at 1:30 PM?",
          "How about Sunday dinner? We can meet around 8:00 PM to beat the traffic!"
        ]
      },
      {
        keywords: ['where should we go to eat', 'where to eat', 'eat', 'food', 'restaurant', 'dinner', 'lunch', 'pakistani'],
        replies: [
          "We should absolutely go to Kolachi! Their Peshawari Karahi and grilled items on the sea view are unforgettable.",
          "How about Lal Qila? It has that fantastic traditional buffet and lovely Mughal-themed atmosphere.",
          "Let's check out Salt'n Pepper Village on the Beach. Their chicken handi and live barbecue timing setup is perfect for dinner.",
          "We could grab some quick Bun Kababs or go to Tikka House for authentic seekh kababs!"
        ]
      },
      {
        keywords: ['kolachi', 'lal qila', 'salt\'n pepper', 'tikka', 'karahi', 'restaurant list'],
        replies: [
          "Kolachi is top-notch! The sea breeze and the spices are unmatched. Let's book a table early.",
          "Lal Qila's mutton ribs and royal ambience are great. It opens at we can head there around 8 PM.",
          "Salt'n Pepper has amazing buffet spreads. Standard timing is 7:30 PM for the dinner slot.",
          "Tikka House is awesome if we want heavy spices and pure traditional dining!"
        ]
      },
      {
        keywords: ['time', 'timing', 'schedule', 'when', 'hour'],
        replies: [
          "Usually, 7:30 PM or 8:00 PM is prime timing for dinner to avoid the rush.",
          "Let's target Sunday afternoon around 2 PM if we go for a heavier lunch.",
          "Let me know what time works best for you and I'll block my calendar."
        ]
      },
      {
        keywords: ['hello', 'hi', 'hey', 'greetings', 'salam'],
        replies: [
          "A Salaam! Yo, what's up buddy?",
          "Hey there! Ready to plan our foodie adventure?",
          "Salam! Long time no see. How's life?"
        ]
      }
    ],
    defaultReplies: [
      "Let's meet tomorrow evening! Standard timing around 7:30 PM works best.",
      "We should absolutely go to Kolachi! Their Peshawari Karahi and grilled items on the sea view are unforgettable.",
      "How about Sunday dinner? We can meet around 8:00 PM.",
      "Awesome, sounds perfect. Drop the location and I'll see you there!"
    ],
    cannedRecommendations: [
      "When can we meet?",
      "Where should we go to eat?",
      "Let's go to Kolachi!",
      "What timing works?"
    ]
  }
];
