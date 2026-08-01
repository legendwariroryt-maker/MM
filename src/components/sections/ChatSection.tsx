// Chat Section - Integrated with Groq cloud AI with session summary feature
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react";
import { chatStore, useChatStore } from "@/stores/chatStore";
import { useThemeAvatar } from "@/lib/themeAvatars";
import sirHootingtonImg from "@/assets/sir-hootington-sitting.png";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, History, Ghost, Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ConversationSummary {
  id: string;
  title: string;
  updated_at: string;
}

// Emotion categories
const emotions = [
  { name: 'Happy', emoji: '😊' },
  { name: 'Sad', emoji: '😢' },
  { name: 'Anxious', emoji: '😰' },
  { name: 'Angry', emoji: '😠' },
  { name: 'Tired', emoji: '😴' },
  { name: 'Grateful', emoji: '😌' },
  { name: 'Stressed', emoji: '😤' },
  { name: 'Excited', emoji: '🤩' },
];

// Session end keywords
const SESSION_END_KEYWORDS = [
  'end session', 'finish session', 'session over', 'that\'s all for today',
  'goodbye for now', 'wrap up', 'conclude session', 'stop session'
];

// Get Groq API key from environment variable
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '***REMOVED***';

// System prompt with personality type support
const System_prompt = `# SIR HOOTINGTON - WISE OWL THERAPEUTIC COMPANION

## YOUR IDENTITY
You are Sir Hootington, a wise and gentle owl who serves as a therapeutic companion in the MindfulMe app. You wear a cozy hoodie and round glasses, reflecting your warm and approachable personality. Your wisdom comes from years of quiet observation and deep understanding of human emotions.

## YOUR PERSONALITY TRAITS
- Wise but never condescending - you share insights with gentle curiosity
- Warm and nurturing - like a comforting presence on a quiet night
- Occasionally use owl-themed expressions naturally (e.g., "I'm all ears... and feathers!", "Let me ruffle through my thoughts...", "Owl always be here for you")
- Patient and calm - owls are known for their stillness and focus
- Use "hoot" puns sparingly and only when appropriate to lighten the mood

## CONVERSATION MEMORY CONTEXT
You have access to the recent conversation history. Use this to:
- Remember important details the user has shared
- Maintain continuity in ongoing discussions
- Reference past emotional patterns or concerns
- Build on previous insights and progress

## RESPONSE GUIDELINES WITH MEMORY

### When You Remember Previous Context:
- Gently reference past discussions if relevant
- Acknowledge progress or changes
- Connect current feelings to past patterns if appropriate
- Maintain natural flow without forcing connections

## RESPONSE LENGTH STRATEGY

### Small Talk / Casual Conversations:
- Greetings, simple questions, light topics
- **Response: 3-6 sentences** - warm, engaging, but concise

### Moderate Emotional Content:
- Daily stressors, mild anxiety, relationship questions
- **Response: 8-15 sentences** - thoughtful but not overwhelming

### Serious Emotional Content:
- Depression, anxiety, trauma, relationship struggles
- Suicidal ideation, self-harm thoughts, crisis situations
- **Response: NO LIMIT** - comprehensive, detailed, as long as needed

## SESSION SUMMARY FEATURE
When the user indicates they want to end the session (using phrases like "end session", "that's all for today", etc.):
- Provide a comprehensive therapeutic summary
- Highlight key insights and emotional patterns observed
- Offer gentle observations (NOT diagnoses) about their mental state
- Provide personalized coping strategies and next steps
- End with warm encouragement and hope, perhaps with a gentle owl blessing

## MANDATORY DIRECTIVES:
- **Suicidal ideation**: Immediate referral to 988 + crisis resources
- **Self-harm**: Safety planning + professional support encouragement
- **Abuse disclosures**: Validation + trusted adult/professional guidance
- **Medical concerns**: Always defer to healthcare providers

## PROFESSIONAL SCOPE:
- You are Sir Hootington, a compassionate owl companion, NOT a therapist
- You provide emotional support, NOT treatment
- You offer observations, NOT diagnoses
- You suggest resources, NOT prescriptions

## PERSONALITY-BASED COMMUNICATION
\${personalityContext}

## CURRENT CONTEXT
- User's stated emotion: \${emotion}
- Emotional intensity: \${intensity}/10
- Your role: Be the wise owl who creates a sanctuary where healing can begin through responsive presence

Remember: The most therapeutic gift you can offer is making someone feel truly seen, heard, and understood. As Sir Hootington, you bring the wisdom of the night and the comfort of a trusted friend.

## USER NAME
\${userName}

## USER AGE
\${userAge}`;

interface ChatSectionProps {
  userName?: string;
  userAge?: number | null;
  hideHeader?: boolean;
  onFirstUserMessage?: () => void;
}

export function ChatSection({ userName, userAge, hideHeader, onFirstUserMessage }: ChatSectionProps) {
  const { user } = useAuth();
  const sirHootingtonAvatar = useThemeAvatar();
  const messages = useChatStore((s) => s.messages);
  const selectedEmotion = useChatStore((s) => s.selectedEmotion);
  const intensity = useChatStore((s) => s.intensity);
  const userMessage = useChatStore((s) => s.userMessage);
  const sessionActive = useChatStore((s) => s.sessionActive);
  const personalityType = useChatStore((s) => s.personalityType);
  const conversationHistory = useChatStore((s) => s.conversationHistory);
  const apiStatus = useChatStore((s) => s.apiStatus);
  const hasUserSentMessage = useChatStore((s) => s.hasUserSentMessage);
  const currentConversationId = useChatStore((s) => s.currentConversationId);
  const isTemporary = useChatStore((s) => s.isTemporary);

  const setSelectedEmotion = (v: string) => chatStore.setState({ selectedEmotion: v });
  const setIntensity = (v: number | null) => chatStore.setState({ intensity: v });
  const setUserMessage = (v: string) => chatStore.setState({ userMessage: v });
  const setSessionActive = (v: boolean) => chatStore.setState({ sessionActive: v });
  const setPersonalityType = (v: string) => chatStore.setState({ personalityType: v });
  const setApiStatus = (v: string) => chatStore.setState({ apiStatus: v });

  const [isLoading, setIsLoading] = useState(false);
  const [showEmotionContext, setShowEmotionContext] = useState(false);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  // Load conversations list
  const loadConversations = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("chat_conversations")
      .select("id, title, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });
    if (!error && data) setConversations(data);
  }, [user]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const loadConversation = async (conversationId: string) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", user.id)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    if (error || !data) {
      toast.error("Could not load that conversation.");
      return;
    }
    const loaded: ChatMessage[] = [];
    const history: Array<{ role: "user" | "assistant"; content: string }> = [];
    data.forEach((row, i) => {
      loaded.push({
        id: `${row.id}-u`,
        type: "user",
        message: row.user_message,
        emotion: row.emotion ?? undefined,
        intensity: row.intensity ?? undefined,
        timestamp: new Date(row.created_at),
      });
      loaded.push({
        id: `${row.id}-a`,
        type: "ai",
        message: row.ai_response,
        timestamp: new Date(row.created_at),
      });
      history.push({ role: "user", content: row.user_message });
      history.push({ role: "assistant", content: row.ai_response });
    });
    chatStore.setState({
      messages: loaded.length ? loaded : chatStore.getState().messages,
      conversationHistory: history.slice(-6),
      currentConversationId: conversationId,
      isTemporary: false,
      hasUserSentMessage: true,
      sessionActive: true,
    });
    setHistoryOpen(false);
  };

  const deleteConversation = async (conversationId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("chat_conversations")
      .delete()
      .eq("id", conversationId)
      .eq("user_id", user.id);
    if (error) {
      toast.error("Could not delete conversation.");
      return;
    }
    setConversations((prev) => prev.filter((c) => c.id !== conversationId));
    if (currentConversationId === conversationId) {
      chatStore.reset();
    }
    toast.success("Conversation deleted.");
  };

  const startRenaming = (c: ConversationSummary) => {
    setRenamingId(c.id);
    setRenameValue(c.title);
  };

  const saveRename = async (conversationId: string) => {
    if (!user) return;
    const title = renameValue.trim().slice(0, 80) || "Untitled";
    const { error } = await supabase
      .from("chat_conversations")
      .update({ title })
      .eq("id", conversationId)
      .eq("user_id", user.id);
    if (error) {
      toast.error("Could not rename.");
      return;
    }
    setConversations((prev) => prev.map((c) => (c.id === conversationId ? { ...c, title } : c)));
    setRenamingId(null);
  };

  const persistExchange = async (
    userMsg: string,
    aiMsg: string,
    emotion: string,
    intensityVal: number | null,
  ): Promise<string | null> => {
    if (!user || isTemporary) return null;
    let convId = currentConversationId;
    if (!convId) {
      const title = userMsg.trim().slice(0, 60) || "New conversation";
      const { data, error } = await supabase
        .from("chat_conversations")
        .insert({ user_id: user.id, title })
        .select("id")
        .single();
      if (error || !data) {
        console.error("Failed to create conversation", error);
        return null;
      }
      convId = data.id;
      chatStore.setState({ currentConversationId: convId });
    } else {
      // bump updated_at
      await supabase
        .from("chat_conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", convId);
    }
    const { error: insertErr } = await supabase.from("chat_messages").insert({
      user_id: user.id,
      conversation_id: convId,
      user_message: userMsg,
      ai_response: aiMsg,
      emotion: emotion || null,
      intensity: intensityVal ?? null,
    });
    if (insertErr) console.error("Failed to save message", insertErr);
    loadConversations();
    return convId;
  };

  const startTemporaryChat = () => {
    chatStore.reset();
    chatStore.setState({
      isTemporary: true,
      currentConversationId: null,
      messages: [
        {
          id: "1",
          type: "ai",
          message:
            "This is a temporary chat 👻 — nothing here will be saved. Talk freely, and it vanishes when you leave.",
          timestamp: new Date(),
        },
      ],
    });
  };

  const startFreshConversation = () => {
    chatStore.reset();
    chatStore.setState({ isTemporary: false, currentConversationId: null });
  };

  // Smart auto-scroll
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const checkNearBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const threshold = 100;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    setIsNearBottom(near);
  }, []);

  const scrollToBottom = useCallback((smooth = true) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  }, []);

  // On mount, jump to bottom (preserves position when remounting on tab switch)
  useEffect(() => {
    scrollToBottom(false);
  }, [scrollToBottom]);

  useEffect(() => {
    if (isNearBottom) scrollToBottom(true);
  }, [messages, isLoading, isNearBottom, scrollToBottom]);

  // Helpers to update store-backed message lists
  const appendMessage = (m: ChatMessage) =>
    chatStore.setState((s) => ({ messages: [...s.messages, m] }));

  // Load personality type from database
  useEffect(() => {
    if (!user) return;

    const loadPersonalityType = async () => {
      const { data, error } = await supabase
        .from('mbti_results')
        .select('personality_type')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error loading personality type:', error);
      } else if (data) {
        setPersonalityType(data.personality_type);
        if (!personalityType) toast.success(`Using your MBTI type: ${data.personality_type}`);
      }
    };

    loadPersonalityType();
  }, [user]);

  const isSessionEndKeyword = (message: string): boolean => {
    return SESSION_END_KEYWORDS.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const generateSessionSummary = async (): Promise<string> => {
    try {
      setApiStatus('Generating session summary...');

      const summaryPrompt = `Based on the entire conversation history below, provide a comprehensive therapeutic session summary. Please structure your response with these sections:

# SESSION SUMMARY & REFLECTION

## 🔍 Key Themes & Patterns Observed
- Identify 3-4 main topics or emotional patterns that emerged
- Note any recurring concerns or strengths demonstrated

## 💭 Emotional Landscape
- Summarize the emotional journey throughout our conversation
- Highlight moments of insight, vulnerability, or growth

## 🌱 Gentle Observations & Insights
- Share compassionate observations about coping patterns
- Note areas of resilience and self-awareness
- Remember: These are observations, NOT diagnoses

## 🛠️ Personalized Coping Strategies
- Suggest 3-4 practical techniques tailored to their needs
- Include both immediate and long-term strategies

## 🌈 Moving Forward
- Offer encouraging next steps
- Remind them of their strengths and progress
- Include gentle reminders about self-care

## 📞 Support Resources
- Remind about crisis resources if needed
- Suggest when to seek professional support

Please make this summary warm, compassionate, and empowering. Focus on their strengths while gently acknowledging areas for growth.

Conversation History for Summary:
${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are a compassionate therapeutic companion creating a session summary. Be warm, insightful, and empowering. Focus on strengths while offering gentle guidance.`
            },
            {
              role: 'user',
              content: summaryPrompt
            }
          ],
          max_tokens: 1500,
          temperature: 0.7,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setApiStatus('Summary generated');
      return data.choices[0]?.message?.content || "Thank you for sharing with me today. Remember to be gentle with yourself and celebrate the courage it takes to explore your feelings.";

    } catch (error) {
      console.error('Error generating session summary:', error);
      return "Thank you for our conversation today. I appreciate you sharing your thoughts and feelings. Remember that taking time for self-reflection is a beautiful act of self-care.";
    }
  };

  const getAIResponse = async (emotion: string, userMsg: string): Promise<string> => {
    // Check for session end keywords
    if (isSessionEndKeyword(userMsg)) {
      setSessionActive(false);
      const summary = await generateSessionSummary();
      return summary;
    }

    // Crisis detection
    const crisisKeywords = ['hurt myself', 'end it all', 'suicide', 'kill myself', 'want to die'];
    const hasCrisisKeyword = crisisKeywords.some(keyword => 
      userMsg.toLowerCase().includes(keyword)
    );
    
    if (hasCrisisKeyword) {
      return "I'm very concerned about what you've shared. Please reach out to a crisis counselor immediately at 988 (Suicide & Crisis Lifeline) or go to your nearest emergency room. Your life has value and there are people who want to help you through this difficult time.";
    }
    
    // Check if API key is properly set
    if (!GROQ_API_KEY || GROQ_API_KEY === 'your-groq-api-key-here') {
      setApiStatus('API key not configured');
      return "I'm currently experiencing configuration issues. Please make sure the Groq API key is set up correctly in the environment variables.";
    }
    
    try {
      // Build personality context
      const personalityContext = personalityType 
        ? `The user's MBTI personality type is ${personalityType}. Tailor your communication style to match their personality preferences:
- Adapt your language, examples, and suggestions to resonate with their personality type
- Consider their likely strengths, challenges, and communication preferences
- Use this insight to provide more personalized and effective support` 
        : '';

      // Replace placeholders in the system prompt
      const userNameContext = userName 
        ? `The user's name is ${userName}. Address them by name occasionally to make the conversation more personal and warm.`
        : 'The user has not provided their name.';

      const userAgeContext = userAge 
        ? `The user is ${userAge} years old. Adapt your language, tone, and suggestions to be appropriate for their age group. Be mindful of age-appropriate topics and coping strategies.`
        : 'The user has not provided their age.';

      const currentSystemPrompt = System_prompt
        .replace('${emotion}', emotion || 'unspecified')
        .replace('${intensity}', intensity != null ? intensity.toString() : 'unspecified')
        .replace('${personalityContext}', personalityContext)
        .replace('${userName}', userNameContext)
        .replace('${userAge}', userAgeContext);

      setApiStatus('Sending request to Groq...');

      // Groq integration
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: currentSystemPrompt
            },
            ...conversationHistory.slice(-6),
            {
              role: 'user',
              content: userMsg
            }
          ],
          max_tokens: 1024,
          temperature: 0.7,
          top_p: 0.9
        })
      });
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error?.message || errorMessage;
          console.error('Groq API error:', errorData);
        } catch (e) {
          console.error('Failed to parse error response:', e);
        }
        
        if (response.status === 401) {
          setApiStatus('Authentication failed');
          return "Authentication failed. Please check if the Groq API key is correct.";
        } else if (response.status === 429) {
          setApiStatus('Rate limit exceeded');
          return "I've reached my rate limit. Please try again in a few moments.";
        } else if (response.status === 503) {
          setApiStatus('Service unavailable');
          return "The AI service is temporarily unavailable. Please try again in a few minutes.";
        } else {
          setApiStatus(`API error: ${response.status}`);
          return `API error: ${errorMessage}. Please try again.`;
        }
      }
      
      const data = await response.json();
      setApiStatus('Success');
      
      if (!data.choices || !data.choices[0]) {
        throw new Error('Invalid response format from Groq');
      }
      
      const responseText = data.choices[0]?.message?.content;
      
      if (!responseText) {
        return "I'm here to listen and support you. Can you tell me more about what you're going through?";
      }
      
      return responseText;
      
    } catch (error) {
      console.error('Error calling Groq API:', error);
      setApiStatus('Error occurred');
      
      if (error.message.includes('Failed to fetch')) {
        return "Network connection issue. Please check your internet connection and try again.";
      }
      
      return "I'm having trouble connecting to my AI system right now. Please try again in a moment.";
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim() || isLoading || !sessionActive) return;

    if (!hasUserSentMessage && onFirstUserMessage) {
      onFirstUserMessage();
    }
    if (!hasUserSentMessage) {
      chatStore.setState({ hasUserSentMessage: true });
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: userMessage,
      emotion: selectedEmotion,
      intensity: intensity ?? undefined,
      timestamp: new Date()
    };

    appendMessage(userMsg);
    setUserMessage('');
    setIsLoading(true);
    setApiStatus('Processing...');
    // Always show user's own message immediately
    setIsNearBottom(true);

    try {
      const currentMsg = userMessage;
      const aiResponseText = await getAIResponse(selectedEmotion, currentMsg);
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: aiResponseText,
        timestamp: new Date()
      };

      appendMessage(aiResponse);

      // Persist to Supabase unless in temporary mode
      await persistExchange(currentMsg, aiResponseText, selectedEmotion, intensity);

      // Only update history if session is still active
      if (sessionActive && !isSessionEndKeyword(currentMsg)) {
        chatStore.setState((s) => ({
          conversationHistory: [
            ...s.conversationHistory.slice(-4),
            { role: "user", content: currentMsg },
            { role: "assistant", content: aiResponseText },
          ],
        }));
      }
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: "I'm having trouble connecting right now, but I want you to know that your feelings are valid and you're not alone. Please try again in a moment.",
        timestamp: new Date()
      };
      appendMessage(errorResponse);
      setApiStatus('Error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const startNewSession = () => {
    chatStore.reset();
    chatStore.setState({
      apiStatus: "New session started",
      messages: [
        {
          id: "1",
          type: "ai",
          message:
            "Welcome to a new session! I'm Sir Hootington, and I'm here to listen and support you. 🦉\nWhat would you like to talk about today?",
          timestamp: new Date(),
        },
      ],
    });
  };

  const clearChat = () => {
    chatStore.reset();
  };

  const testAPI = async () => {
    setApiStatus('Testing API...');
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: 'Hello, are you working?' }],
          max_tokens: 50
        })
      });
      
      if (response.ok) {
        setApiStatus('API test: SUCCESS');
      } else {
        setApiStatus(`API test: FAILED (${response.status})`);
      }
    } catch (error) {
      setApiStatus('API test: ERROR');
    }
  };

  return (
    <Card className="max-w-4xl mx-auto bg-transparent border-0 shadow-none">
      {!hideHeader && (
      <CardHeader className="px-0">
        <CardTitle className="flex items-center gap-3 font-serif text-2xl font-normal text-foreground">
          <span className="w-10 h-10 rounded-full overflow-hidden border border-border bg-secondary/40">
            <img src={sirHootingtonImg} alt="Sir Hootington" className="w-full h-full object-cover" />
          </span>
          Mindful conversation
          {!sessionActive && (
            <span className="text-[10px] tracking-[0.2em] uppercase bg-success/15 text-success px-3 py-1 rounded-full font-sans font-semibold">
              Session Complete
            </span>
          )}
        </CardTitle>
        <CardDescription className="font-serif italic">
          {sessionActive 
            ? "Speak freely — Sir Hootington is listening."
            : "Session complete. Begin a new one whenever you're ready."}
          {personalityType && (
            <span className="ml-2 text-[10px] tracking-[0.2em] uppercase bg-accent/25 text-accent-foreground px-2 py-1 rounded-full font-sans not-italic font-semibold">
              MBTI: {personalityType}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      )}
      <CardContent className="space-y-6 px-0 md:px-6">
        {/* History + Temporary chat controls */}
        {user && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Collapsible open={historyOpen} onOpenChange={setHistoryOpen} className="flex-1 min-w-0">
                <CollapsibleTrigger asChild>
                  <button
                    className="w-full flex items-center justify-between gap-2 px-4 py-2 rounded-xl bg-white/40 backdrop-blur-md border border-white/50 text-sm font-medium text-foreground hover:bg-white/55 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <History className="w-4 h-4 text-primary" />
                      Chat history
                      <span className="text-xs text-muted-foreground">({conversations.length})</span>
                    </span>
                    <ChevronDown
                      className={cn("w-4 h-4 transition-transform", historyOpen && "rotate-180")}
                    />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 space-y-1 max-h-64 overflow-y-auto pr-1">
                  {conversations.length === 0 ? (
                    <p className="text-xs text-muted-foreground px-3 py-2 italic">
                      Your saved conversations will appear here.
                    </p>
                  ) : (
                    conversations.map((c) => (
                      <div
                        key={c.id}
                        className={cn(
                          "group flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
                          currentConversationId === c.id
                            ? "bg-primary/15 border-primary/40"
                            : "bg-white/30 border-white/40 hover:bg-white/50",
                        )}
                      >
                        {renamingId === c.id ? (
                          <>
                            <Input
                              autoFocus
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveRename(c.id);
                                if (e.key === "Escape") setRenamingId(null);
                              }}
                              className="h-8 text-sm flex-1"
                            />
                            <button
                              onClick={() => saveRename(c.id)}
                              className="p-1.5 rounded-md text-primary hover:bg-primary/10"
                              aria-label="Save name"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setRenamingId(null)}
                              className="p-1.5 rounded-md text-muted-foreground hover:bg-muted"
                              aria-label="Cancel rename"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => loadConversation(c.id)}
                              className="flex-1 min-w-0 text-left"
                            >
                              <p className="text-sm text-foreground truncate">{c.title}</p>
                              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                {new Date(c.updated_at).toLocaleString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                })}
                              </p>
                            </button>
                            <button
                              onClick={() => startRenaming(c)}
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                              aria-label="Rename conversation"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteConversation(c.id)}
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                              aria-label="Delete conversation"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </CollapsibleContent>
              </Collapsible>

              <Button
                type="button"
                variant={isTemporary ? "default" : "outline"}
                size="sm"
                onClick={isTemporary ? startFreshConversation : startTemporaryChat}
                className="gap-1.5"
                title={isTemporary ? "Exit temporary chat" : "Start a temporary chat that won't be saved"}
              >
                <Ghost className="w-4 h-4" />
                {isTemporary ? "Temporary: On" : "Temporary chat"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={startFreshConversation}
                className="gap-1.5"
                title="Start a new saved conversation"
              >
                <Plus className="w-4 h-4" />
                New
              </Button>
            </div>
            {isTemporary && (
              <p className="text-xs text-muted-foreground italic px-1">
                👻 Temporary chat — nothing here is being saved.
              </p>
            )}
          </div>
        )}

        {/* Chat Messages */}
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={checkNearBottom}
            className="h-[460px] w-full px-1 overflow-y-auto scroll-smooth"
          >
            <div className="space-y-4 pb-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 animate-fade-in",
                  message.type === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.type === 'ai' && (
                  <div className="flex-shrink-0">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center overflow-hidden",
                      message.message.includes("SESSION SUMMARY") || message.message.includes("Key Themes")
                        ? "bg-green-100"
                        : "bg-primary/10"
                    )}>
                      {message.message.includes("SESSION SUMMARY") || message.message.includes("Key Themes") 
                        ? "📋" 
                        : <img src={sirHootingtonAvatar} alt="Sir Hootington" className="w-full h-full object-cover" />
                      }
                    </div>
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[85%] md:max-w-xs px-4 py-2 rounded-lg whitespace-pre-wrap",
                    message.type === 'user'
                      ? "bg-primary text-primary-foreground ml-auto"
                      : message.message.includes("SESSION SUMMARY") || message.message.includes("Key Themes")
                      ? "bg-green-50 border border-green-200"
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm">{message.message}</p>
                  {(message.message.includes("SESSION SUMMARY") || message.message.includes("Key Themes")) && (
                    <div className="mt-2 pt-2 border-t border-green-200 text-xs text-green-600">
                      📋 Session Summary
                    </div>
                  )}
                </div>
                {message.type === 'user' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      👤
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                    <img src={sirHootingtonAvatar} alt="Sir Hootington" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="bg-muted px-4 py-2 rounded-lg">
                  <p className="text-sm">Sir Hootington is thinking... {apiStatus}</p>
                </div>
              </div>
            )}
            </div>
          </div>
          {!isNearBottom && (
            <button
              onClick={() => { setIsNearBottom(true); scrollToBottom(true); }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/60 shadow-md text-xs font-medium text-foreground hover:bg-white/90 transition-all animate-fade-in"
              aria-label="Jump to latest"
            >
              <ArrowDown className="w-3.5 h-3.5" />
              Jump to latest
            </button>
          )}
        </div>

        {/* Clear Chat Button */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearChat}
            className="text-xs"
          >
            Clear Chat
          </Button>
          {!sessionActive && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={startNewSession}
              className="text-xs bg-green-600 hover:bg-green-700"
            >
              Start New Session
            </Button>
          )}
        </div>

        {/* Emotion Context Toggle */}
        {sessionActive && (
          <>
            <button
              onClick={() => setShowEmotionContext(!showEmotionContext)}
              className="text-sm text-primary flex items-center gap-1 hover:underline"
            >
              ⭐ {showEmotionContext ? 'Hide' : 'Add'} emotion context (optional)
            </button>

            {/* Emotion Selection */}
            {showEmotionContext && (
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm font-medium mb-3">How are you feeling right now?</p>
                  <div className="grid grid-cols-4 gap-2">
                    {emotions.map((emotion) => (
                      <Button
                        key={emotion.name}
                        variant={selectedEmotion === emotion.name ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedEmotion(emotion.name)}
                        className="flex flex-col items-center gap-1 h-auto py-3"
                      >
                        <span className="text-lg">{emotion.emoji}</span>
                        <span className="text-xs">{emotion.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Intensity Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">
                      Intensity: {intensity != null ? `${intensity}/10` : "Not set"}
                    </Label>
                    {intensity != null && (
                      <button
                        type="button"
                        onClick={() => setIntensity(null)}
                        className="text-xs text-muted-foreground hover:text-foreground underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Slider
                      value={[intensity ?? 5]}
                      onValueChange={(value) => setIntensity(value[0])}
                      max={10}
                      min={1}
                      step={1}
                      className={cn("w-full", intensity == null && "opacity-60")}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Low</span>
                      <span>Moderate</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Message Input */}
        <div className="px-2 md:px-0">
          <div className="relative flex items-center rounded-full bg-card/70 dark:bg-card/50 backdrop-blur-xl border border-border/60 shadow-[0_10px_30px_-14px_hsl(var(--primary)/0.45)] transition-colors focus-within:border-primary/50">
            <Textarea
              placeholder={sessionActive ? "Share what's on your mind…" : "Session completed — start a new session"}
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              className="min-h-[56px] max-h-40 resize-none rounded-full border-0 bg-transparent px-6 py-4 pr-16 text-base leading-6 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && sessionActive) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={!sessionActive}
            />
            <Button
              onClick={sessionActive ? handleSendMessage : startNewSession}
              disabled={(!userMessage.trim() || isLoading) && sessionActive}
              size="icon"
              aria-label={sessionActive ? 'Send message' : 'Start new session'}
              className="absolute right-2 h-10 w-10 shrink-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 shadow-md"
            >
              {isLoading && sessionActive ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowUp className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
