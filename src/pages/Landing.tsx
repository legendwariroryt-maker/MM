import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// Decor stripped for premium editorial pass
import { 
  MessageCircle, 
  Heart, 
  Flower2, 
  PenTool, 
  Phone, 
  Brain, 
  Shield, 
  Clock, 
  Sparkles,
  ArrowRight,
  ChevronDown,
  Lock,
  Zap,
  Star,
  Palette
} from "lucide-react";
import logoImage from "@/assets/mindful-me-logo.png";
import sirHootingtonStanding from "@/assets/sir-hootington-standing.png";
import owlVideo from "@/assets/owl-hero.mp4.asset.json";

const Landing = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const videoElRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const bgSectionRef = useRef<HTMLDivElement>(null);

  // Scroll-scrubbed background video (advances currentTime as user scrolls)
  const { scrollYProgress: bgProgress } = useScroll({
    target: bgSectionRef,
    offset: ["start start", "end start"],
  });
  useEffect(() => {
    const v = bgVideoRef.current;
    if (!v) return;
    const setReady = () => {
      // ensure metadata loaded
    };
    v.addEventListener("loadedmetadata", setReady);
    const unsub = bgProgress.on("change", (p) => {
      if (!v.duration || isNaN(v.duration)) return;
      const t = Math.min(v.duration - 0.05, Math.max(0, p * v.duration));
      try {
        v.currentTime = t;
      } catch {}
    });
    return () => {
      v.removeEventListener("loadedmetadata", setReady);
      unsub();
    };
  }, [bgProgress]);

  const { scrollYProgress: videoProgress } = useScroll({
    target: videoSectionRef,
    offset: ["start end", "end start"],
  });
  const videoScale = useTransform(videoProgress, [0, 0.5, 1], [0.82, 1, 1.05]);
  const videoRadius = useTransform(videoProgress, [0, 0.5, 1], ["2.5rem", "1rem", "2.5rem"]);
  const overlayOpacity = useTransform(videoProgress, [0, 0.4, 0.7, 1], [0.7, 0.2, 0.2, 0.7]);
  const captionY = useTransform(videoProgress, [0.2, 0.6], [60, 0]);
  const captionOpacity = useTransform(videoProgress, [0.2, 0.45], [0, 1]);

  // Play video only when in view (perf + battery)
  useEffect(() => {
    const el = videoElRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".scroll-animate").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: MessageCircle,
      title: "AI Supportive Chat",
      description: "Talk to your personal AI companion anytime. Get empathetic responses, coping strategies, and emotional support tailored just for you.",
      color: "from-blue-500 to-cyan-500",
      section: "chat"
    },
    {
      icon: Heart,
      title: "Emotion Analytics",
      description: "Track your emotional patterns with beautiful visualizations. Understand your feelings better with mood history charts and insights.",
      color: "from-pink-500 to-rose-500",
      section: "emotions"
    },
    {
      icon: PenTool,
      title: "Wellness Journal",
      description: "Express your thoughts in a safe, private space. Write freely and reflect on your journey with guided prompts.",
      color: "from-amber-500 to-orange-500",
      section: "journal"
    },
    {
      icon: Flower2,
      title: "Mindfulness Exercises",
      description: "Calm your mind with guided breathing exercises and meditation. Find peace in the present moment.",
      color: "from-green-500 to-emerald-500",
      section: "mindfulness"
    },
    {
      icon: Brain,
      title: "Personality Insights",
      description: "Discover your MBTI personality type. Understand yourself better and learn how you interact with the world.",
      color: "from-purple-500 to-violet-500",
      section: "mbti"
    },
    {
      icon: Phone,
      title: "Emergency Support",
      description: "Immediate access to crisis resources and hotlines. You're never alone—help is always available.",
      color: "from-red-500 to-pink-500",
      section: "emergency"
    },
    {
      icon: Palette,
      title: "Customizable Themes",
      description: "Personalize your experience with beautiful calming themes. From Ocean Breeze to Aurora Night, find your perfect aesthetic.",
      color: "from-indigo-500 to-purple-500",
      section: "themes"
    },
    {
      icon: Shield,
      title: "Privacy Controls",
      description: "You're in control. Choose what to share and keep your data secure with customizable privacy settings.",
      color: "from-teal-500 to-cyan-500",
      section: "settings"
    }
  ];

  const highlights = [
    { icon: Lock, title: "100% Private", description: "Your thoughts stay yours" },
    { icon: Clock, title: "24/7 Available", description: "Support whenever you need" },
    { icon: Zap, title: "Completely Free", description: "No hidden costs, ever" }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Fixed Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollY > 50 
            ? "bg-card/95 backdrop-blur-lg shadow-lg border-b border-border" 
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src={logoImage} 
              alt="MindfulMe Logo" 
              className="w-9 h-9"
            />
            <span className="font-serif text-xl tracking-tight text-foreground">
              MindfulMe
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/auth")}
              className="text-muted-foreground hover:text-foreground"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => navigate("/auth")}
              className="bg-primary text-primary-foreground hover:bg-primary-hover rounded-full px-6"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div ref={bgSectionRef} className="relative">
        {/* Fixed scroll-scrubbed background video */}
        <div
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden transition-opacity duration-300"
          style={{ opacity: Math.max(0, 1 - scrollY / 900) }}
        >
          <video
            ref={bgVideoRef}
            src={owlVideo.url}
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover scale-110"
          />
          {/* Atmospheric layers for premium feel */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.85)_75%)]" />
          <div
            className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>\")",
            }}
          />
          {/* Floating orbs */}
          <div className="absolute top-1/4 -left-24 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-24 w-[28rem] h-[28rem] rounded-full bg-accent/20 blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
        </div>

      <section
        ref={heroRef}
        className="min-h-screen flex flex-col items-center justify-center relative px-4 pt-20"
        style={{
          opacity: Math.max(0, 1 - scrollY / 800),
        }}
      >
        <motion.div 
          className="text-center max-w-4xl mx-auto relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.p
            className="text-[10px] tracking-[0.32em] uppercase text-primary font-semibold mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A Sanctuary for the Mind
          </motion.p>

          <motion.h1 
            className="font-serif text-5xl md:text-7xl mb-6 leading-[1.05] text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Your mind matters.
            <br />
            <span className="italic text-primary">We're here for you.</span>
          </motion.h1>

          <motion.p 
            className="font-serif italic text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            "Empowering teens to understand, express, and nurture their mental wellness."
          </motion.p>

          <motion.p 
            className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            A safe, judgment-free space where you can talk, reflect, and grow—whenever you need it.
          </motion.p>

          {/* Main CTA */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Button 
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-base px-10 py-7 bg-primary text-primary-foreground hover:bg-primary-hover transition-all duration-300 rounded-full group tracking-wide"
            >
              <MessageCircle className="w-5 h-5 mr-3" />
              Begin Your Journey
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div 
            className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            {highlights.map((item, i) => (
              <motion.div 
                key={i} 
                className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <item.icon className="w-4 h-4 text-primary" />
                <span className="font-medium">{item.title}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-muted-foreground" />
        </div>
      </section>
      </div>

      {/* Highlights Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((item, i) => (
              <Card 
                key={i}
                className="scroll-animate opacity-0 translate-y-10 p-8 text-center bg-card/80 backdrop-blur-sm border-border hover:scale-105 transition-all duration-500 hover:shadow-xl"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cinematic Video Showcase */}
      <section
        ref={videoSectionRef}
        className="relative h-[220vh] px-4"
      >
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <motion.div
            style={{ scale: videoScale, borderRadius: videoRadius }}
            className="relative w-[min(1200px,92vw)] h-[82vh] overflow-hidden shadow-[0_30px_120px_-20px_rgba(0,0,0,0.55)] ring-1 ring-white/10"
          >
            <video
              ref={videoElRef}
              src={owlVideo.url}
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Cinematic gradient overlays */}
            <motion.div
              style={{ opacity: overlayOpacity }}
              className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/80"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 mix-blend-overlay pointer-events-none" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[inherit] pointer-events-none" />

            {/* Caption */}
            <motion.div
              style={{ y: captionY, opacity: captionOpacity }}
              className="absolute inset-x-0 bottom-0 p-8 md:p-14 text-center"
            >
              <p className="text-[10px] tracking-[0.32em] uppercase text-white/70 font-semibold mb-3">
                A little wisdom, always with you
              </p>
              <h2 className="font-serif text-4xl md:text-6xl text-white leading-[1.05] drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
                Meet the friend who <span className="italic text-primary-foreground/90">listens</span>.
              </h2>
              <p className="mt-4 text-white/80 max-w-xl mx-auto font-serif italic text-lg">
                Sir Hootington is watching over your journey — soft, patient, and never asleep.
              </p>
            </motion.div>

            {/* Corner ornament */}
            <div className="absolute top-5 left-5 flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/15">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] tracking-[0.24em] uppercase text-white/90 font-semibold">Live • Sanctuary</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Meet Sir Hootington Section */}
      <section className="py-24 px-4 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <div className="scroll-animate opacity-0 translate-y-10 flex flex-col md:flex-row items-center gap-10">
            <motion.div 
              className="flex-shrink-0"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img 
                src={sirHootingtonStanding} 
                alt="Sir Hootington - Your Wise Owl Companion" 
                className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-2xl"
              />
            </motion.div>
            <div className="text-center md:text-left">
              <p className="text-[10px] tracking-[0.32em] uppercase text-primary font-semibold mb-4">A Wise Companion</p>
              <h2 className="font-serif text-4xl md:text-5xl mb-4 text-foreground">
                Meet Sir Hootington
              </h2>
              <p className="font-serif italic text-xl text-muted-foreground mb-6">
                Your wise &amp; witty wellness companion.
              </p>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Sir Hootington is no ordinary owl. A distinguished graduate of Harvard University with a double major in Psychology and "Advanced Listening Arts," he spent years studying under the legendary Owl of Minerva before deciding to dedicate his life to helping teens navigate their emotional journeys.
                </p>
                <p>
                  When he's not dispensing wisdom and comfort, Sir Hootington enjoys sipping chamomile tea, reorganizing his extensive collection of self-help scrolls, and practicing his signature "Supportive Head Tilt™" in the mirror.
                </p>
                <p className="font-medium text-foreground">
                  His motto? "A hoot a day keeps the worries away!" 🌙
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-20 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="scroll-animate opacity-0 translate-y-10 font-serif text-4xl md:text-5xl mb-8 text-foreground">
            About MindfulMe
          </h2>
          
          <div className="scroll-animate opacity-0 translate-y-10 space-y-6 text-lg text-muted-foreground">
            <p>
              MindfulMe is a teen mental health companion designed to provide a safe, judgment-free space for young people to explore and express their emotions.
            </p>
            <p>
              Growing up in today's world isn't easy. Between school pressures, social challenges, and everything in between—it's completely normal to feel overwhelmed sometimes. That's why MindfulMe exists: to be your supportive friend who's always ready to listen.
            </p>
            <p>
              Whether you're feeling stressed, anxious, happy, or just need someone to talk to, MindfulMe is here 24/7. Our AI companion provides empathetic support while our tools help you understand your emotions better, practice mindfulness, and build healthy coping strategies.
            </p>
            <p className="font-medium text-foreground">
              Remember: It's okay to not be okay. Seeking support is a sign of strength, not weakness.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="scroll-animate opacity-0 translate-y-10 font-serif text-4xl md:text-5xl text-center mb-4 text-foreground">
            Everything You Need
          </h2>
          <p className="scroll-animate opacity-0 translate-y-10 text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            Powerful tools designed with your mental wellness in mind
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card 
                key={i}
                className="scroll-animate opacity-0 translate-y-10 group p-6 bg-card/80 backdrop-blur-sm border-border hover:scale-105 transition-all duration-500 hover:shadow-xl cursor-pointer"
                style={{ transitionDelay: `${i * 50}ms` }}
                onClick={() => navigate(`/app?section=${feature.section}`)}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Try it now <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial/Value Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="scroll-animate opacity-0 translate-y-10">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-6" />
            <blockquote className="text-2xl md:text-3xl font-medium text-foreground mb-8 leading-relaxed">
              "Your mental health journey is unique, and so is our support. No judgment, no pressure—just a caring companion ready to listen whenever you need."
            </blockquote>
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-muted-foreground">
              Designed with love for teens who deserve support
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section ref={ctaRef} className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 via-purple-600/10 to-blue-600/10" />
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="scroll-animate opacity-0 translate-y-10 font-serif text-4xl md:text-5xl mb-6 text-foreground">
            Ready to begin your
            <span className="block italic text-primary">wellness journey?</span>
          </h2>
          
          <p className="scroll-animate opacity-0 translate-y-10 text-xl text-muted-foreground mb-10">
            Join thousands of teens who've found a safe space to express themselves.
            It's free, private, and available whenever you need it.
          </p>

          <div className="scroll-animate opacity-0 translate-y-10">
            <Button 
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-base px-14 py-7 bg-primary text-primary-foreground hover:bg-primary-hover transition-all duration-300 rounded-full group tracking-wide"
            >
              <Heart className="w-5 h-5 mr-3" />
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <p className="scroll-animate opacity-0 translate-y-10 mt-8 text-sm text-muted-foreground">
            No credit card required • No strings attached • Just support when you need it
          </p>
        </div>

      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border bg-card/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="MindfulMe" className="w-8 h-8" />
            <span className="font-semibold text-foreground">MindfulMe</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Made with 💙 for teens who matter
          </p>
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/app?section=emergency")}>
              Crisis Support
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
              Get Started
            </Button>
          </div>
        </div>
      </footer>

      {/* CSS for scroll animations */}
      <style>{`
        .scroll-animate {
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .scroll-animate.animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
};

export default Landing;
