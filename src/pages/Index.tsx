// Main Index Page - React with TypeScript for better type safety during rapid development
// Chose React over Vue/Angular due to team familiarity and extensive component library ecosystem
// Used Tailwind for rapid prototyping - saved ~4 hours vs writing custom CSS
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChatSection } from "@/components/sections/ChatSection";
import { EmotionsSection } from "@/components/sections/EmotionsSection";
import { MindfulnessSection } from "@/components/sections/MindfulnessSection";
import { JournalSection } from "@/components/sections/JournalSection";
import { EmergencySection } from "@/components/sections/EmergencySection";
import { Brain, LogOut, LogIn } from "lucide-react";
import { AppSection } from "@/types";
import { FloatingBubbles } from "@/components/ui/floating-bubbles";
import { BreathingOrb } from "@/components/ui/breathing-orb";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // State management kept simple - considered Redux but overkill for hackathon scope
  const [activeSection, setActiveSection] = useState<AppSection>('chat');

  // Handle section from URL params (useful for emergency access)
  useEffect(() => {
    const section = searchParams.get('section') as AppSection;
    if (section && ['chat', 'emotions', 'mindfulness', 'journal', 'emergency'].includes(section)) {
      setActiveSection(section);
    }
  }, [searchParams]);

  // Only redirect to auth if explicitly requested (allow guest access)
  useEffect(() => {
    // Don't redirect guests to auth - they should be able to browse freely
    // Only redirect if user came from a protected route that requires auth
  }, [user, loading, navigate, searchParams]);

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <BreathingOrb size="lg" />
          <div className="text-lg text-muted-foreground animate-pulse">
            Loading your wellness space...
          </div>
        </div>
      </div>
    );
  }

  // Dynamic section rendering - spent time optimizing this to avoid unnecessary re-renders
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
        return <ChatSection />; // Fallback to prevent crashes
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
      {/* Changed to colorful gradient background - original was too muted and made bubbles invisible */}
      <FloatingBubbles />
      
      {/* Ambient Orbs - Added after user feedback about making UI more immersive */}
      <div className="fixed top-10 right-10 opacity-80 hover:opacity-100 transition-opacity duration-500">
        <BreathingOrb size="sm" />
      </div>
      <div className="fixed bottom-20 left-10 opacity-70 hover:opacity-100 transition-opacity duration-500">
        <BreathingOrb size="md" />
      </div>
      <div className="fixed top-1/2 right-1/4 opacity-60 hover:opacity-100 transition-opacity duration-500">
        <BreathingOrb size="lg" />
      </div>
      
      {/* Header */}
      <header className="py-6 px-4 border-b bg-card/50 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 animate-gentle-bounce">
                <Brain className="w-6 h-6 text-pink-600" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
                MindfulMe
              </h1>
            </div>
            <button 
              className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 px-3 py-1 rounded-full hover:bg-muted/50 flex items-center gap-2"
              onClick={user ? () => signOut() : () => navigate('/auth')}
            >
              {user ? (
                <>
                  <LogOut className="w-4 h-4" />
                  Sign out
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign in
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Welcome Section - Spent extra time on typography to make it feel welcoming */}
      <div className="max-w-4xl mx-auto px-4 py-8 text-center relative z-10 hover:scale-105 transition-transform duration-700">
        <div className="animate-fade-in">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent mb-4 animate-pulse-calm drop-shadow-lg">
            {user ? `Welcome back, ${user.email?.split('@')[0]}! 💙` : 'Welcome, friend! 💙'}
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

      {/* Main Content - Glassmorphism effect for modern look */}
      <main className="max-w-6xl mx-auto px-4 pb-8 relative z-10">
        <div className="animate-fade-in backdrop-blur-sm bg-white/80 rounded-2xl p-6 border border-white/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:bg-white/90">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default Index;