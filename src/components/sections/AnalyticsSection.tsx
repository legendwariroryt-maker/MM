import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, MessageSquare, Brain, BookOpen, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AnalyticsData {
  totalUsers: number;
  totalChats: number;
  totalMbtiTests: number;
  recentSignups: number;
  userChatCount: number;
}

export const AnalyticsSection = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalChats: 0,
    totalMbtiTests: 0,
    recentSignups: 0,
    userChatCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Get total profiles count
        const { count: profilesCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        // Get total chat messages
        const { count: chatsCount } = await supabase
          .from("chat_messages")
          .select("*", { count: "exact", head: true });

        // Get total MBTI tests
        const { count: mbtiCount } = await supabase
          .from("mbti_results")
          .select("*", { count: "exact", head: true });

        // Get recent signups (last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const { count: recentCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .gte("created_at", weekAgo.toISOString());

        // Get current user's chat count
        let userChats = 0;
        if (user) {
          const { count } = await supabase
            .from("chat_messages")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id);
          userChats = count || 0;
        }

        setAnalytics({
          totalUsers: profilesCount || 0,
          totalChats: chatsCount || 0,
          totalMbtiTests: mbtiCount || 0,
          recentSignups: recentCount || 0,
          userChatCount: userChats,
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  const stats = [
    {
      title: "Total Users",
      value: analytics.totalUsers,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Chat Conversations",
      value: analytics.totalChats,
      icon: MessageSquare,
      color: "text-accent-foreground",
      bgColor: "bg-accent/30",
    },
    {
      title: "Personality Tests",
      value: analytics.totalMbtiTests,
      icon: Brain,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "New This Week",
      value: analytics.recentSignups,
      icon: TrendingUp,
      color: "text-warning-foreground",
      bgColor: "bg-warning/20",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
          📊 Community Analytics
        </h3>
        <p className="text-muted-foreground">
          See how our wellness community is growing
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <CardHeader className="pb-2">
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mb-2`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {user && (
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Your Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You've had <span className="font-bold text-foreground">{analytics.userChatCount}</span> supportive conversations with MindfulMe.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
