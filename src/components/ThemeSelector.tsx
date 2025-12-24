import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

type ThemeOption = {
  id: string;
  name: string;
  mode: "light" | "dark";
  colors: {
    bg: string;
    card: string;
    primary: string;
    accent: string;
  };
};

const themes: ThemeOption[] = [
  // Light themes
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    mode: "light",
    colors: {
      bg: "from-cyan-50 to-teal-100",
      card: "bg-white/90",
      primary: "bg-cyan-500",
      accent: "bg-teal-400",
    },
  },
  {
    id: "lavender-mist",
    name: "Lavender Mist",
    mode: "light",
    colors: {
      bg: "from-purple-50 to-pink-100",
      card: "bg-white/90",
      primary: "bg-purple-400",
      accent: "bg-pink-300",
    },
  },
  {
    id: "morning-meadow",
    name: "Morning Meadow",
    mode: "light",
    colors: {
      bg: "from-green-50 to-emerald-100",
      card: "bg-white/90",
      primary: "bg-emerald-500",
      accent: "bg-lime-400",
    },
  },
  // Dark themes
  {
    id: "midnight-calm",
    name: "Midnight Calm",
    mode: "dark",
    colors: {
      bg: "from-slate-900 to-indigo-950",
      card: "bg-slate-800/90",
      primary: "bg-indigo-500",
      accent: "bg-violet-400",
    },
  },
  {
    id: "aurora-night",
    name: "Aurora Night",
    mode: "dark",
    colors: {
      bg: "from-purple-950 via-fuchsia-950 to-slate-900",
      card: "bg-purple-900/70",
      primary: "bg-fuchsia-500",
      accent: "bg-cyan-400",
    },
  },
  {
    id: "forest-twilight",
    name: "Forest Twilight",
    mode: "dark",
    colors: {
      bg: "from-gray-900 to-emerald-950",
      card: "bg-gray-800/90",
      primary: "bg-emerald-600",
      accent: "bg-teal-400",
    },
  },
];

export const ThemeSelector = () => {
  const [selectedTheme, setSelectedTheme] = useState<string>(() => {
    return localStorage.getItem("mindfulme-theme") || "ocean-breeze";
  });

  const lightThemes = themes.filter((t) => t.mode === "light");
  const darkThemes = themes.filter((t) => t.mode === "dark");

  useEffect(() => {
    applyTheme(selectedTheme);
  }, [selectedTheme]);

  const applyTheme = (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId);
    if (!theme) return;

    localStorage.setItem("mindfulme-theme", themeId);
    
    // Remove dark class first
    document.documentElement.classList.remove("dark");
    
    // Set data-theme attribute
    document.documentElement.setAttribute("data-theme", themeId);
    
    // Add dark class if needed
    if (theme.mode === "dark") {
      document.documentElement.classList.add("dark");
    }
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent("themeChange", { detail: theme }));
  };

  const ThemePreviewCard = ({ theme }: { theme: ThemeOption }) => {
    const isSelected = selectedTheme === theme.id;
    
    return (
      <Card
        onClick={() => setSelectedTheme(theme.id)}
        className={`relative cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 ${
          isSelected ? "ring-2 ring-primary ring-offset-2 border-primary" : "border-transparent"
        }`}
      >
        {/* Preview panel */}
        <div className={`h-36 bg-gradient-to-br ${theme.colors.bg} p-3 relative overflow-hidden`}>
          {/* Decorative circles */}
          <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full ${theme.colors.accent} opacity-30`}></div>
          <div className={`absolute -bottom-2 -left-2 w-12 h-12 rounded-full ${theme.colors.primary} opacity-20`}></div>
          
          {/* Mini header */}
          <div className={`${theme.colors.card} rounded-lg p-2 mb-2 backdrop-blur-sm shadow-sm`}>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 ${theme.colors.primary} rounded-full`}></div>
              <div className={`h-2 w-14 ${theme.colors.primary} rounded-full opacity-60`}></div>
            </div>
          </div>
          
          {/* Mini content */}
          <div className={`${theme.colors.card} rounded-lg p-2 backdrop-blur-sm shadow-sm`}>
            <div className={`h-2 w-16 ${theme.colors.accent} rounded-full mb-2`}></div>
            <div className={`h-1.5 w-full ${theme.colors.primary} rounded-full opacity-40`}></div>
            <div className={`h-1.5 w-3/4 ${theme.colors.primary} rounded-full opacity-30 mt-1`}></div>
          </div>
        </div>
        
        {/* Theme name */}
        <div className="p-3 bg-card border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{theme.name}</span>
            {isSelected && (
              <div className="bg-primary rounded-full p-0.5">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground capitalize flex items-center gap-1">
            {theme.mode === "light" ? "☀️" : "🌙"} {theme.mode} theme
          </span>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
          🎨 Choose Your Theme
        </h3>
        <p className="text-muted-foreground">
          Select a soothing theme that feels right for you
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Light themes column */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground text-center py-2 bg-muted/50 rounded-lg">
            ☀️ Light Themes
          </h4>
          <div className="space-y-4">
            {lightThemes.map((theme) => (
              <ThemePreviewCard key={theme.id} theme={theme} />
            ))}
          </div>
        </div>
        
        {/* Dark themes column */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground text-center py-2 bg-muted/50 rounded-lg">
            🌙 Dark Themes
          </h4>
          <div className="space-y-4">
            {darkThemes.map((theme) => (
              <ThemePreviewCard key={theme.id} theme={theme} />
            ))}
          </div>
        </div>
      </div>
      
      <p className="text-center text-xs text-muted-foreground">
        Theme preference is saved automatically ✨
      </p>
    </div>
  );
};

// Export function to apply theme on app load
export const initializeTheme = () => {
  const savedTheme = localStorage.getItem("mindfulme-theme") || "ocean-breeze";
  const themes = ["ocean-breeze", "lavender-mist", "morning-meadow", "midnight-calm", "aurora-night", "forest-twilight"];
  const darkThemes = ["midnight-calm", "aurora-night", "forest-twilight"];
  
  if (themes.includes(savedTheme)) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    if (darkThemes.includes(savedTheme)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
};
