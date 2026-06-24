import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ChatSection } from "@/components/sections/ChatSection";
import { EmotionsSection } from "@/components/sections/EmotionsSection";
import { MindfulnessSection } from "@/components/sections/MindfulnessSection";
import { JournalSection } from "@/components/sections/JournalSection";
import { EmergencySection } from "@/components/sections/EmergencySection";
import { MbtiSection } from "@/components/sections/MbtiSection";
import { ThemeSelector } from "@/components/ThemeSelector";
import { OnboardingSection } from "@/components/sections/OnboardingSection";
import { AppSection } from "@/types";
import PrivacySettings from "@/components/PrivacySettings";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import sirHootingtonImg from "@/assets/sir-hootington-sitting.png";

const sectionLabels: Record<AppSection, { eyebrow: string; title: string; subtitle: string }> = {
  chat: { eyebrow: "Daily Sanctuary", title: "Mindful conversation", subtitle: "A quiet hour with Sir Hootington." },
  emotions: { eyebrow: "Reflection", title: "Emotional flow", subtitle: "Notice the colors of your week." },
  journal: { eyebrow: "Quiet Pages", title: "Wellness journal", subtitle: "Write what only you need to hear." },
  mindfulness: { eyebrow: "Practice", title: "Breath & stillness", subtitle: "Small rituals for a softer mind." },
  mbti: { eyebrow: "Inner Compass", title: "Personality insights", subtitle: "Understand the shape of your spirit." },
  emergency: { eyebrow: "Support", title: "Immediate help", subtitle: "You are not alone tonight." },
  settings: { eyebrow: "Account", title: "Privacy", subtitle: "What you share is yours to decide." },
  themes: { eyebrow: "Atmosphere", title: "Themes", subtitle: "Curate the mood of your sanctuary." },
  onboarding: { eyebrow: "Welcome", title: "Begin gently", subtitle: "A few quiet questions before we start." },
};

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState<AppSection>("chat");
  const [displayName, setDisplayName] = useState<string>("");
  const [userAge, setUserAge] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      setDisplayName("");
      setUserAge(null);
      return;
    }
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, age")
        .eq("id", user.id)
        .maybeSingle();
      if (!error && data) {
        if (data.display_name) setDisplayName(data.display_name);
        if (data.age) setUserAge(data.age);
      }
    };
    fetchProfile();
  }, [user]);

  useEffect(() => {
    const section = searchParams.get("section") as AppSection;
    if (
      section &&
      ["chat", "emotions", "mindfulness", "journal", "emergency", "settings", "mbti", "themes", "onboarding"].includes(section)
    ) {
      setActiveSection(section);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="font-serif italic text-muted-foreground">Loading your sanctuary…</div>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case "chat":
        return <ChatSection userName={displayName} userAge={userAge} />;
      case "emotions":
        return <EmotionsSection />;
      case "mindfulness":
        return <MindfulnessSection />;
      case "journal":
        return <JournalSection />;
      case "emergency":
        return <EmergencySection />;
      case "settings":
        return <PrivacySettings />;
      case "mbti":
        return <MbtiSection />;
      case "themes":
        return <ThemeSelector />;
      case "onboarding":
        return <OnboardingSection onComplete={() => setActiveSection("chat")} />;
      default:
        return <ChatSection />;
    }
  };

  const meta = sectionLabels[activeSection];
  const greetName = displayName || user?.email?.split("@")[0] || "friend";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background font-sans text-foreground">
        <AppSidebar
          activeSection={activeSection}
          onSelect={setActiveSection}
          user={user}
          displayName={displayName}
          onSignOut={() => signOut()}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex items-center justify-between px-8 lg:px-14 pt-8 pb-2">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <p className="text-[10px] tracking-[0.32em] uppercase text-muted-foreground/70 font-semibold">
              {meta.eyebrow}
            </p>
          </header>

          <section className="px-8 lg:px-14 pt-6 pb-10 max-w-6xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
              <div>
                <h1 className="font-serif text-4xl md:text-5xl leading-tight text-foreground">
                  {activeSection === "chat" ? (
                    <>Gentle {timeOfDay()}, <span className="italic text-primary">{greetName}</span>.</>
                  ) : (
                    meta.title
                  )}
                </h1>
                <p className="mt-3 font-serif italic text-lg text-muted-foreground max-w-md">
                  {meta.subtitle}
                </p>
              </div>

              <div className="flex items-center gap-4 bg-card/70 backdrop-blur-sm border border-border rounded-[2rem] p-4 pr-6 shadow-soft max-w-sm">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-secondary/50 border border-border shrink-0">
                  <img src={sirHootingtonImg} alt="Sir Hootington" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-serif italic text-sm text-foreground leading-snug">
                    "Take the breath you've been holding."
                  </p>
                  <p className="mt-1 text-[9px] tracking-[0.22em] uppercase font-semibold text-primary">
                    Sir Hootington
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card/60 backdrop-blur-sm border border-border rounded-[2rem] p-6 md:p-10 shadow-soft animate-fade-in">
              {renderSection()}
            </div>
          </section>
        </div>
      </div>
    </SidebarProvider>
  );
};

function timeOfDay() {
  const h = new Date().getHours();
  if (h < 5) return "night";
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

export default Dashboard;