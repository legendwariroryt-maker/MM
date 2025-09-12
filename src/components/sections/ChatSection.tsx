import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, RotateCcw, Bot, User } from "lucide-react";
import { ChatMessage, EmotionType } from "@/types";

const emotions: EmotionType[] = ['anxious', 'happy', 'stressed', 'sad', 'angry', 'excited', 'overwhelmed', 'calm'];

const aiResponses: Record<string, string[]> = {
  anxious: [
    "I understand you're feeling anxious. Try the 4-7-8 breathing technique: breathe in for 4, hold for 7, exhale for 8.",
    "Anxiety can feel overwhelming, but remember it's temporary. What's one small thing you can do right now to feel safer?",
    "Let's ground you in the present moment. Can you name 5 things you can see around you right now?"
  ],
  stressed: [
    "Stress is your body's way of responding to challenges. Take a moment to breathe deeply and remind yourself that you're capable.",
    "When we're stressed, our thoughts can spiral. What's the most important thing you need to focus on right now?",
    "Progressive muscle relaxation can help with stress. Try tensing and then relaxing each muscle group, starting with your toes."
  ],
  sad: [
    "It's okay to feel sad. Your feelings are valid, and it's important to acknowledge them rather than push them away.",
    "Sadness is part of the human experience. What's one small thing that usually brings you a tiny bit of comfort?",
    "Sometimes sadness needs to be felt before it can pass. Would you like to try some gentle movement or creative expression?"
  ],
  happy: [
    "I'm so glad you're feeling happy! What's bringing you joy today? It's wonderful to celebrate these positive moments.",
    "Happiness is beautiful! Try to really savor this feeling and maybe write down what made you feel this way.",
    "When we're happy, it's a great time to do something kind for ourselves or others. What feels right for you?"
  ]
};

export function ChatSection() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      message: "Hi there! I'm your mental health companion. How are you feeling today? Select your emotion and tell me what's on your mind.",
      timestamp: new Date()
    }
  ]);
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [intensity, setIntensity] = useState<number[]>([5]);
  const [userMessage, setUserMessage] = useState('');

  const getAIResponse = (emotion: string, userMsg: string) => {
    const emotionResponses = aiResponses[emotion as keyof typeof aiResponses] || [
      "Thank you for sharing that with me. Remember, you're not alone in this journey.",
      "I hear you, and your feelings matter. What would feel most supportive for you right now?",
      "It takes courage to express how you're feeling. What's one thing you'd like to try today to take care of yourself?"
    ];
    
    // Simple keyword detection for crisis situations
    const crisisKeywords = ['hurt myself', 'end it all', 'suicide', 'kill myself', 'want to die'];
    const hasCrisisKeyword = crisisKeywords.some(keyword => 
      userMsg.toLowerCase().includes(keyword)
    );
    
    if (hasCrisisKeyword) {
      return "I'm very concerned about what you've shared. Please reach out to a crisis counselor immediately at 988 (Suicide & Crisis Lifeline) or go to your nearest emergency room. Your life has value and there are people who want to help you through this difficult time.";
    }
    
    return emotionResponses[Math.floor(Math.random() * emotionResponses.length)];
  };

  const handleSendMessage = () => {
    if (!userMessage.trim() || !selectedEmotion) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: userMessage,
      emotion: selectedEmotion,
      intensity: intensity[0],
      timestamp: new Date()
    };

    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      message: getAIResponse(selectedEmotion, userMessage),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg, aiResponse]);
    setUserMessage('');
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      type: 'ai',
      message: "Hi there! I'm your mental health companion. How are you feeling today?",
      timestamp: new Date()
    }]);
    setSelectedEmotion('');
    setIntensity([5]);
    setUserMessage('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            AI Mental Health Companion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Emotion Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">How are you feeling?</label>
              <Select value={selectedEmotion} onValueChange={setSelectedEmotion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your emotion" />
                </SelectTrigger>
                <SelectContent>
                  {emotions.map(emotion => (
                    <SelectItem key={emotion} value={emotion} className="capitalize">
                      {emotion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Intensity: {intensity[0]}/10
              </label>
              <Slider
                value={intensity}
                onValueChange={setIntensity}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Chat History */}
          <Card>
            <ScrollArea className="h-64 p-4">
              <div className="space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <div className="flex items-start gap-2">
                        {message.type === 'ai' ? (
                          <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        ) : (
                          <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <p className="text-sm">{message.message}</p>
                          {message.emotion && (
                            <p className="text-xs opacity-70 mt-1">
                              Feeling: {message.emotion} ({message.intensity}/10)
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Message Input */}
          <div className="space-y-3">
            <Textarea
              placeholder="Tell me what's on your mind..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleSendMessage} 
                disabled={!selectedEmotion || !userMessage.trim()}
                className="flex-1"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" onClick={clearChat}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}