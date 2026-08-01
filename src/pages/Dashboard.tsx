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
import { themeBackgrounds, themeAvatars } from "@/lib/themeAvatars";
import { MessageCircle, BarChart3, BookOpen, Flower2, Brain, Wind, Sparkles, Sprout, Heart, Palette } from "lucide-react";
import { ThemeQuickSwitcher } from "@/components/ThemeQuickSwitcher";

const sectionLabels: Record<AppSection, { eyebrow: string; title: string; subtitle: string }> = {
  home: { eyebrow: "Sanctuary", title: "Welcome back", subtitle: "Your personal mental wellness companion." },
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
  const [activeSection, setActiveSection] = useState<AppSection>("home");
  const [displayName, setDisplayName] = useState<string>("");
  const [userAge, setUserAge] = useState<number | null>(null);
  const [currentTheme, setCurrentTheme] = useState<string>(
    () => (typeof document !== "undefined" && document.documentElement.getAttribute("data-theme")) || "ocean-breeze"
  );
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.id) setCurrentTheme(detail.id);
    };
    window.addEventListener("themeChange", handler);
    return () => window.removeEventListener("themeChange", handler);
  }, []);

  const activeBg = themeBackgrounds[currentTheme] || themeBackgrounds["ocean-breeze"];
  const sirHootingtonImg = themeAvatars[currentTheme] || themeAvatars["ocean-breeze"];
  const isDarkTheme = ["midnight-calm", "aurora-night", "forest-twilight"].includes(currentTheme);

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
      ["home", "chat", "emotions", "mindfulness", "journal", "emergency", "settings", "mbti", "themes", "onboarding"].includes(section)
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
        return <ChatSection userName={displayName} userAge={userAge} hideHeader />;
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

  const featureCards = [
    { key: "chat" as AppSection, label: "Supportive Chat", desc: "Chat with Sir Hootington", Icon: MessageCircle },
    { key: "emotions" as AppSection, label: "Emotion Analytics", desc: "Understand your emotions", Icon: BarChart3 },
    { key: "journal" as AppSection, label: "Wellness Journal", desc: "Write and reflect daily", Icon: BookOpen },
    { key: "mindfulness" as AppSection, label: "Mindfulness", desc: "Guided practices", Icon: Flower2 },
    { key: "mbti" as AppSection, label: "Personality Test", desc: "Discover yourself", Icon: Brain },
  ];

  const isHome = activeSection === "home";

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="min-h-screen flex w-full font-sans text-foreground relative">
        {/* Dreamy hero background image, fixed across the viewport */}
        <div
          key={currentTheme}
          className="fixed inset-0 -z-10 bg-cover bg-center animate-fade-in"
          style={{ backgroundImage: `url(${activeBg})`, transition: "opacity 600ms ease" }}
          aria-hidden="true"
        />
        <div
          className="fixed inset-0 -z-10"
          style={{
            background: isDarkTheme
              ? "linear-gradient(180deg, hsl(var(--background)/0.35), hsl(var(--background)/0.55) 60%, hsl(var(--background)/0.7))"
              : "linear-gradient(180deg, hsl(var(--background)/0.25), hsl(var(--background)/0.2) 60%, hsl(var(--background)/0.55))",
          }}
          aria-hidden="true"
        />

        <AppSidebar
          activeSection={activeSection}
          onSelect={setActiveSection}
          user={user}
          displayName={displayName}
          onSignOut={() => signOut()}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex items-start justify-between px-6 lg:px-10 pt-6 pb-2">
            <div className="flex flex-col items-start gap-2">
              <SidebarTrigger className="text-foreground/70 hover:text-foreground bg-card/60 backdrop-blur-sm rounded-xl border border-border/50" />
              <ThemeQuickSwitcher />
            </div>
            {!isHome && (
              <p className="text-[10px] tracking-[0.32em] uppercase text-foreground/60 font-semibold">
                {meta.eyebrow}
              </p>
            )}
          </header>

          {isHome ? (
            <section key="home" className="px-6 lg:px-12 pb-12 pt-2 max-w-6xl mx-auto w-full section-enter">
              {/* Hero */}
              <div className="text-center mt-4 mb-10 animate-fade-in">
                <h1 className="font-serif text-5xl md:text-6xl leading-tight text-foreground drop-shadow-sm">
                  Welcome back, <span className="italic">{greetName}</span>{" "}
                  <Heart className="inline-block w-9 h-9 md:w-11 md:h-11 text-primary fill-primary align-middle -mt-2" />
                </h1>
                <p className="mt-3 text-base md:text-lg text-foreground/70">
                  Your personal mental wellness companion
                </p>

                {/* Pills — hidden on mobile to keep chat within reach */}
                <div className="mt-7 hidden md:flex flex-wrap items-center justify-center gap-3">
                  {[
                    { label: "Breathe", Icon: Wind, target: "mindfulness" as AppSection },
                    { label: "Reflect", Icon: Sparkles, target: "journal" as AppSection },
                    { label: "Grow", Icon: Sprout, target: "mbti" as AppSection },
                  ].map(({ label, Icon, target }) => (
                    <button
                      key={label}
                      onClick={() => setActiveSection(target)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/55 dark:bg-white/10 backdrop-blur-xl border border-white/60 dark:border-white/15 text-sm font-medium text-foreground/85 hover:bg-white/70 dark:hover:bg-white/20 hover:text-foreground hover:-translate-y-0.5 transition-all shadow-[0_4px_20px_-8px_rgba(120,90,160,0.3)]"
                    >
                      <Icon className="w-4 h-4 text-primary" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature cards — hidden on mobile */}
              <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {featureCards.map(({ key, label, desc, Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className="group relative flex flex-col items-center text-center p-5 rounded-2xl bg-white/55 dark:bg-white/10 backdrop-blur-xl border border-white/60 dark:border-white/15 hover:bg-white/70 dark:hover:bg-white/20 hover:-translate-y-1 hover:shadow-[0_12px_36px_-12px_rgba(120,90,160,0.35)] transition-all"
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary/15 dark:bg-primary/25 flex items-center justify-center mb-3 group-hover:bg-primary/25 dark:group-hover:bg-primary/35 transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-serif text-sm md:text-base text-foreground leading-snug">
                      {label}
                    </h3>
                    <p className="mt-1 text-[11px] text-foreground/70 leading-snug">
                      {desc}
                    </p>
                  </button>
                ))}
                {/* Tablet-only quick access to Themes */}
                <button
                  onClick={() => setActiveSection("themes")}
                  className="group relative hidden md:flex lg:hidden flex-col items-center text-center p-5 rounded-2xl bg-white/55 dark:bg-white/10 backdrop-blur-xl border border-white/60 dark:border-white/15 hover:bg-white/70 dark:hover:bg-white/20 hover:-translate-y-1 hover:shadow-[0_12px_36px_-12px_rgba(120,90,160,0.35)] transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/15 dark:bg-primary/25 flex items-center justify-center mb-3 group-hover:bg-primary/25 dark:group-hover:bg-primary/35 transition-colors">
                    <Palette className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-serif text-sm md:text-base text-foreground leading-snug">
                    Themes
                  </h3>
                  <p className="mt-1 text-[11px] text-foreground/70 leading-snug">
                    Switch the mood
                  </p>
                </button>
              </div>

              {/* Chat preview card */}
              <div className="bg-white/60 dark:bg-slate-900/55 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-[2rem] p-6 md:p-8 shadow-[0_20px_60px_-20px_rgba(120,90,160,0.35)] animate-fade-in">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary/50 border border-border shrink-0">
                    <img src={sirHootingtonImg} alt="Sir Hootington" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl text-foreground flex items-center gap-2">
                      Chat with Sir Hootington <span>🦉</span>
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Your AI companion for emotional support and guidance
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <ChatSection
                    userName={displayName}
                    userAge={userAge}
                    hideHeader
                    onFirstUserMessage={() => {
                      setActiveSection("chat");
                      setSidebarOpen(false);
                    }}
                  />
                </div>
              </div>
            </section>
          ) : activeSection === "chat" ? (
            <section key="chat" className="px-6 lg:px-12 pt-4 pb-10 max-w-4xl mx-auto w-full chat-enter">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-6">
                <div>
                  <h1 className="font-serif text-4xl md:text-5xl leading-tight text-foreground">
                    {meta.title}
                  </h1>
                  <p className="mt-3 font-serif italic text-lg text-muted-foreground max-w-md">
                    {meta.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-white/35 backdrop-blur-xl border border-white/40 rounded-[2rem] p-4 pr-6 shadow-[0_8px_28px_-12px_rgba(120,90,160,0.25)] max-w-sm">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary/50 border border-border shrink-0">
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

              {/* Chat rendered directly on the dreamy background — no outer card */}
              <div className="chat-enter-soft">
                {renderSection()}
              </div>
            </section>
          ) : (
            <section key={activeSection} className="px-6 lg:px-12 pt-4 pb-10 max-w-6xl mx-auto w-full section-enter">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-8">
                <div>
                  <h1 className="font-serif text-4xl md:text-5xl leading-tight text-foreground">
                    {meta.title}
                  </h1>
                  <p className="mt-3 font-serif italic text-lg text-muted-foreground max-w-md">
                    {meta.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-white/35 backdrop-blur-xl border border-white/40 rounded-[2rem] p-4 pr-6 shadow-[0_8px_28px_-12px_rgba(120,90,160,0.25)] max-w-sm">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary/50 border border-border shrink-0">
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

              <div className="bg-white/35 backdrop-blur-2xl border border-white/40 rounded-[2rem] p-6 md:p-10 shadow-[0_20px_60px_-20px_rgba(120,90,160,0.3)] animate-fade-in">
                {renderSection()}
              </div>
            </section>
          )}
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