import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, Save, BookOpen, Calendar } from "lucide-react";
import { JournalEntry } from "@/types";

const journalPrompts = [
  "What are you grateful for today?",
  "What emotions did you feel today and why?",
  "Describe a challenging moment and how you handled it.",
  "What made you smile today?",
  "What would you like to improve about tomorrow?",
  "Write about someone who made your day better.",
  "What are you worried about right now?",
  "Describe your ideal day.",
  "What did you learn about yourself today?",
  "What would you tell your younger self?",
  "What are three things you accomplished today?",
  "How did you take care of your mental health today?"
];

export function JournalSection() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState({ title: '', content: '', mood: '' });
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Load entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mindful-journal');
    if (saved) {
      const parsed = JSON.parse(saved);
      setEntries(parsed.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      })));
    }
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem('mindful-journal', JSON.stringify(entries));
  }, [entries]);

  const saveEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      title: newEntry.title,
      content: newEntry.content,
      mood: newEntry.mood || undefined,
      timestamp: new Date(),
      wordCount: newEntry.content.split(/\s+/).filter(word => word.length > 0).length
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry({ title: '', content: '', mood: '' });
    setSelectedPrompt('');
  };

  const usePrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
    setNewEntry(prev => ({
      ...prev,
      title: prompt,
      content: prev.content
    }));
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.mood && entry.mood.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStats = () => {
    const today = new Date();
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weekEntries = entries.filter(entry => entry.timestamp >= thisWeek);
    const totalWords = entries.reduce((sum, entry) => sum + entry.wordCount, 0);
    const streak = getWritingStreak();
    
    return {
      totalEntries: entries.length,
      weekEntries: weekEntries.length,
      totalWords,
      streak
    };
  };

  const getWritingStreak = () => {
    if (entries.length === 0) return 0;
    
    const sortedEntries = [...entries].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].timestamp);
      entryDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak || (streak === 0 && daysDiff <= 1)) {
        streak = daysDiff + 1;
        currentDate = new Date(entryDate.getTime() - 24 * 60 * 60 * 1000);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* New Entry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Write a New Entry
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Writing Prompts */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Need inspiration? Choose a prompt:
            </label>
            <Select value={selectedPrompt} onValueChange={usePrompt}>
              <SelectTrigger>
                <SelectValue placeholder="Select a writing prompt..." />
              </SelectTrigger>
              <SelectContent>
                {journalPrompts.map((prompt, index) => (
                  <SelectItem key={index} value={prompt}>
                    {prompt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                placeholder="Give your entry a title..."
                value={newEntry.title}
                onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Mood (optional)</label>
              <Select 
                value={newEntry.mood} 
                onValueChange={(value) => setNewEntry(prev => ({ ...prev, mood: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How are you feeling?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="great">😊 Great</SelectItem>
                  <SelectItem value="good">🙂 Good</SelectItem>
                  <SelectItem value="okay">😐 Okay</SelectItem>
                  <SelectItem value="down">😔 Down</SelectItem>
                  <SelectItem value="stressed">😰 Stressed</SelectItem>
                  <SelectItem value="anxious">😨 Anxious</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Content ({newEntry.content.split(/\s+/).filter(word => word.length > 0).length} words)
            </label>
            <Textarea
              placeholder="Write about your thoughts, feelings, experiences..."
              value={newEntry.content}
              onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
              className="min-h-[120px]"
            />
          </div>

          <Button 
            onClick={saveEntry} 
            disabled={!newEntry.title.trim() || !newEntry.content.trim()}
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Entry
          </Button>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Your Writing Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-bold text-primary">{stats.totalEntries}</div>
              <div className="text-xs text-muted-foreground">Total Entries</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-bold text-primary">{stats.weekEntries}</div>
              <div className="text-xs text-muted-foreground">This Week</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-bold text-primary">{stats.totalWords}</div>
              <div className="text-xs text-muted-foreground">Total Words</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xl font-bold text-primary">{stats.streak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search & Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Past Entries
            </span>
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {filteredEntries.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {entries.length === 0 
                  ? "No journal entries yet. Start writing above!"
                  : "No entries match your search."
                }
              </p>
            ) : (
              <div className="space-y-4">
                {filteredEntries.map(entry => (
                  <Card key={entry.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium">{entry.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {entry.mood && (
                            <Badge variant="outline" className="text-xs">
                              {entry.mood}
                            </Badge>
                          )}
                          <span>{entry.timestamp.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {entry.content}
                      </p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {entry.wordCount} words • {entry.timestamp.toLocaleTimeString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}