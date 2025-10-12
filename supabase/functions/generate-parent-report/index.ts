import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

interface DailyReportData {
  emotions: any[];
  exercises: any[];
  journals: any[];
  chats: any[];
  emotionSummary: {
    mostCommon: string;
    averageIntensity: number;
    totalEntries: number;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting daily report generation...');

    // Get all users with report preferences
    const { data: userPrefs, error: prefsError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('report_enabled', true)
      .neq('privacy_level', 'none');

    if (prefsError) {
      console.error('Error fetching user preferences:', prefsError);
      throw prefsError;
    }

    console.log(`Found ${userPrefs?.length || 0} users with reporting enabled`);

    const reports = [];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    for (const userPref of userPrefs || []) {
      try {
        console.log(`Generating report for user ${userPref.user_id}`);
        
        // Check if report already sent today
        const reportDate = new Date().toISOString().split('T')[0];
        const { data: existingReport } = await supabase
          .from('parent_reports')
          .select('*')
          .eq('user_id', userPref.user_id)
          .eq('report_date', reportDate)
          .single();

        if (existingReport) {
          console.log(`Daily report already sent for user ${userPref.user_id} today`);
          continue;
        }

        // Gather user data based on privacy level
        const reportData: DailyReportData = {
          emotions: [],
          exercises: [],
          journals: [],
          chats: [],
          emotionSummary: {
            mostCommon: 'calm',
            averageIntensity: 0,
            totalEntries: 0
          }
        };

        // Fetch chat messages from the past day
        const { data: chatMessages } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('user_id', userPref.user_id)
          .gte('created_at', yesterday.toISOString())
          .order('created_at', { ascending: true });
        
        const chatData = chatMessages || [];
        
        // TODO: Fetch from other tables when they exist
        const emotionEntries = []; // Would fetch from emotions table
        const journalEntries = []; // Would fetch from journals table
        const exerciseData = []; // Would fetch from mindfulness exercises

        // Calculate emotion summary
        if (emotionEntries.length > 0) {
          reportData.emotionSummary.totalEntries = emotionEntries.length;
          // Add emotion analysis logic here
        }

        // Prepare data based on privacy level
        if (userPref.privacy_level === 'all') {
          reportData.emotions = emotionEntries;
          reportData.journals = journalEntries;
          reportData.chats = chatData;
          reportData.exercises = exerciseData;
        } else if (userPref.privacy_level === 'some') {
          // Only emotions and exercises, no detailed content
          reportData.emotions = emotionEntries.map(e => ({
            emotion: e.emotion,
            intensity: e.intensity,
            timestamp: e.timestamp
          }));
          reportData.exercises = exerciseData;
          // No journals or chats for 'some' privacy level
        }

        // Generate email content
        const emailContent = generateEmailContent(userPref.privacy_level, reportData);

        // Send email
        const emailResult = await resend.emails.send({
          from: "MindfulMe <onboarding@resend.dev>",
          to: [userPref.parent_email],
          subject: `Daily Mental Wellness Report - ${new Date().toLocaleDateString()}`,
          html: emailContent,
        });

        console.log('Email sent successfully:', emailResult);

        // Save report record
        const { error: reportError } = await supabase
          .from('parent_reports')
          .insert({
            user_id: userPref.user_id,
            report_date: reportDate,
            privacy_level: userPref.privacy_level,
            parent_email: userPref.parent_email,
            report_data: reportData
          });

        if (reportError) {
          console.error('Error saving report:', reportError);
        }

        reports.push({
          user_id: userPref.user_id,
          status: 'sent',
          email: userPref.parent_email
        });

      } catch (userError) {
        console.error(`Error generating report for user ${userPref.user_id}:`, userError);
        reports.push({
          user_id: userPref.user_id,
          status: 'error',
          error: userError.message
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        reportsSent: reports.length,
        reports: reports 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-parent-report:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function generateEmailContent(privacyLevel: string, data: DailyReportData): string {
  const date = new Date().toLocaleDateString();
  
  let content = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #6366f1; margin-bottom: 10px;">MindfulMe Daily Report</h1>
        <p style="color: #666; font-size: 16px;">${date}</p>
      </div>
      
      <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 20px; border-radius: 12px; color: white; margin-bottom: 25px;">
        <h2 style="margin: 0 0 15px 0;">Mental Wellness Summary</h2>
        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
          <div>
            <div style="font-size: 24px; font-weight: bold;">${data.emotionSummary.totalEntries}</div>
            <div style="opacity: 0.9;">Emotional check-ins</div>
          </div>
          <div>
            <div style="font-size: 24px; font-weight: bold;">${data.exercises.length}</div>
            <div style="opacity: 0.9;">Mindfulness exercises</div>
          </div>
        </div>
      </div>
  `;

  if (privacyLevel === 'all') {
    content += `
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #374151; margin-bottom: 15px;">🧠 Emotional Journey</h3>
        <p style="color: #6b7280;">Your teen completed ${data.emotions.length} emotional check-ins today.</p>
        ${data.emotions.length > 0 ? `
          <div style="margin-top: 15px;">
            <strong>Most common emotion:</strong> ${data.emotionSummary.mostCommon}
          </div>
        ` : ''}
      </div>

      <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #374151; margin-bottom: 15px;">📝 Journal Insights</h3>
        <p style="color: #6b7280;">
          ${data.journals.length > 0 
            ? `Your teen wrote ${data.journals.length} journal entries today, showing active self-reflection.`
            : 'No journal entries today - consider encouraging reflective writing.'
          }
        </p>
      </div>

      <div style="background: #fef7ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #374151; margin-bottom: 15px;">💬 Support Conversations</h3>
        <p style="color: #6b7280;">
          ${data.chats.length > 0 
            ? `Your teen engaged in ${data.chats.length} supportive conversations with our AI companion today.`
            : 'No support conversations today.'
          }
        </p>
      </div>
    `;
  } else if (privacyLevel === 'some') {
    content += `
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #374151; margin-bottom: 15px;">🧠 Emotional Wellness Overview</h3>
        <p style="color: #6b7280;">Your teen completed ${data.emotions.length} emotional check-ins today.</p>
        ${data.emotions.length > 0 ? `
          <div style="margin-top: 10px; color: #6b7280;">
            <strong>Most frequent emotion:</strong> ${data.emotionSummary.mostCommon}<br>
            <strong>Average intensity:</strong> ${data.emotionSummary.averageIntensity}/10
          </div>
        ` : ''}
      </div>

      <div style="background: #fef7ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #374151; margin-bottom: 15px;">🧘 Mindfulness Activities</h3>
        <p style="color: #6b7280;">
          ${data.exercises.length > 0 
            ? `Completed ${data.exercises.length} mindfulness exercises today - great for stress management!`
            : 'No mindfulness exercises today - consider encouraging relaxation practices.'
          }
        </p>
      </div>

      <div style="background: #fef3f2; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ef4444;">
        <p style="color: #7f1d1d; margin: 0; font-size: 14px;">
          <strong>Privacy Notice:</strong> Your teen chose limited sharing. Detailed journal entries and conversations are kept private.
        </p>
      </div>
    `;
  }

  content += `
      <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
        <h3 style="color: #374151; margin-bottom: 15px;">💡 Recommendations</h3>
        <ul style="color: #6b7280; line-height: 1.6;">
          <li>Continue encouraging regular emotional check-ins</li>
          <li>Celebrate progress in mindfulness practices</li>
          <li>Maintain open communication about mental wellness</li>
          ${data.emotionSummary.totalEntries < 1 ? '<li>Consider gently encouraging more frequent app usage</li>' : ''}
        </ul>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 14px;">
          This report was generated by MindfulMe - Supporting teen mental wellness with privacy and care.
        </p>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 10px;">
          Privacy settings can be changed anytime in the app by your teen.
        </p>
      </div>
    </div>
  `;

  return content;
}