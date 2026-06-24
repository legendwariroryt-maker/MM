import {
  MessageCircle,
  Heart,
  PenTool,
  Flower2,
  Brain,
  Phone,
  Shield,
  Palette,
  Rocket,
  LogOut,
  LogIn,
  User as UserIcon,
  Home,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppSection } from "@/types";
import { useNavigate } from "react-router-dom";
import logoImage from "@/assets/mindful-me-logo.png";

const primary: { key: AppSection; label: string; icon: any }[] = [
  { key: "chat", label: "Chat", icon: MessageCircle },
  { key: "emotions", label: "Emotions", icon: Heart },
  { key: "journal", label: "Journal", icon: PenTool },
  { key: "mindfulness", label: "Mindfulness", icon: Flower2 },
  { key: "mbti", label: "Personality", icon: Brain },
];

const secondary: { key: AppSection; label: string; icon: any }[] = [
  { key: "themes", label: "Themes", icon: Palette },
  { key: "settings", label: "Privacy", icon: Shield },
  { key: "onboarding", label: "Onboarding", icon: Rocket },
];

interface AppSidebarProps {
  activeSection: AppSection;
  onSelect: (s: AppSection) => void;
  user: any;
  displayName?: string;
  onSignOut: () => void;
}

export function AppSidebar({ activeSection, onSelect, user, displayName, onSignOut }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  const renderItem = (item: { key: AppSection; label: string; icon: any }) => {
    const active = activeSection === item.key;
    return (
      <SidebarMenuItem key={item.key}>
        <SidebarMenuButton
          isActive={active}
          onClick={() => onSelect(item.key)}
          className="gap-3 rounded-xl data-[active=true]:bg-secondary data-[active=true]:text-foreground"
        >
          <item.icon className="w-4 h-4 opacity-70" />
          {!collapsed && <span className="font-sans">{item.label}</span>}
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
      <SidebarHeader className="px-5 pt-6 pb-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 group"
        >
          <img src={logoImage} alt="MindfulMe" className="w-8 h-8" />
          {!collapsed && (
            <span className="font-serif text-xl tracking-tight text-foreground">
              MindfulMe
            </span>
          )}
        </button>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground/70 font-semibold">
              Daily
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>{primary.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground/70 font-semibold">
              Account
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>{secondary.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-2">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onSelect("emergency")}
                  isActive={activeSection === "emergency"}
                  className="gap-3 rounded-xl text-destructive hover:text-destructive data-[active=true]:bg-destructive/10"
                >
                  <Phone className="w-4 h-4" />
                  {!collapsed && <span>Emergency</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border">
        {!collapsed && (
          <div className="px-2 py-3 rounded-2xl bg-card/60 border border-border">
            <p className="font-serif italic text-xs leading-relaxed text-muted-foreground">
              "Peace is found in the pauses between heartbeats."
            </p>
            <p className="mt-2 text-[9px] tracking-[0.2em] uppercase font-semibold text-primary">
              Sir Hootington
            </p>
          </div>
        )}
        <div className="mt-2 flex flex-col gap-1">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
          >
            <Home className="w-4 h-4" />
            {!collapsed && <span>Home</span>}
          </button>
          {user && (
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
            >
              <UserIcon className="w-4 h-4" />
              {!collapsed && <span>{displayName || "Profile"}</span>}
            </button>
          )}
          <button
            onClick={user ? onSignOut : () => navigate("/auth")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
          >
            {user ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            {!collapsed && <span>{user ? "Sign out" : "Sign in"}</span>}
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}