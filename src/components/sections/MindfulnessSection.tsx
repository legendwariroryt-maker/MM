import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, CheckCircle } from "lucide-react";
import { MindfulnessExercise } from "@/types";

const exercises: MindfulnessExercise[] = [
  {
    id: '1',
    name: '4-7-8 Breathing',
    description: 'Inhale for 4, hold for 7, exhale for 8. Great for anxiety.',
    duration: 5,
    type: 'breathing',
    instructions: [
      'Sit comfortably with your back straight',
      'Place the tip of your tongue against the tissue behind your upper teeth',
      'Exhale completely through your mouth',
      'Inhale through your nose for 4 counts',
      'Hold your breath for 7 counts',
      'Exhale through your mouth for 8 counts',
      'Repeat 3-4 cycles'
    ]
  },
  {
    id: '2',
    name: 'Box Breathing',
    description: 'Equal counts of inhaling, holding, exhaling, and holding.',
    duration: 4,
    type: 'breathing',
    instructions: [
      'Sit comfortably and close your eyes',
      'Inhale slowly for 4 counts',
      'Hold your breath for 4 counts',
      'Exhale slowly for 4 counts',
      'Hold empty lungs for 4 counts',
      'Repeat for several cycles'
    ]
  },
  {
    id: '3',
    name: '5-4-3-2-1 Grounding',
    description: 'Use your senses to ground yourself in the present moment.',
    duration: 3,
    type: 'grounding',
    instructions: [
      'Name 5 things you can see',
      'Name 4 things you can touch',
      'Name 3 things you can hear',
      'Name 2 things you can smell',
      'Name 1 thing you can taste',
      'Take a deep breath and notice how you feel'
    ]
  },
  {
    id: '4',
    name: 'Progressive Muscle Relaxation',
    description: 'Tense and release muscle groups to reduce physical tension.',
    duration: 10,
    type: 'meditation',
    instructions: [
      'Lie down or sit comfortably',
      'Start with your toes - tense for 5 seconds, then release',
      'Move to your calves - tense and release',
      'Continue up your body: thighs, glutes, abdomen',
      'Tense your hands into fists, then release',
      'Tense your arms and shoulders, then release',
      'Scrunch your face muscles, then release',
      'Take deep breaths and enjoy the relaxation'
    ]
  }
];

export function MindfulnessSection() {
  const [selectedExercise, setSelectedExercise] = useState<MindfulnessExercise | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  // Load completed exercises from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mindful-completed');
    if (saved) {
      setCompletedExercises(JSON.parse(saved));
    }
  }, []);

  // Save completed exercises to localStorage
  useEffect(() => {
    localStorage.setItem('mindful-completed', JSON.stringify(completedExercises));
  }, [completedExercises]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (selectedExercise) {
        markCompleted(selectedExercise.id);
      }
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, selectedExercise]);

  const startExercise = (exercise: MindfulnessExercise) => {
    setSelectedExercise(exercise);
    setTimeLeft(exercise.duration * 60); // Convert minutes to seconds
    setIsActive(true);
  };

  const pauseResume = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(selectedExercise ? selectedExercise.duration * 60 : 0);
  };

  const markCompleted = (exerciseId: string) => {
    if (!completedExercises.includes(exerciseId)) {
      setCompletedExercises(prev => [...prev, exerciseId]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!selectedExercise) return 0;
    const totalTime = selectedExercise.duration * 60;
    const elapsed = totalTime - timeLeft;
    return (elapsed / totalTime) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Exercise Library */}
      <Card>
        <CardHeader>
          <CardTitle>Mindfulness Exercises</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exercises.map(exercise => (
              <Card key={exercise.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={exercise.type === 'breathing' ? 'secondary' : 
                                   exercise.type === 'meditation' ? 'default' : 'outline'}>
                      {exercise.type}
                    </Badge>
                    {completedExercises.includes(exercise.id) && (
                      <CheckCircle className="w-5 h-5 text-success" />
                    )}
                  </div>
                  <h3 className="font-semibold mb-2">{exercise.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{exercise.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{exercise.duration} min</span>
                    <Button 
                      size="sm" 
                      onClick={() => startExercise(exercise)}
                      disabled={isActive}
                      variant="wellness"
                    >
                      Start
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Exercise */}
      {selectedExercise && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">{selectedExercise.name}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="relative w-32 h-32 mx-auto">
              <div className={`w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center ${
                isActive ? 'animate-breathe' : ''
              }`}>
                <div className="text-3xl font-bold text-primary">
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            <Progress value={getProgress()} className="w-full" />

            <div className="flex gap-3 justify-center">
              <Button onClick={pauseResume} variant="outline" size="lg">
                {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button onClick={resetTimer} variant="outline" size="lg">
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>

            <Card className="text-left">
              <CardHeader>
                <CardTitle className="text-lg">Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm">
                  {selectedExercise.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                        {index + 1}
                      </span>
                      {instruction}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}

      {/* Progress Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{completedExercises.length}</div>
              <div className="text-sm text-muted-foreground">Exercises Completed</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {Math.round((completedExercises.length / exercises.length) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}