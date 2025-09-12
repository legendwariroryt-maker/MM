import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Heart, Save, TrendingUp } from "lucide-react";
import { EmotionEntry, EmotionType } from "@/types";

const emotions: { name: EmotionType; color: string; emoji: string }[] = [
  { name: 'happy', color: 'bg-emotion-happy', emoji: '😊' },
  { name: 'sad', color: 'bg-emotion-sad', emoji: '😢' },
  { name: 'angry', color: 'bg-emotion-angry', emoji: '😠' },
  { name: 'anxious', color: 'bg-emotion-anxious', emoji: '😰' },
  { name: 'calm', color: 'bg-emotion-calm', emoji: '😌' },
  { name: 'stressed', color: 'bg-emotion-stressed', emoji: '😫' },
  { name: 'overwhelmed', color: 'bg-muted', emoji: '🤯' },
  { name: 'excited', color: 'bg-warning', emoji: '🤗' },
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