import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Heart, Flower2, PenTool, Phone } from "lucide-react";
import { AppSection } from "@/types";

interface NavigationProps {
  activeSection: AppSection;
  onSectionChange: (section: AppSection) => void;
}

const sections = [
  { id: 'chat' as AppSection, label: 'AI Chat', icon: MessageCircle, description: 'Talk to your AI companion' },
  { id: 'emotions' as AppSection, label: 'Emotions', icon: Heart, description: 'Track your feelings' },
  { id: 'mindfulness' as AppSection, label: 'Mindfulness', icon: Flower2, description: 'Breathing & meditation' },
  { id: 'journal' as AppSection, label: 'Journal', icon: PenTool, description: 'Write your thoughts' },
  { id: 'emergency' as AppSection, label: 'Support', icon: Phone, description: 'Crisis resources' },
];

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  return (
    <Card className="p-4 shadow-lg bg-gradient-to-r from-card to-muted/50">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? "wellness" : "ghost"}
            size="sm"
            onClick={() => onSectionChange(section.id)}
            className="flex flex-col h-auto p-3 text-center"
          >
            <section.icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{section.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
}