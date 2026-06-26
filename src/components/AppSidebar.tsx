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
  { key: "home", label: "Home", icon: Home },
  { key: "chat", label: "Chat", icon: MessageCircle },
  { key: "emotions", label: "Analytics", icon: Heart },
  { key: "journal", label: "Journal", icon: PenTool },
  { key: "mindfulness", label: "Mindfulness", icon: Flower2 },
  { key: "mbti", label: "Personality Test", icon: Brain },
];

const secondary: { key: AppSection; label: string; icon: any }[] = [
  { key: "emergency", label: "Emergency Help", icon: Phone },
  { key: "settings", label: "Settings", icon: Shield },
  { key: "themes", label: "Themes", icon: Palette },
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
    const isDanger = item.key === "emergency";
    return (
      <SidebarMenuItem key={item.key}>
        <SidebarMenuButton
          isActive={active}
          onClick={() => onSelect(item.key)}
          className={
            isDanger
              ? "gap-3 rounded-xl text-destructive hover:text-destructive data-[active=true]:bg-destructive/10"
              : "gap-3 rounded-xl data-[active=true]:bg-secondary data-[active=true]:text-foreground"
          }
        >
          <item.icon className="w-4 h-4 opacity-70" />
          {!collapsed && <span className="font-sans">{item.label}</span>}
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-none">
      <SidebarHeader className="px-5 pt-6 pb-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:items-center">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 group group-data-[collapsible=icon]:justify-center"
        >
          <img src={logoImage} alt="MindfulMe" className="w-8 h-8 shrink-0" />
          {!collapsed && (
            <span className="font-serif text-xl tracking-tight text-foreground">
              MindfulMe
            </span>
          )}
        </button>
      </SidebarHeader>

      <SidebarContent className="px-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:items-center">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{primary.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-2 border-t border-border/60 pt-3">
          <SidebarGroupContent>
            <SidebarMenu>{secondary.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border">
        {!collapsed && (
          <div className="relative overflow-hidden px-4 py-4 rounded-2xl bg-gradient-to-br from-primary/15 via-accent/10 to-secondary/40 border border-primary/20">
            <div className="absolute -right-2 -top-2 w-12 h-12 rounded-full bg-primary/20 blur-xl" />
            <p className="relative text-[10px] tracking-[0.22em] uppercase font-semibold text-primary/80">
              Daily reflection
            </p>
            <p className="relative mt-1.5 font-serif italic text-sm leading-snug text-foreground/80">
              Take a deep breath.
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