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
    text: string;
  };
};

const themes: ThemeOption[] = [
  // Light themes
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    mode: "light",
    colors: {
      bg: "from-sky-50 to-cyan-100",
      card: "bg-white/80",
      primary: "bg-cyan-500",
      accent: "bg-teal-400",
      text: "text-slate-700",
    },
  },
  {
    id: "lavender-mist",
    name: "Lavender Mist",
    mode: "light",
    colors: {
      bg: "from-purple-50 to-pink-100",
      card: "bg-white/80",
      primary: "bg-purple-400",
      accent: "bg-pink-300",
      text: "text-purple-900",
    },
  },
  {
    id: "morning-meadow",
    name: "Morning Meadow",
    mode: "light",
    colors: {
      bg: "from-green-50 to-emerald-100",
      card: "bg-white/80",
      primary: "bg-emerald-500",
      accent: "bg-lime-400",
      text: "text-emerald-900",
    },
  },
  // Dark themes
  {
    id: "midnight-calm",
    name: "Midnight Calm",
    mode: "dark",
    colors: {
      bg: "from-slate-900 to-indigo-950",
      card: "bg-slate-800/80",
      primary: "bg-indigo-500",
      accent: "bg-violet-400",
      text: "text-slate-100",
    },
  },
  {
    id: "aurora-night",
    name: "Aurora Night",
    mode: "dark",
    colors: {
      bg: "from-slate-900 via-purple-950 to-slate-900",
      card: "bg-purple-900/50",
      primary: "bg-fuchsia-500",
      accent: "bg-cyan-400",
      text: "text-purple-100",
    },
  },
  {
    id: "forest-twilight",
    name: "Forest Twilight",
    mode: "dark",
    colors: {
      bg: "from-gray-900 to-green-950",
      card: "bg-gray-800/80",
      primary: "bg-emerald-600",
      accent: "bg-teal-400",
      text: "text-green-100",
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
    localStorage.setItem("mindfulme-theme", selectedTheme);
    const theme = themes.find((t) => t.id === selectedTheme);
    
    if (theme) {
      document.documentElement.classList.remove("dark");
      document.documentElement.removeAttribute("data-theme");
      
      if (theme.mode === "dark") {
        document.documentElement.classList.add("dark");
      }
      document.documentElement.setAttribute("data-theme", theme.id);
    }
    
    // Dispatch custom event for other components to react
    window.dispatchEvent(new CustomEvent("themeChange", { detail: theme }));
  }, [selectedTheme]);

  const ThemePreviewCard = ({ theme }: { theme: ThemeOption }) => {
    const isSelected = selectedTheme === theme.id;
    
    return (
      <Card
        onClick={() => setSelectedTheme(theme.id)}
        className={`relative cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isSelected ? "ring-2 ring-primary ring-offset-2" : ""
        }`}
      >
        {/* Preview panel */}
        <div className={`h-32 bg-gradient-to-br ${theme.colors.bg} p-3`}>
          {/* Mini header */}
          <div className={`${theme.colors.card} rounded-md p-2 mb-2 backdrop-blur-sm`}>
            <div className={`h-2 w-16 ${theme.colors.primary} rounded-full`}></div>
          </div>
          
          {/* Mini content */}
          <div className={`${theme.colors.card} rounded-md p-2 backdrop-blur-sm`}>
            <div className={`h-1.5 w-12 ${theme.colors.accent} rounded-full mb-1.5`}></div>
            <div className={`h-1.5 w-20 ${theme.colors.primary} rounded-full opacity-60`}></div>
          </div>
        </div>
        
        {/* Theme name */}
        <div className="p-3 bg-card border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{theme.name}</span>
            {isSelected && (
              <Check className="w-4 h-4 text-primary" />
            )}
          </div>
          <span className="text-xs text-muted-foreground capitalize">{theme.mode} theme</span>
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

      <div className="grid grid-cols-2 gap-4">
        {/* Light themes column */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground text-center">☀️ Light Themes</h4>
          {lightThemes.map((theme) => (
            <ThemePreviewCard key={theme.id} theme={theme} />
          ))}
        </div>
        
        {/* Dark themes column */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground text-center">🌙 Dark Themes</h4>
          {darkThemes.map((theme) => (
            <ThemePreviewCard key={theme.id} theme={theme} />
          ))}
        </div>
      </div>
    </div>
  );
};
