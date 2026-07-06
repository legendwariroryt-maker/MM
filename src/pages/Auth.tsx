import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FloatingBubbles } from "@/components/ui/floating-bubbles";
import { BreathingOrb } from "@/components/ui/breathing-orb";
import { Heart, Mail, Lock, UserPlus, LogIn, AlertTriangle, Sparkles, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@/assets/mindful-me-logo.png";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextParam = searchParams.get("next");
  const safeNext =
    nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : null;
  const postAuthTarget = safeNext ?? "/app";
  const { toast } = useToast();

  // Check if user came from password reset link
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    if (type === 'recovery') {
      setIsResetPassword(true);
    }
  }, []);

  // Handle sending forgot password email
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      toast({
        title: "Password reset email sent!",
        description: "Check your inbox for a link to reset your password. Click the link, then return here to set a new password.",
      });
      setIsForgotPassword(false);
    } catch (error: any) {
      setError(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle setting new password after clicking reset link
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      toast({
        title: "Password updated!",
        description: "Your password has been successfully reset. You can now sign in.",
      });
      setIsResetPassword(false);
      setPassword("");
      setConfirmPassword("");
      // Clear the hash from URL
      window.history.replaceState(null, '', window.location.pathname);
    } catch (error: any) {
      setError(error.message || "An error occurred while resetting password");
    } finally {
      setIsLoading(false);
    }
  };

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
            emailRedirectTo: `${window.location.origin}${postAuthTarget}`
          }
        });

        if (error) throw error;
        
        toast({
          title: "Account created!",
          description: "A verification link has been sent to your email. Click the link to verify your account, then come back here to sign in.",
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
        navigate(postAuthTarget);
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
    navigate("/app");
    toast({
      title: "Guest Access",
      description: "You're now browsing as a guest with full app access.",
    });
  };

  // Emergency access - bypasses login for crisis situations
  const handleEmergencyAccess = () => {
    navigate("/app?section=emergency");
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
              <img 
                src={logoImage} 
                alt="MindfulMe Logo" 
                className="w-12 h-12 animate-gentle-bounce"
              />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                MindfulMe
              </h1>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">
                {isResetPassword ? "Set New Password" : isSignUp ? "Join Our Community" : "Welcome Back"}
              </h2>
              <p className="text-muted-foreground">
                {isResetPassword
                  ? "Enter your new password below"
                  : isSignUp 
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
                {isResetPassword ? "New Password" : isForgotPassword ? "Reset Password" : isSignUp ? "Create Account" : "Sign In"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isResetPassword ? (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10"
                        required
                        minLength={6}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 6 characters.
                    </p>
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
                        Updating...
                      </div>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4 mr-2" />
                        Set New Password
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setIsResetPassword(false);
                      setPassword("");
                      setConfirmPassword("");
                      setError("");
                      window.history.replaceState(null, '', window.location.pathname);
                    }}
                  >
                    Back to Sign In
                  </Button>
                </form>
              ) : isForgotPassword ? (
                <form onSubmit={handleForgotPassword} className="space-y-4">
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
                    <p className="text-xs text-muted-foreground">
                      We'll send you a link to reset your password.
                    </p>
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
                        Sending...
                      </div>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Reset Link
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setError("");
                    }}
                  >
                    Back to Sign In
                  </Button>
                </form>
              ) : (
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      {!isSignUp && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsForgotPassword(true);
                            setError("");
                          }}
                          className="text-xs text-primary hover:underline"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
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
              )}

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
              {!isForgotPassword && (
                <div className="text-center pt-4 space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError("");
                    }}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors mx-auto block"
                  >
                    {isSignUp 
                      ? "Already have an account? Sign in" 
                      : "Don't have an account? Sign up"
                    }
                  </button>
                  
                  <Button 
                    onClick={handleEmergencyAccess}
                    variant="outline" 
                    size="sm"
                    className="mx-auto flex items-center gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Need immediate help? Crisis support
                  </Button>
                </div>
              )}
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