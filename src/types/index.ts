// Type definitions for Mindful Me app

export interface EmotionEntry {
  id: string;
  emotion: string;
  intensity: number;
  trigger?: string;
  timestamp: Date;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  timestamp: Date;
  wordCount: number;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  emotion?: string;
  intensity?: number;
  timestamp: Date;
}

export interface MindfulnessExercise {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  type: 'breathing' | 'meditation' | 'grounding';
  icon?: string;
  instructions: string[];
  completed?: boolean;
}

export type EmotionType = 'happy' | 'sad' | 'angry' | 'anxious' | 'calm' | 'stressed' | 'overwhelmed' | 'excited';

export type AppSection = 'chat' | 'emotions' | 'mindfulness' | 'journal' | 'emergency' | 'settings' | 'mbti';