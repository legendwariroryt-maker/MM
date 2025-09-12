import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ChatMessage, EmotionType } from "@/types";

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


export function ChatSection() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      message: "Hi there! I'm here to listen and support you.\nHow are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [intensity, setIntensity] = useState<number>(8);
  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmotionContext, setShowEmotionContext] = useState(false);

  const getAIResponse = async (emotion: string, userMsg: string): Promise<string> => {
    // Simple keyword detection for crisis situations
    const crisisKeywords = ['hurt myself', 'end it all', 'suicide', 'kill myself', 'want to die'];
    const hasCrisisKeyword = crisisKeywords.some(keyword => 
      userMsg.toLowerCase().includes(keyword)
    );
    
    if (hasCrisisKeyword) {
      return "I'm very concerned about what you've shared. Please reach out to a crisis counselor immediately at 988 (Suicide & Crisis Lifeline) or go to your nearest emergency room. Your life has value and there are people who want to help you through this difficult time.";
    }
    
    try {
      const systemPrompt = `You are a compassionate mental health companion for teenagers. The user is feeling ${emotion} with intensity ${intensity}/10. 
      Provide empathetic, supportive responses that:
      - Acknowledge their feelings
      - Offer practical coping strategies
      - Use a warm, understanding tone
      - Keep responses concise (2-3 sentences)
      - Suggest specific techniques when appropriate (breathing, grounding, etc.)
      - Avoid giving medical advice`;
      
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3',
          prompt: `${systemPrompt}\n\nUser message: ${userMsg}`,
          stream: false
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.response || "I'm here to listen and support you. Can you tell me more about what you're going through?";
      
    } catch (error) {
      console.error('Error calling Ollama:', error);
      return "I'm having trouble connecting to my AI system right now, but I'm still here for you. Can you tell me more about what you're feeling?";
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: userMessage,
      emotion: selectedEmotion,
      intensity: intensity,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setUserMessage('');
    setIsLoading(true);

    try {
      const aiResponseText = await getAIResponse(selectedEmotion, userMessage);
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: aiResponseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: "I'm having trouble connecting right now, but I want you to know that your feelings are valid and you're not alone.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      type: 'ai',
      message: "Hi there! I'm here to listen and support you.\nHow are you feeling today?",
      timestamp: new Date()
    }]);
    setSelectedEmotion('');
    setIntensity(8);
    setUserMessage('');
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          💬 Supportive Chat
        </CardTitle>
        <CardDescription>
          Chat with your AI companion for emotional support and guidance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chat Messages */}
        <ScrollArea className="h-[400px] w-full border rounded-lg p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.type === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.type === 'ai' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      🤗
                    </div>
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-xs px-4 py-2 rounded-lg whitespace-pre-wrap",
                    message.type === 'user'
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm">{message.message}</p>
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
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    🤗
                  </div>
                </div>
                <div className="bg-muted px-4 py-2 rounded-lg">
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Emotion Context Toggle */}
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
                <Label className="text-sm font-medium">Intensity: {intensity}/10</Label>
              </div>
              <div className="space-y-2">
                <Slider
                  value={[intensity]}
                  onValueChange={(value) => setIntensity(value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
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

        {/* Message Input */}
        <div className="flex gap-2">
          <Textarea
            placeholder="Share what's on your mind..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            className="min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!userMessage.trim() || isLoading}
            className="self-end"
          >
            {isLoading ? 'Thinking...' : 'Send'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}