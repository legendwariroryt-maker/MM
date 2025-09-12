import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChatSection } from "@/components/sections/ChatSection";
import { EmotionsSection } from "@/components/sections/EmotionsSection";
import { MindfulnessSection } from "@/components/sections/MindfulnessSection";
import { JournalSection } from "@/components/sections/JournalSection";
import { EmergencySection } from "@/components/sections/EmergencySection";
import { Brain } from "lucide-react";
import { AppSection } from "@/types";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="py-6 px-4 border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">MindfulMe</h1>
            <button className="text-sm text-muted-foreground hover:text-foreground">
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, friend! 💙
        </h2>
        <p className="text-muted-foreground mb-8">
          Your personal mental wellness companion
        </p>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button
            variant={activeSection === 'chat' ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSection('chat')}
            className="flex items-center gap-2"
          >
            <Brain className="w-4 h-4" />
            Supportive Chat
          </Button>
          <Button
            variant={activeSection === 'emotions' ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSection('emotions')}
            className="flex items-center gap-2"
          >
            📊 Emotion Analytics
          </Button>
          <Button
            variant={activeSection === 'journal' ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSection('journal')}
            className="flex items-center gap-2"
          >
            📝 Wellness Journal
          </Button>
          <Button
            variant={activeSection === 'mindfulness' ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSection('mindfulness')}
            className="flex items-center gap-2"
          >
            🧘 Mindfulness
          </Button>
          <Button
            variant={activeSection === 'emergency' ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSection('emergency')}
            className="flex items-center gap-2"
          >
            🆘 Emergency Help
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pb-8">
        <div className="animate-fade-in">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default Index;