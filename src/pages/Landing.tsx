import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <div className="min-h-screen bg-background relative overflow-x-hidden font-sans text-foreground">
      {/* Ambient editorial background — soft blush & lavender */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-bg)" }} />
        <div className="absolute -top-40 -left-32 w-[42rem] h-[42rem] rounded-full bg-primary/25 blur-[140px] animate-pulse-calm" />
        <div className="absolute top-1/3 -right-40 w-[38rem] h-[38rem] rounded-full bg-accent/25 blur-[140px] animate-pulse-calm" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-0 left-1/3 w-[30rem] h-[30rem] rounded-full bg-secondary/40 blur-[120px] animate-pulse-calm" style={{ animationDelay: "3s" }} />
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />
      </div>

      {/* Fixed Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollY > 50 
            ? "bg-card/70 backdrop-blur-2xl shadow-[0_1px_0_hsl(var(--border))]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src={logoImage} 
              alt="MindfulMe Logo" 
              className="w-9 h-9 drop-shadow-sm"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-serif text-xl tracking-tight text-foreground">MindfulMe</span>
              <span className="text-[9px] tracking-[0.32em] uppercase text-muted-foreground">Quiet Care</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/auth")}
              className="text-muted-foreground hover:text-foreground rounded-full"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => navigate("/auth")}
              className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6 shadow-sm"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero — editorial split with soft mascot */}
      <section
        ref={heroRef}
        className="min-h-screen flex items-center relative px-6 pt-28 pb-20"
      >
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-[1.15fr_1fr] gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-3 mb-8">
              <span className="h-px w-10 bg-foreground/40" />
              <span className="text-[10px] tracking-[0.36em] uppercase text-muted-foreground font-medium">
                A Sanctuary for the Mind
              </span>
            </div>

            <h1 className="font-serif text-[3.25rem] md:text-[5rem] leading-[0.98] tracking-[-0.02em] text-foreground mb-8">
              A quiet place
              <br />
              to feel
              <span className="italic text-primary"> understood</span>.
            </h1>

            <p className="font-serif italic text-xl md:text-2xl text-muted-foreground max-w-xl mb-4 leading-relaxed">
              "Empowering teens to understand, express, and nurture their mental wellness."
            </p>
            <p className="text-base text-muted-foreground max-w-lg mb-10 leading-relaxed">
              A safe, judgment-free space where you can talk, reflect, and grow — whenever you need it.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-14">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="group text-base px-8 py-6 bg-foreground text-background hover:bg-foreground/90 rounded-full shadow-medium"
              >
                Begin your journey
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => aboutRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="text-base px-6 py-6 text-foreground hover:bg-foreground/5 rounded-full"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Meet Sir Hootington
              </Button>
            </div>

            {/* Trust row — inline hairline */}
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {highlights.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-card/70 backdrop-blur-md border border-border">
                    <item.icon className="w-4 h-4 text-primary" />
                  </span>
                  <div className="leading-tight">
                    <div className="font-serif text-sm text-foreground">{item.title}</div>
                    <div className="text-[11px] text-muted-foreground">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Mascot portrait card */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-primary/25 via-accent/20 to-secondary/40 blur-3xl" />
            <div className="relative rounded-[2.5rem] bg-card/60 backdrop-blur-2xl border border-border p-10 shadow-medium overflow-hidden">
              <div className="absolute top-6 right-6 text-[10px] tracking-[0.32em] uppercase text-muted-foreground">
                Vol. 01
              </div>
              <img
                src={sirHootingtonStanding}
                alt="Sir Hootington"
                className="relative w-full h-[420px] object-contain drop-shadow-2xl animate-float"
              />
              <div className="mt-6 pt-6 border-t border-border/60 flex items-center justify-between">
                <div>
                  <div className="font-serif italic text-lg text-foreground">Sir Hootington</div>
                  <div className="text-[11px] tracking-[0.24em] uppercase text-muted-foreground">Wellness Companion</div>
                </div>
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-[10px] tracking-[0.32em] uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-gentle-bounce" />
        </div>
      </section>

      {/* Editorial pillars */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 scroll-animate opacity-0 translate-y-6">
            <span className="text-[10px] tracking-[0.36em] uppercase text-muted-foreground">Our promise</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-3 tracking-[-0.02em]">
              Three <span className="italic text-primary">quiet</span> commitments.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {highlights.map((item, i) => (
              <Card 
                key={i}
                className="scroll-animate opacity-0 translate-y-6 relative group p-10 bg-card/60 backdrop-blur-2xl border-border rounded-3xl transition-all duration-500 hover:-translate-y-1 hover:shadow-medium"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-serif italic text-3xl text-primary/80">0{i + 1}</span>
                  <span className="h-px flex-1 bg-border" />
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <h3 className="font-serif text-2xl text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
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
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
          <div className="text-center mb-6">
            <span className="text-[10px] tracking-[0.36em] uppercase text-muted-foreground">A little wisdom, always with you</span>
          </div>
          <motion.div
            style={{ scale: videoScale, borderRadius: videoRadius }}
            className="relative w-[min(1200px,92vw)] h-[74vh] overflow-hidden shadow-[0_40px_140px_-20px_hsl(var(--primary)/0.35)] ring-1 ring-border"
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
            <div className="absolute inset-0 ring-1 ring-inset ring-white/15 rounded-[inherit] pointer-events-none" />

            {/* Caption */}
            <motion.div
              style={{ y: captionY, opacity: captionOpacity }}
              className="absolute inset-x-0 bottom-0 p-8 md:p-14 text-center"
            >
              <p className="text-[10px] tracking-[0.32em] uppercase text-white/70 font-medium mb-3">
                Chapter I
              </p>
              <h2 className="font-serif text-4xl md:text-6xl text-white leading-[1.05] drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
                Meet the friend who <span className="italic text-primary-foreground/90">listens</span>.
              </h2>
              <p className="mt-4 text-white/80 max-w-xl mx-auto font-serif italic text-lg">
                Sir Hootington is watching over your journey — soft, patient, and never asleep.
              </p>
            </motion.div>

            {/* Corner ornament */}
            <div className="absolute top-5 left-5 flex items-center gap-2 bg-black/25 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-white/90" />
              <span className="text-[10px] tracking-[0.24em] uppercase text-white/90">Sanctuary</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Meet Sir Hootington Section */}
      <section ref={aboutRef} className="py-28 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-animate opacity-0 translate-y-6 grid md:grid-cols-[auto_1fr] items-center gap-14">
            <div className="relative flex-shrink-0 mx-auto">
              <div className="absolute -inset-8 rounded-full bg-gradient-to-br from-primary/30 via-accent/20 to-transparent blur-3xl" />
              <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full bg-card/60 backdrop-blur-2xl border border-border flex items-center justify-center overflow-hidden">
                <img
                  src={sirHootingtonStanding}
                  alt="Sir Hootington"
                  className="w-[85%] h-[85%] object-contain drop-shadow-2xl animate-float"
                />
              </div>
            </div>
            <div>
              <span className="text-[10px] tracking-[0.36em] uppercase text-muted-foreground">A Wise Companion</span>
              <h2 className="font-serif text-4xl md:text-5xl mt-3 mb-5 tracking-[-0.02em] text-foreground">
                Meet Sir Hootington
              </h2>
              <p className="font-serif italic text-xl text-muted-foreground mb-6">
                Your wise &amp; witty wellness companion.
              </p>
              <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
                <p>
                  Sir Hootington is no ordinary owl. A distinguished graduate of Harvard with a double major in Psychology and "Advanced Listening Arts," he studied under the legendary Owl of Minerva before devoting his life to helping teens navigate their emotional journeys.
                </p>
                <p>
                  When he isn't dispensing wisdom, he sips chamomile tea, reorganises his collection of self-help scrolls, and practises his signature "Supportive Head Tilt™" in the mirror.
                </p>
                <p className="font-serif italic text-foreground">
                  His motto? "A hoot a day keeps the worries away!" 🌙
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial manifesto */}
      <section className="py-28 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="scroll-animate opacity-0 translate-y-6 rounded-[2.5rem] bg-card/60 backdrop-blur-2xl border border-border p-10 md:p-16 shadow-medium">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-foreground/40" />
              <span className="text-[10px] tracking-[0.36em] uppercase text-muted-foreground">On MindfulMe</span>
            </div>
            <p className="font-serif text-2xl md:text-3xl leading-[1.4] text-foreground">
              Growing up isn't easy. Between school, friendships, and the quiet noise of your own thoughts, it's okay to feel overwhelmed. MindfulMe is a
              <span className="italic text-primary"> supportive friend</span> that listens — without judgement, without pressure, and always at your pace.
            </p>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
              It's okay to not be okay. Seeking support is a sign of strength, not weakness.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 scroll-animate opacity-0 translate-y-6">
            <div>
              <span className="text-[10px] tracking-[0.36em] uppercase text-muted-foreground">The Collection</span>
              <h2 className="font-serif text-4xl md:text-5xl mt-3 tracking-[-0.02em]">
                Everything <span className="italic text-primary">you need</span>.
              </h2>
            </div>
            <p className="text-muted-foreground max-w-sm">
              Eight quiet tools, thoughtfully designed for teenage minds — soft on the eyes, gentle on the heart.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, i) => (
              <Card 
                key={i}
                className="scroll-animate opacity-0 translate-y-6 group relative p-7 bg-card/60 backdrop-blur-2xl border-border rounded-3xl transition-all duration-500 hover:-translate-y-1 hover:shadow-medium cursor-pointer overflow-hidden"
                style={{ transitionDelay: `${i * 50}ms` }}
                onClick={() => navigate(`/app?section=${feature.section}`)}
              >
                <span className="absolute top-5 right-6 font-serif italic text-sm text-muted-foreground/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="w-12 h-12 mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-serif text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-5 pt-5 border-t border-border/60 flex items-center text-primary text-xs tracking-wide">
                  Enter <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pull-quote */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center scroll-animate opacity-0 translate-y-6">
          <Sparkles className="w-6 h-6 text-primary mx-auto mb-8" />
          <blockquote className="font-serif italic text-3xl md:text-4xl text-foreground leading-[1.35]">
            "Your mental health journey is unique, and so is our support. No judgement, no pressure — just a caring companion ready to listen whenever you need."
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-border" />
            <span className="text-[10px] tracking-[0.36em] uppercase text-muted-foreground">Made for teens who matter</span>
            <span className="h-px w-10 bg-border" />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section ref={ctaRef} className="py-28 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto scroll-animate opacity-0 translate-y-6">
          <div className="relative rounded-[2.5rem] overflow-hidden border border-border bg-card/60 backdrop-blur-2xl p-12 md:p-20 text-center shadow-medium">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/25 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-accent/25 blur-3xl" />
            <div className="relative">
              <span className="text-[10px] tracking-[0.36em] uppercase text-muted-foreground">Begin</span>
              <h2 className="font-serif text-4xl md:text-6xl mt-4 mb-6 tracking-[-0.02em] text-foreground leading-[1.05]">
                Ready for a quieter,
                <br />
                <span className="italic text-primary">softer</span> chapter?
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
                It's free, private, and always available. A safe place to talk, reflect, and grow.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="group text-base px-10 py-6 bg-foreground text-background hover:bg-foreground/90 rounded-full shadow-medium"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Start your journey
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => navigate("/app?section=emergency")}
                  className="text-base px-6 py-6 rounded-full hover:bg-foreground/5"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Crisis support
                </Button>
              </div>
              <p className="mt-8 text-xs tracking-wide text-muted-foreground">
                No credit card • No strings attached • Just support when you need it
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border/60 bg-card/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="MindfulMe" className="w-8 h-8" />
            <div className="leading-tight">
              <div className="font-serif text-foreground">MindfulMe</div>
              <div className="text-[9px] tracking-[0.32em] uppercase text-muted-foreground">Quiet Care</div>
            </div>
          </div>
          <p className="font-serif italic text-sm text-muted-foreground">
            Made with care for teens who matter.
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/app?section=emergency")} className="rounded-full">
              Crisis Support
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="rounded-full">
              Get Started
            </Button>
          </div>
        </div>
      </footer>

      {/* CSS for scroll animations */}
      <style>{`
        .scroll-animate {
          transition: opacity 0.9s ease-out, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
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
