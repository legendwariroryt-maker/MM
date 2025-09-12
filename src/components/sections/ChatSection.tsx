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
  const [isLoading, setIsLoading] = useState(false);

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
      const systemPrompt = `You are a compassionate mental health companion for teenagers. The user is feeling ${emotion} with intensity ${intensity[0]}/10. 
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
    if (!userMessage.trim() || !selectedEmotion || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: userMessage,
      emotion: selectedEmotion,
      intensity: intensity[0],
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
                disabled={!selectedEmotion || !userMessage.trim() || isLoading}
                className="flex-1"
              >
                <Send className="w-4 h-4 mr-2" />
                {isLoading ? 'Thinking...' : 'Send Message'}
              </Button>
              <Button variant="outline" onClick={clearChat} disabled={isLoading}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}