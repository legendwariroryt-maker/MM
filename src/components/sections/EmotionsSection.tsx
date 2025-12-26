import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Heart, Save, TrendingUp, BarChart3 } from "lucide-react";
import { EmotionEntry, EmotionType } from "@/types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts";
import { format, subDays, startOfDay, isSameDay } from "date-fns";

const emotions: { name: EmotionType; color: string; emoji: string; chartColor: string }[] = [
  { name: 'happy', color: 'bg-emotion-happy', emoji: '😊', chartColor: '#fcd34d' },
  { name: 'sad', color: 'bg-emotion-sad', emoji: '😢', chartColor: '#60a5fa' },
  { name: 'angry', color: 'bg-emotion-angry', emoji: '😠', chartColor: '#f87171' },
  { name: 'anxious', color: 'bg-emotion-anxious', emoji: '😰', chartColor: '#c084fc' },
  { name: 'calm', color: 'bg-emotion-calm', emoji: '😌', chartColor: '#4ade80' },
  { name: 'stressed', color: 'bg-emotion-stressed', emoji: '😫', chartColor: '#fb923c' },
  { name: 'overwhelmed', color: 'bg-muted', emoji: '🤯', chartColor: '#94a3b8' },
  { name: 'excited', color: 'bg-warning', emoji: '🤗', chartColor: '#facc15' },
];

export function EmotionsSection() {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [intensity, setIntensity] = useState<number[]>([5]);
  const [trigger, setTrigger] = useState('');
  const [emotionEntries, setEmotionEntries] = useState<EmotionEntry[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('mindful-emotions');
    if (saved) {
      const parsed = JSON.parse(saved);
      setEmotionEntries(parsed.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      })));
    }
  }, []);

  // Save to localStorage when entries change
  useEffect(() => {
    localStorage.setItem('mindful-emotions', JSON.stringify(emotionEntries));
  }, [emotionEntries]);

  const saveEmotion = () => {
    if (!selectedEmotion) return;

    const newEntry: EmotionEntry = {
      id: Date.now().toString(),
      emotion: selectedEmotion,
      intensity: intensity[0],
      trigger: trigger || undefined,
      timestamp: new Date()
    };

    setEmotionEntries(prev => [newEntry, ...prev]);
    setSelectedEmotion('');
    setIntensity([5]);
    setTrigger('');
  };

  const getEmotionStats = () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weekEntries = emotionEntries.filter(entry => entry.timestamp >= weekAgo);
    const avgIntensity = weekEntries.length > 0 
      ? weekEntries.reduce((sum, entry) => sum + entry.intensity, 0) / weekEntries.length
      : 0;
    
    const mostCommon = weekEntries.reduce((acc, entry) => {
      acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topEmotion = Object.entries(mostCommon).sort(([,a], [,b]) => b - a)[0];
    
    return {
      weeklyCount: weekEntries.length,
      avgIntensity: Math.round(avgIntensity * 10) / 10,
      topEmotion: topEmotion ? topEmotion[0] : 'none'
    };
  };

  // Generate chart data for the last 7 days
  const chartData = useMemo(() => {
    const days = [];
    const today = startOfDay(new Date());
    
    for (let i = 6; i >= 0; i--) {
      const day = subDays(today, i);
      const dayEntries = emotionEntries.filter(entry => 
        isSameDay(entry.timestamp, day)
      );
      
      const dayData: Record<string, any> = {
        date: format(day, 'MMM d'),
        fullDate: format(day, 'EEEE, MMM d'),
      };
      
      // Calculate average intensity per emotion for this day
      emotions.forEach(emotion => {
        const emotionEntries = dayEntries.filter(e => e.emotion === emotion.name);
        if (emotionEntries.length > 0) {
          dayData[emotion.name] = Math.round(
            emotionEntries.reduce((sum, e) => sum + e.intensity, 0) / emotionEntries.length
          );
        }
      });
      
      // Also add overall average intensity for the day
      if (dayEntries.length > 0) {
        dayData.avgIntensity = Math.round(
          dayEntries.reduce((sum, e) => sum + e.intensity, 0) / dayEntries.length * 10
        ) / 10;
      }
      
      days.push(dayData);
    }
    
    return days;
  }, [emotionEntries]);

  // Get the emotions that appear in the chart
  const activeEmotions = useMemo(() => {
    const emotionSet = new Set<string>();
    chartData.forEach(day => {
      emotions.forEach(emotion => {
        if (day[emotion.name] !== undefined) {
          emotionSet.add(emotion.name);
        }
      });
    });
    return emotions.filter(e => emotionSet.has(e.name));
  }, [chartData]);

  const stats = getEmotionStats();

  return (
    <div className="space-y-6">
      {/* Emotion Selection Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            How Are You Feeling?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {emotions.map(emotion => (
              <Button
                key={emotion.name}
                variant={selectedEmotion === emotion.name ? "wellness" : "emotion"}
                onClick={() => setSelectedEmotion(emotion.name)}
                className="h-20 flex flex-col gap-2"
              >
                <span className="text-2xl">{emotion.emoji}</span>
                <span className="text-sm capitalize">{emotion.name}</span>
              </Button>
            ))}
          </div>

          {selectedEmotion && (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Intensity: {intensity[0]}/10
                </label>
                <Slider
                  value={intensity}
                  onValueChange={setIntensity}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  What triggered this feeling? (optional)
                </label>
                <Input
                  placeholder="e.g., test anxiety, argument with friend..."
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                />
              </div>

              <Button onClick={saveEmotion} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Emotion
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            This Week's Pattern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats.weeklyCount}</div>
              <div className="text-sm text-muted-foreground">Entries This Week</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats.avgIntensity}</div>
              <div className="text-sm text-muted-foreground">Average Intensity</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary capitalize">{stats.topEmotion}</div>
              <div className="text-sm text-muted-foreground">Most Common</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mood History Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Mood History (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {emotionEntries.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-muted-foreground text-center">
                Start tracking your emotions to see patterns over time!
              </p>
            </div>
          ) : activeEmotions.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-muted-foreground text-center">
                No emotion data for the past 7 days. Keep tracking!
              </p>
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    {activeEmotions.map(emotion => (
                      <linearGradient key={emotion.name} id={`gradient-${emotion.name}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={emotion.chartColor} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={emotion.chartColor} stopOpacity={0.05}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    className="fill-muted-foreground"
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[0, 10]} 
                    tick={{ fontSize: 12 }}
                    className="fill-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                    labelFormatter={(label) => {
                      const dayData = chartData.find(d => d.date === label);
                      return dayData?.fullDate || label;
                    }}
                    formatter={(value: number, name: string) => {
                      const emotion = emotions.find(e => e.name === name);
                      return [`${value}/10`, `${emotion?.emoji || ''} ${name.charAt(0).toUpperCase() + name.slice(1)}`];
                    }}
                  />
                  <Legend 
                    formatter={(value: string) => {
                      const emotion = emotions.find(e => e.name === value);
                      return `${emotion?.emoji || ''} ${value.charAt(0).toUpperCase() + value.slice(1)}`;
                    }}
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                  {activeEmotions.map(emotion => (
                    <Area
                      key={emotion.name}
                      type="monotone"
                      dataKey={emotion.name}
                      stroke={emotion.chartColor}
                      strokeWidth={2}
                      fill={`url(#gradient-${emotion.name})`}
                      connectNulls={false}
                      dot={{ fill: emotion.chartColor, strokeWidth: 0, r: 3 }}
                      activeDot={{ r: 5, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            {emotionEntries.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No emotion entries yet. Start tracking your feelings above!
              </p>
            ) : (
              <div className="space-y-3">
                {emotionEntries.slice(0, 10).map(entry => (
                  <div key={entry.id} className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="capitalize">
                        {entry.emotion}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {entry.timestamp.toLocaleDateString()} {entry.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm">Intensity: {entry.intensity}/10</span>
                      {entry.trigger && (
                        <span className="text-sm text-muted-foreground">
                          Trigger: {entry.trigger}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}