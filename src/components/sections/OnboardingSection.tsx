import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Check, ChevronRight, Heart, Sparkles, Shield, Brain } from "lucide-react";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: OnboardingStep[] = [
  {
    id: 1,
    title: "Welcome to MindfulMe",
    description: "Your personal mental wellness companion designed just for you.",
    icon: <Heart className="w-8 h-8 text-primary" />,
  },
  {
    id: 2,
    title: "Your Journey Matters",
    description: "Track your emotions, chat with AI support, and discover mindfulness exercises.",
    icon: <Sparkles className="w-8 h-8 text-accent-foreground" />,
  },
  {
    id: 3,
    title: "Privacy First",
    description: "Your data is private. You control what's shared with parents or guardians.",
    icon: <Shield className="w-8 h-8 text-success" />,
  },
  {
    id: 4,
    title: "Personalize Your Experience",
    description: "Tell us a bit about yourself to customize your wellness journey.",
    icon: <Brain className="w-8 h-8 text-warning-foreground" />,
  },
];

interface OnboardingSectionProps {
  onComplete?: () => void;
}

export const OnboardingSection = ({ onComplete }: OnboardingSectionProps) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [displayName, setDisplayName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) {
      toast.error("Please sign in to complete onboarding");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName || user.email?.split("@")[0],
          onboarding_completed: true,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Welcome to MindfulMe! 🎉");
      onComplete?.();
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex justify-center gap-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              step.id === currentStep
                ? "bg-primary scale-125"
                : step.id < currentStep
                ? "bg-primary/60"
                : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Step content */}
      <Card className="overflow-hidden">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse-calm">
                {currentStepData.icon}
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {currentStepData.title}
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {currentStepData.description}
              </p>
            </div>

            {/* Personalization form on last step */}
            {currentStep === 4 && (
              <div className="max-w-sm mx-auto space-y-4 text-left">
                <div className="space-y-2">
                  <Label htmlFor="displayName">What should we call you?</Label>
                  <Input
                    id="displayName"
                    placeholder="Enter your name or nickname"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="text-center"
                  />
                </div>
              </div>
            )}

            {/* Feature highlights for step 2 */}
            {currentStep === 2 && (
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-4">
                {[
                  { emoji: "💬", label: "AI Chat Support" },
                  { emoji: "📊", label: "Emotion Tracking" },
                  { emoji: "🧘", label: "Mindfulness" },
                  { emoji: "📝", label: "Journaling" },
                ].map((feature) => (
                  <div
                    key={feature.label}
                    className="p-3 rounded-lg bg-muted/50 text-center transition-all hover:scale-105"
                  >
                    <div className="text-2xl mb-1">{feature.emoji}</div>
                    <div className="text-sm font-medium">{feature.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Privacy info for step 3 */}
            {currentStep === 3 && (
              <div className="space-y-3 max-w-sm mx-auto">
                {[
                  "End-to-end encrypted conversations",
                  "You control parent report settings",
                  "Delete your data anytime",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-success/10 text-left"
                  >
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="transition-all hover:scale-105"
        >
          Back
        </Button>

        {currentStep < steps.length ? (
          <Button
            onClick={handleNext}
            className="transition-all hover:scale-105 gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleComplete}
            disabled={isSubmitting}
            className="transition-all hover:scale-105 gap-2 bg-gradient-to-r from-primary to-accent"
          >
            {isSubmitting ? "Saving..." : "Get Started"}
            <Sparkles className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Skip option */}
      {!user && (
        <p className="text-center text-sm text-muted-foreground">
          <button
            onClick={onComplete}
            className="underline hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
        </p>
      )}
    </div>
  );
};
