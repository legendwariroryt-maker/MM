import { useSyncExternalStore } from "react";
import { ChatMessage } from "@/types";

export interface ChatState {
  messages: ChatMessage[];
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>;
  sessionActive: boolean;
  selectedEmotion: string;
  intensity: number | null;
  userMessage: string;
  apiStatus: string;
  personalityType: string;
  hasUserSentMessage: boolean;
  currentConversationId: string | null;
  isTemporary: boolean;
}

const initialMessage: ChatMessage = {
  id: "1",
  type: "ai",
  message:
    "Hello there! I'm Sir Hootington, your wise owl companion. 🦉\nI'm here to listen and support you. How are you feeling today?",
  timestamp: new Date(),
};

let state: ChatState = {
  messages: [initialMessage],
  conversationHistory: [],
  sessionActive: true,
  selectedEmotion: "",
  intensity: null,
  userMessage: "",
  apiStatus: "ready",
  personalityType: "",
  hasUserSentMessage: false,
  currentConversationId: null,
  isTemporary: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const chatStore = {
  getState: () => state,
  setState(partial: Partial<ChatState> | ((s: ChatState) => Partial<ChatState>)) {
    const next = typeof partial === "function" ? partial(state) : partial;
    state = { ...state, ...next };
    emit();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  reset() {
    state = {
      messages: [initialMessage],
      conversationHistory: [],
      sessionActive: true,
      selectedEmotion: "",
      intensity: null,
      userMessage: "",
      apiStatus: "ready",
      personalityType: state.personalityType,
      hasUserSentMessage: false,
      currentConversationId: null,
      isTemporary: state.isTemporary,
    };
    emit();
  },
};

export function useChatStore<T>(selector: (s: ChatState) => T): T {
  return useSyncExternalStore(
    chatStore.subscribe,
    () => selector(chatStore.getState()),
    () => selector(chatStore.getState()),
  );
}