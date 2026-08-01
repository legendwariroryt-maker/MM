import { useState } from "react";
import { Palette, Check } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useThemeId } from "@/lib/themeAvatars";

type Preset = {
  id: string;
  name: string;
  mode: "light" | "dark";
  swatch: string[];
};

const PRESETS: Preset[] = [
  { id: "ocean-breeze", name: "Lavender Sunset", mode: "light", swatch: ["#e9d5ff", "#fbcfe8", "#fed7aa"] },
  { id: "lavender-mist", name: "Cherry Blossom", mode: "light", swatch: ["#e0f2fe", "#fce7f3", "#ffe4e6"] },
  { id: "morning-meadow", name: "Misty Meadow", mode: "light", swatch: ["#f1f5f9", "#dcfce7", "#a7f3d0"] },
  { id: "midnight-calm", name: "Moonlit Ocean", mode: "dark", swatch: ["#0f172a", "#1e3a8a", "#312e81"] },
  { id: "aurora-night", name: "Purple Twilight", mode: "dark", swatch: ["#4c1d95", "#6b21a8", "#312e81"] },
  { id: "forest-twilight", name: "Starry Forest", mode: "dark", swatch: ["#020617", "#0c2340", "#0f172a"] },
];

const DARK_IDS = new Set(PRESETS.filter((p) => p.mode === "dark").map((p) => p.id));

function applyTheme(id: string) {
  localStorage.setItem("mindfulme-theme", id);
  document.documentElement.setAttribute("data-theme", id);
  document.documentElement.classList.toggle("dark", DARK_IDS.has(id));
  window.dispatchEvent(new CustomEvent("themeChange", { detail: { id } }));
}

export function ThemeQuickSwitcher() {
  const currentTheme = useThemeId();
  const [open, setOpen] = useState(false);

  return (
    <HoverCard open={open} onOpenChange={setOpen} openDelay={80} closeDelay={120}>
      <HoverCardTrigger asChild>
        <button
          aria-label="Quick themes"
          onClick={() => setOpen((v) => !v)}
          className="group flex items-center justify-center h-7 w-7 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 text-foreground/70 hover:text-foreground hover:bg-card/80 transition-all hover:-translate-y-0.5"
        >
          <Palette className="w-4 h-4 transition-transform group-hover:rotate-12" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        side="right"
        align="start"
        sideOffset={10}
        className="w-64 p-3 rounded-2xl border border-white/60 dark:border-border/60 bg-white/70 dark:bg-card/75 backdrop-blur-2xl shadow-[0_20px_60px_-20px_rgba(120,90,160,0.35)]"
      >
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-[10px] tracking-[0.22em] uppercase font-semibold text-foreground/70">
            Quick Themes
          </p>
          <Palette className="w-3.5 h-3.5 text-primary" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map((p) => {
            const active = currentTheme === p.id;
            return (
              <button
                key={p.id}
                onClick={() => applyTheme(p.id)}
                title={p.name}
                className={`group relative flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all hover:-translate-y-0.5 ${
                  active
                    ? "border-primary bg-primary/10 shadow-[0_4px_18px_-6px_hsl(var(--primary)/0.5)]"
                    : "border-white/55 dark:border-border/55 bg-white/55 dark:bg-card/55 hover:border-primary/50"
                }`}
              >
                <div className="relative w-full h-8 rounded-lg overflow-hidden flex">
                  {p.swatch.map((c, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                  ))}
                  {active && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <Check className="w-4 h-4 text-white drop-shadow" />
                    </div>
                  )}
                </div>
                <span className="text-[9px] leading-tight text-center text-foreground/80 font-medium truncate w-full">
                  {p.name}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-[10px] text-center text-muted-foreground">
          Click or hover the palette anytime · saves automatically
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}
