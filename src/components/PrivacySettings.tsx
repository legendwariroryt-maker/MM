import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, Mail, Eye, EyeOff, Heart, Settings } from 'lucide-react';
import { useUserPreferences, type PrivacyLevel } from '@/hooks/useUserPreferences';
import { useAuth } from '@/hooks/useAuth';

const PrivacySettings = () => {
  const { user } = useAuth();
  const { preferences, loading, saving, savePreferences } = useUserPreferences();
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>(preferences.privacy_level);
  const [parentEmail, setParentEmail] = useState(preferences.parent_email || '');

  // Sync local state with loaded preferences
  useEffect(() => {
    setPrivacyLevel(preferences.privacy_level);
    setParentEmail(preferences.parent_email || '');
  }, [preferences]);

  const handleSave = async () => {
    await savePreferences({
      privacy_level: privacyLevel,
      parent_email: parentEmail.trim() || null,
    });
  };

  if (!user) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Please sign in to access privacy settings
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-muted-foreground">Loading settings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto bg-card/90 backdrop-blur-sm border border-border/50 shadow-xl">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Parent Reporting Settings
          </CardTitle>
        </div>
        <p className="text-muted-foreground">
          Choose how much of your wellness journey you'd like to share with your parent or guardian
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <span className="font-medium">Current Setting:</span>
          </div>
          <Badge variant={preferences.privacy_level === 'none' ? 'secondary' : 'default'}>
            {preferences.privacy_level === 'all' && 'Full Sharing'}
            {preferences.privacy_level === 'some' && 'Limited Sharing'}
            {preferences.privacy_level === 'none' && 'Private'}
          </Badge>
        </div>

        <Separator />

        {/* Privacy Level Selection */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">Choose your privacy level:</Label>
          
          <RadioGroup value={privacyLevel} onValueChange={(value: PrivacyLevel) => setPrivacyLevel(value)}>
            {/* Share All */}
            <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-success/30 bg-success/10 hover:bg-success/15 transition-colors">
              <RadioGroupItem value="all" id="all" className="mt-1" />
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-success" />
                  <Label htmlFor="all" className="font-semibold text-success">Share Everything</Label>
                </div>
                <p className="text-sm text-foreground/80">
                  Daily emails include: emotion tracking, journal entries, chat conversations, and mindfulness exercises.
                  Perfect for families with open communication.
                </p>
                <div className="text-xs text-foreground/70 font-medium">
                  📧 Daily reports • 📊 Complete wellness data • 💬 Chat summaries
                </div>
              </div>
            </div>

            {/* Share Some */}
            <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-primary/30 bg-primary/10 hover:bg-primary/15 transition-colors">
              <RadioGroupItem value="some" id="some" className="mt-1" />
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary" />
                  <Label htmlFor="some" className="font-semibold text-primary">Limited Sharing</Label>
                </div>
                <p className="text-sm text-foreground/80">
                  Daily emails include: emotion patterns, exercise completion, and wellness trends.
                  Your private thoughts in journals and chats stay private.
                </p>
                <div className="text-xs text-foreground/70 font-medium">
                  📊 Emotion summaries • 🧘 Exercise tracking • 🔒 Private journals & chats
                </div>
              </div>
            </div>

            {/* Share None */}
            <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-muted-foreground/25 bg-muted hover:bg-muted/80 transition-colors">
              <RadioGroupItem value="none" id="none" className="mt-1" />
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="none" className="font-semibold text-foreground">Complete Privacy</Label>
                </div>
                <p className="text-sm text-foreground/80">
                  No emails sent to parents. Your wellness journey stays completely private.
                  You have full control over your mental health data.
                </p>
                <div className="text-xs text-muted-foreground font-medium">
                  🔒 Completely private • 📱 Just for you • 🚫 No parent emails
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Parent Email Input */}
        {(privacyLevel === 'all' || privacyLevel === 'some') && (
          <div className="space-y-2">
            <Label htmlFor="parent-email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Parent/Guardian Email Address
            </Label>
            <Input
              id="parent-email"
              type="email"
              placeholder="parent@example.com"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              className="transition-all duration-200"
            />
            <p className="text-xs text-muted-foreground">
              Daily reports will be sent every day at 12 AM to this email address
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="p-4 bg-warning/20 border border-warning/30 rounded-lg">
          <h4 className="font-semibold text-foreground mb-2">Important Information</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• You can change these settings anytime</li>
            <li>• Reports are sent daily at 12 AM</li>
            <li>• Your data is always secure and encrypted</li>
            <li>• Emergency situations may require immediate parent notification regardless of settings</li>
          </ul>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </div>
            ) : (
              'Save Privacy Settings'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;