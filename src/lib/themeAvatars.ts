import avatarOceanBreeze from "@/assets/avatars/avatar-ocean-breeze.png";
import avatarLavenderMist from "@/assets/avatars/avatar-lavender-mist.png";
import avatarMorningMeadow from "@/assets/avatars/avatar-morning-meadow.png";
import avatarMidnightCalm from "@/assets/avatars/avatar-midnight-calm.png";
import avatarAuroraNight from "@/assets/avatars/avatar-aurora-night.png";
import avatarForestTwilight from "@/assets/avatars/avatar-forest-twilight.png";

import bgOceanBreeze from "@/assets/dashboard-hero-bg.jpg";
import bgLavenderMist from "@/assets/themes/light-blossom.jpg";
import bgMorningMeadow from "@/assets/themes/light-meadow.jpg";
import bgMidnightCalm from "@/assets/themes/dark-moonlit-ocean.jpg";
import bgAuroraNight from "@/assets/themes/dark-purple-twilight.jpg";
import bgForestTwilight from "@/assets/themes/dark-starry-forest.jpg";

import { useEffect, useState } from "react";

export const themeAvatars: Record<string, string> = {
  "ocean-breeze": avatarOceanBreeze,
  "lavender-mist": avatarLavenderMist,
  "morning-meadow": avatarMorningMeadow,
  "midnight-calm": avatarMidnightCalm,
  "aurora-night": avatarAuroraNight,
  "forest-twilight": avatarForestTwilight,
};

export const themeBackgrounds: Record<string, string> = {
  "ocean-breeze": bgOceanBreeze,
  "lavender-mist": bgLavenderMist,
  "morning-meadow": bgMorningMeadow,
  "midnight-calm": bgMidnightCalm,
  "aurora-night": bgAuroraNight,
  "forest-twilight": bgForestTwilight,
};

export const getCurrentThemeId = (): string =>
  (typeof document !== "undefined" && document.documentElement.getAttribute("data-theme")) ||
  "ocean-breeze";

export function useThemeId(): string {
  const [theme, setTheme] = useState<string>(() => getCurrentThemeId());
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.id) setTheme(detail.id);
    };
    window.addEventListener("themeChange", handler);
    return () => window.removeEventListener("themeChange", handler);
  }, []);
  return theme;
}

export function useThemeAvatar(): string {
  const theme = useThemeId();
  return themeAvatars[theme] || themeAvatars["ocean-breeze"];
}