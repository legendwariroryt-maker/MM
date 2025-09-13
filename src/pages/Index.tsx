import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChatSection } from "@/components/sections/ChatSection";
import { EmotionsSection } from "@/components/sections/EmotionsSection";
import { MindfulnessSection } from "@/components/sections/MindfulnessSection";
import { JournalSection } from "@/components/sections/JournalSection";
import { EmergencySection } from "@/components/sections/EmergencySection";
import { Brain } from "lucide-react";
import { AppSection } from "@/types";
import { FloatingBubbles } from "@/components/ui/floating-bubbles";
import { BreathingOrb } from "@/components/ui/breathing-orb";

const Index = () => {
  const [activeSection, setActiveSection] = useState<AppSection>('chat');

  const renderSection = () => {
    switch (activeSection) {
      case 'chat':
        return <ChatSection />;
      case 'emotions':
        return <EmotionsSection />;
      case 'mindfulness':
        return <MindfulnessSection />;
      case 'journal':
        return <JournalSection />;
      case 'emergency':
        return <EmergencySection />;
      default:
        return <ChatSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
      <FloatingBubbles />
      
      {/* Ambient Orbs */}
      <div className="fixed top-10 right-10 opacity-60">
        <BreathingOrb size="sm" />
      </div>
      <div className="fixed bottom-20 left-10 opacity-40">
        <BreathingOrb size="md" />
      </div>
      <div className="fixed top-1/2 right-1/4 opacity-30">
        <BreathingOrb size="lg" />
      </div>
      
      {/* Header */}
      <header className="py-6 px-4 border-b bg-card/50 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-gentle-bounce">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                MindfulMe
              </h1>
            </div>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 px-3 py-1 rounded-full hover:bg-muted/50">
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <div className="max-w-4xl mx-auto px-4 py-8 text-center relative z-10">
        <div className="animate-fade-in">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-4 animate-pulse-calm">
            Welcome back, friend! 💙
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Your personal mental wellness companion
          </p>
          
          {/* Floating wellness icons */}
          <div className="flex justify-center items-center gap-8 mb-8 opacity-60">
            <div className="animate-float" style={{ animationDelay: '0s' }}>🧘</div>
            <div className="animate-float" style={{ animationDelay: '0.5s' }}>💫</div>
            <div className="animate-float" style={{ animationDelay: '1s' }}>🌱</div>
            <div className="animate-float" style={{ animationDelay: '1.5s' }}>✨</div>
            <div className="animate-float" style={{ animationDelay: '2s' }}>🕊️</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Button
            variant={activeSection === 'chat' ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSection('chat')}
            className="flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <Brain className="w-4 h-4" />
            Supportive Chat
          </Button>
          <Button
            variant={activeSection === 'emotions' ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSection('emotions')}
            className="flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            📊 Emotion Analytics
          </Button>
          <Button
            variant={activeSection === 'journal' ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSection('journal')}
            className="flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            📝 Wellness Journal
          </Button>
          <Button
            variant={activeSection === 'mindfulness' ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSection('mindfulness')}
            className="flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            🧘 Mindfulness
          </Button>
          <Button
            variant={activeSection === 'emergency' ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSection('emergency')}
            className="flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            🆘 Emergency Help
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pb-8 relative z-10">
        <div className="animate-fade-in backdrop-blur-sm bg-card/30 rounded-2xl p-6 border border-border/50 shadow-xl">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default Index;