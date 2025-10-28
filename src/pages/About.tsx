import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Heart, Brain, BookOpen, Sparkles, Target, Users, TrendingUp } from "lucide-react";
import { FloatingBubbles } from "@/components/ui/floating-bubbles";
import { BreathingOrb } from "@/components/ui/breathing-orb";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Companion",
      description: "Advanced Groq AI provides personalized, empathetic support tailored to your unique emotional landscape and MBTI personality type."
    },
    {
      icon: BookOpen,
      title: "Smart Journaling",
      description: "Not just a diary - our intelligent journal analyzes patterns, tracks emotional growth, and provides insights into your mental wellness journey."
    },
    {
      icon: Heart,
      title: "Emotion Analytics",
      description: "Visualize your emotional patterns with beautiful charts and gain deeper self-awareness through data-driven insights."
    },
    {
      icon: Sparkles,
      title: "Mindfulness Integration",
      description: "Guided breathing exercises, meditation practices, and calming techniques designed specifically for young minds navigating modern challenges."
    }
  ];

  const stats = [
    { value: "250:1 to 1000:1", label: "Student-Counselor Ratio Globally" },
    { value: "24/7", label: "AI Support Availability" },
    { value: "100%", label: "Privacy Protected" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Immersive Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20" />
      <FloatingBubbles />
      
      {/* Ambient Orbs */}
      <div className="fixed top-20 left-10 opacity-30">
        <BreathingOrb size="lg" />
      </div>
      <div className="fixed bottom-20 right-10 opacity-30">
        <BreathingOrb size="lg" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
        {/* Back Button */}
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="mb-8 backdrop-blur-sm bg-white/50 hover:bg-white/80 dark:bg-gray-800/50 dark:hover:bg-gray-800/80"
        >
          ← Back to Home
        </Button>

        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">About Mindful Me</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Every Young Soul Deserves Guidance
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            In a world where student-to-counselor ratios range from 250:1 to 1000:1, 
            countless young minds navigate their emotions, careers, and adolescence alone.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-2 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission Section */}
        <Card className="mb-16 backdrop-blur-md bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-800/60 border-2 border-primary/20 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" />
          <CardContent className="p-8 md:p-12 relative">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-8 h-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">My Mission</h2>
            </div>
            <p className="text-lg leading-relaxed mb-6">
              I created Mindful Me because I believe in something simple but powerful: <span className="font-semibold text-primary">every young person deserves access to mental health support, career guidance, and emotional wellness tools</span> - no matter what school they go to or where they live.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              When I looked around, I saw the numbers - student-to-counselor ratios of 250:1, sometimes even 1000:1 in many places around the world. I saw my friends struggling with stress, anxiety, and pressure to figure out their entire future, often with nowhere to turn. That's when I realized: what if we could use AI not to replace human connection, but to make support accessible whenever someone needs it?
            </p>
            <p className="text-lg leading-relaxed mb-6">
              I'm combining my passion for artificial intelligence with my deep interest in psychology to build something that actually helps. Through Mindful Me, I want to empower young people like me to understand their emotions better, build healthy habits through journaling and mindfulness, and develop the self-awareness we all need to navigate today's complex world.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
                <Heart className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Emotional Wellness</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium">Career Guidance</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10">
                <BookOpen className="w-4 h-4 text-pink-600" />
                <span className="text-sm font-medium">Healthy Habits</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Mindfulness Practice</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Target Audience */}
        <Card className="mb-16 backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-2">
          <CardContent className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">Who It's For</h2>
            </div>
            <p className="text-lg leading-relaxed mb-4">
              While <span className="font-semibold text-primary">Mindful Me is primarily designed for youth aged 12-25</span>, our platform welcomes anyone seeking emotional support, self-discovery, and mental wellness tools. Whether you're navigating the challenges of adolescence, exploring career paths, or simply seeking a safe space to process your emotions, you belong here.
            </p>
          </CardContent>
        </Card>

        {/* Key Features */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">What Makes Us Different</h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're not just another chatbot - we're a comprehensive mental wellness ecosystem designed for the digital generation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-2 hover:border-primary/50 hover:scale-105 transition-all duration-300 group"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 group-hover:scale-110 transition-transform">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Creator Section - Written in First Person */}
        <Card className="mb-16 backdrop-blur-md bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border-2 border-primary/30 shadow-xl">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                  AP
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-3">Hi, I'm Arnav 👋</h2>
                <h3 className="text-xl font-semibold text-primary mb-4">14 Years Old | AI Enthusiast | Psychology Explorer</h3>
                <p className="text-lg leading-relaxed mb-4">
                  I'm 14, and I built Mindful Me because I saw something that really bothered me: my friends and classmates struggling with stress, anxiety, and the overwhelming pressure to figure out their entire futures - often with no one to turn to. The numbers shocked me even more - in some places, there's one counselor for every 250 to 1000 students. That's insane.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  I've always been fascinated by two things: artificial intelligence and understanding how people think and feel. Psychology is incredible - the way our minds work, how emotions shape our decisions, why we behave the way we do. And AI? It's like magic, but it's real. I thought: what if I could combine these two passions to actually help people?
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  So I created Mindful Me. It's not meant to replace therapists or counselors - they're irreplaceable. But I wanted to build something that's there when you need it, at 2 AM when you can't sleep because of anxiety, or when you just need someone to listen without judgment. 
                </p>
                <p className="text-lg leading-relaxed">
                  This platform is my vision of making mental health support accessible to everyone, especially young people like me who are navigating the chaos of growing up in a hyperconnected world. I hope Mindful Me can be that safe space where you feel heard, understood, and supported - because you deserve that. We all do.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-2 text-center">
          <CardContent className="p-8 md:p-12">
            <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Have questions, feedback, or want to collaborate? We'd love to hear from you!
            </p>
            <a href="mailto:arnavp1728@gmail.com">
              <Button size="lg" className="text-lg px-8 py-6 hover:scale-105 transition-transform">
                <Mail className="w-5 h-5 mr-2" />
                arnavp1728@gmail.com
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Footer Message */}
        <div className="text-center mt-16 mb-8">
          <p className="text-lg text-muted-foreground italic">
            "Your mental health journey matters. You matter. And you're not alone." 💙
          </p>
        </div>
      </div>
    </div>
  );
}
