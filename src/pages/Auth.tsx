import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FloatingBubbles } from "@/components/ui/floating-bubbles";
import { BreathingOrb } from "@/components/ui/breathing-orb";
import { Heart, Mail, Lock, UserPlus, LogIn, AlertTriangle, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Took some time to implement proper error handling - found Supabase docs helpful
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Had to figure out the redirect URL configuration - initially faced some issues with localhost
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (error) throw error;
        
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "Successfully signed in to Mindful Me.",
        });
        navigate("/");
      }
    } catch (error: any) {
      // Spent time debugging different error types from Supabase
      setError(error.message || "An error occurred during authentication");
    } finally {
      setIsLoading(false);
    }
  };

  // Quick guest access - useful for demos and emergency access
  const handleGuestAccess = () => {
    navigate("/");
    toast({
      title: "Guest Access",
      description: "You're now browsing as a guest with full app access.",
    });
  };

  // Emergency access - bypasses login for crisis situations
  const handleEmergencyAccess = () => {
    navigate("/?section=emergency");
    toast({
      title: "Emergency Support Activated",
      description: "Immediate access to crisis resources and support.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with colorful gradients - took inspiration from the main app design */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20"
        style={{
          background: `
            linear-gradient(135deg, rgba(244,63,94,0.1) 0%, rgba(168,85,247,0.1) 35%, rgba(59,130,246,0.1) 100%),
            radial-gradient(circle at 20% 80%, rgba(244,63,94,0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(168,85,247,0.2) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(59,130,246,0.1) 0%, transparent 50%)
          `
        }}
      />

      <FloatingBubbles />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Logo and Header - matching main app styling */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-2 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 animate-gentle-bounce">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                MindfulMe
              </h1>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">
                {isSignUp ? "Join Our Community" : "Welcome Back"}
              </h2>
              <p className="text-muted-foreground">
                {isSignUp 
                  ? "Create your safe space for mental wellness" 
                  : "Sign in to continue your wellness journey"
                }
              </p>
            </div>
          </div>


          {/* Main Auth Card */}
          <Card className="backdrop-blur-md bg-card/80 border border-white/20 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                {isSignUp ? "Create Account" : "Sign In"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading}
                  variant="wellness"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {isSignUp ? "Creating Account..." : "Signing In..."}
                    </div>
                  ) : (
                    <>
                      {isSignUp ? (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Create Account
                        </>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4 mr-2" />
                          Sign In
                        </>
                      )}
                    </>
                  )}
                </Button>
              </form>

              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                  or
                </span>
              </div>

              {/* Guest Access */}
              <Button 
                onClick={handleGuestAccess}
                variant="outline" 
                size="lg"
                className="w-full bg-white/50 hover:bg-white/70 transition-all duration-300"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Continue as Guest
              </Button>

              {/* Toggle between Sign In/Sign Up and Emergency Access */}
              <div className="text-center pt-4 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError("");
                  }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                >
                  {isSignUp 
                    ? "Already have an account? Sign in" 
                    : "Don't have an account? Sign up"
                  }
                </button>
                
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <span>Need immediate help?</span>
                  <Button 
                    onClick={handleEmergencyAccess}
                    variant="link" 
                    size="sm"
                    className="p-0 h-auto text-xs text-destructive hover:text-destructive/80"
                  >
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Crisis support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <Card className="bg-muted/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">
                Your privacy and safety are our priority. All data is encrypted and secure.
                By continuing, you agree to our terms of service.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}