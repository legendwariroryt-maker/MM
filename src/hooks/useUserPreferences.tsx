import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';

export type PrivacyLevel = 'all' | 'some' | 'none';

interface UserPreferences {
  id?: string;
  privacy_level: PrivacyLevel;
  parent_email: string | null;
  report_enabled: boolean;
}

export const useUserPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences>({
    privacy_level: 'none',
    parent_email: null,
    report_enabled: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load user preferences
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadPreferences = async () => {
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading preferences:', error);
          throw error;
        }

        if (data) {
          setPreferences({
            id: data.id,
            privacy_level: data.privacy_level,
            parent_email: data.parent_email,
            report_enabled: data.report_enabled,
          });
        }
      } catch (error) {
        console.error('Error loading user preferences:', error);
        toast({
          title: "Error",
          description: "Failed to load privacy settings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user, toast]);

  // Save preferences
  const savePreferences = async (newPrefs: Partial<UserPreferences>) => {
    if (!user) return false;

    setSaving(true);
    try {
      const updatedPrefs = { ...preferences, ...newPrefs };
      
      // Validate email is provided for sharing levels
      if ((updatedPrefs.privacy_level === 'all' || updatedPrefs.privacy_level === 'some') && !updatedPrefs.parent_email) {
        toast({
          title: "Email Required",
          description: "Please provide a parent email address for sharing reports",
          variant: "destructive",
        });
        setSaving(false);
        return false;
      }

      // Set report_enabled based on privacy level and email
      const shouldEnableReports = updatedPrefs.privacy_level !== 'none' && !!updatedPrefs.parent_email;

      const dataToSave = {
        user_id: user.id,
        privacy_level: updatedPrefs.privacy_level,
        parent_email: updatedPrefs.parent_email || null,
        report_enabled: shouldEnableReports,
      };

      let result;
      if (preferences.id) {
        // Update existing preferences
        result = await supabase
          .from('user_preferences')
          .update(dataToSave)
          .eq('id', preferences.id)
          .select()
          .single();
      } else {
        // Create new preferences
        result = await supabase
          .from('user_preferences')
          .insert(dataToSave)
          .select()
          .single();
      }

      if (result.error) {
        console.error('Error saving preferences:', result.error);
        throw result.error;
      }

      setPreferences({
        id: result.data.id,
        privacy_level: result.data.privacy_level,
        parent_email: result.data.parent_email,
        report_enabled: result.data.report_enabled,
      });

      toast({
        title: "Settings Saved",
        description: "Your privacy preferences have been updated successfully",
      });

      return true;
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save privacy settings. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    preferences,
    loading,
    saving,
    savePreferences,
  };
};