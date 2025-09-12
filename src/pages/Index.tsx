import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { ChatSection } from "@/components/sections/ChatSection";
import { EmotionsSection } from "@/components/sections/EmotionsSection";
import { MindfulnessSection } from "@/components/sections/MindfulnessSection";
import { JournalSection } from "@/components/sections/JournalSection";
import { EmergencySection } from "@/components/sections/EmergencySection";
import { Brain, Heart, Sparkles } from "lucide-react";
import { AppSection } from "@/types";
import heroImage from "@/assets/hero-mental-health.jpg";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div 
          className="h-64 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80" />
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="text-white max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                Mindful Me
              </h1>
              <p className="text-xl md:text-2xl mb-6 text-white/90">
                Your personal mental health companion for teenagers
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  <span>AI Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  <span>Emotion Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Mindfulness Tools</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Navigation */}
        <Navigation 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />

        {/* Welcome Message */}
        {activeSection === 'chat' && (
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-semibold mb-3 text-primary">
                Welcome to Your Safe Space 💙
              </h2>
              <p className="text-muted-foreground mb-4">
                This is a judgment-free zone where you can explore your emotions, 
                practice mindfulness, and get support when you need it most.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setActiveSection('emotions')}>
                  Track Emotions
                </Button>
                <Button variant="outline" size="sm" onClick={() => setActiveSection('mindfulness')}>
                  Try Breathing Exercises
                </Button>
                <Button variant="outline" size="sm" onClick={() => setActiveSection('journal')}>
                  Start Journaling
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Section Content */}
        <div className="animate-fade-in">
          {renderSection()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/50 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              <strong>Important:</strong> This app is for demonstration purposes and is not a substitute 
              for professional mental health care. If you're in crisis, please contact emergency services 
              or a mental health professional immediately.
            </p>
            <p className="text-xs text-muted-foreground">
              Crisis Resources: 988 Suicide & Crisis Lifeline | Text HOME to 741741
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;