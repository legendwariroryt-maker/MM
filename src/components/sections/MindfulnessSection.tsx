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
    name: 'Deep Breathing',
    description: 'Calm your mind with focused breathing',
    duration: 5,
    type: 'breathing',
    icon: '🫁',
    instructions: [
      'Sit comfortably with your back straight',
      'Place one hand on your chest, one on your belly',
      'Breathe in slowly through your nose for 4 counts',
      'Feel your belly rise more than your chest',
      'Hold your breath for 4 counts',
      'Exhale slowly through your mouth for 6 counts',
      'Repeat this cycle for the duration'
    ]
  },
  {
    id: '2',
    name: 'Body Scan Meditation',
    description: 'Release tension by scanning your body',
    duration: 10,
    type: 'meditation',
    icon: '🧘',
    instructions: [
      'Lie down in a comfortable position',
      'Close your eyes and take a few deep breaths',
      'Start with your toes - notice any sensations',
      'Move attention slowly up your legs',
      'Continue scanning through your torso, arms, and head',
      'Don\'t try to change anything, just observe',
      'End by noticing your whole body at once'
    ]
  },
  {
    id: '3',
    name: 'Gratitude Reflection',
    description: 'Focus on positive aspects of your life',
    duration: 3,
    type: 'meditation',
    icon: '🙏',
    instructions: [
      'Sit quietly and close your eyes',
      'Take three deep breaths to center yourself',
      'Think of three things you\'re grateful for today',
      'For each one, really feel the gratitude in your heart',
      'Notice how gratitude feels in your body',
      'Expand this feeling to fill your whole being',
      'End with a smile and gentle breathing'
    ]
  },
  {
    id: '4',
    name: 'Progressive Muscle Relaxation',
    description: 'Systematically relax your entire body',
    duration: 15,
    type: 'meditation',
    icon: '🦋',
    instructions: [
      'Lie down in a comfortable position',
      'Start with your toes - tense them for 5 seconds, then relax',
      'Move to your calves, then thighs, tensing and releasing',
      'Continue with your abdomen, chest, and arms',
      'Tense your face muscles, then let everything go',
      'Feel the contrast between tension and relaxation',
      'Enjoy the feeling of complete relaxation'
    ]
  },
  {
    id: '5',
    name: 'Ocean Waves Visualization',
    description: 'Let the sound of waves wash away your stress',
    duration: 7,
    type: 'meditation',
    icon: '🌊',
    instructions: [
      'Sit or lie down comfortably and close your eyes',
      'Imagine you\'re sitting on a peaceful beach',
      'Listen to the gentle sound of waves rolling in and out',
      'With each wave coming in, breathe in slowly',
      'With each wave going out, breathe out and release tension',
      'Feel the warm sand beneath you and cool breeze',
      'Let the rhythm of the ocean calm your mind completely'
    ]
  },
  {
    id: '6',
    name: 'Forest Bathing Meditation',
    description: 'Immerse yourself in the healing energy of nature',
    duration: 8,
    type: 'meditation',
    icon: '🌲',
    instructions: [
      'Close your eyes and imagine walking in a peaceful forest',
      'Feel the soft earth beneath your feet',
      'Notice the fresh, clean air filling your lungs',
      'Hear birds singing softly in the trees above',
      'Feel dappled sunlight warming your skin',
      'Breathe in the fresh scent of pine and earth',
      'Let nature\'s energy restore your inner peace'
    ]
  },
  {
    id: '7',
    name: 'Loving-Kindness Meditation',
    description: 'Cultivate compassion for yourself and others',
    duration: 6,
    type: 'meditation',
    icon: '💝',
    instructions: [
      'Sit comfortably and place a hand on your heart',
      'Begin by sending love to yourself: "May I be happy and peaceful"',
      'Extend love to someone close: "May you be happy and peaceful"',
      'Send love to someone neutral: "May you be happy and peaceful"',
      'Include someone difficult: "May you be happy and peaceful"',
      'Expand to all beings everywhere',
      'Feel the warmth of universal love and connection'
    ]
  },
  {
    id: '8',
    name: 'Moonlight Relaxation',
    description: 'Find tranquility under the gentle moonlight',
    duration: 5,
    type: 'meditation',
    icon: '🌙',
    instructions: [
      'Imagine yourself in a serene moonlit garden',
      'Feel the soft, silver light surrounding you',
      'The cool night air gently caresses your skin',
      'Listen to the peaceful sounds of nighttime',
      'Let the moon\'s gentle energy calm your thoughts',
      'Feel deeply connected to the peaceful night',
      'Allow this tranquility to fill every part of you'
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
    let interval: ReturnType<typeof setInterval>;
    
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

  const completeSession = () => {
    if (selectedExercise) {
      markCompleted(selectedExercise.id);
      // Reset the timer and hide the active exercise section
      setSelectedExercise(null);
      setIsActive(false);
      setTimeLeft(0);
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
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          🧘 Mindfulness & Breathing
        </h2>
        <p className="text-muted-foreground">
          Take a moment to center yourself with guided exercises
        </p>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {exercises.map(exercise => (
          <Card key={exercise.id} className="relative hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">{exercise.icon}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{exercise.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{exercise.description}</p>
                <div className="text-primary font-medium mb-4">
                  {exercise.duration} minutes
                </div>
              </div>
              <Button 
                onClick={() => startExercise(exercise)}
                disabled={isActive}
                className="w-full"
                variant="default"
              >
                Start Exercise
              </Button>
              {completedExercises.includes(exercise.id) && (
                <div className="absolute top-3 right-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Exercise */}
      {selectedExercise && (
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2">
              <span className="text-3xl">{selectedExercise.icon}</span>
            </div>
            <CardTitle>{selectedExercise.name}</CardTitle>
            <p className="text-muted-foreground">{selectedExercise.description}</p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {/* Timer Display */}
            <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <div className="text-3xl font-bold text-primary">
                {formatTime(timeLeft)}
              </div>
            </div>
            <p className="text-muted-foreground">Time remaining</p>

            <Progress value={getProgress()} className="w-full max-w-md mx-auto" />

            {/* Controls */}
            <div className="flex gap-3 justify-center">
              <Button onClick={pauseResume} variant="outline" size="lg">
                {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button onClick={resetTimer} variant="outline" size="lg">
                <RotateCcw className="w-5 h-5" />
              </Button>
              <Button 
                onClick={completeSession} 
                className="bg-success text-white hover:bg-success/90"
              >
                Complete Session ✨
              </Button>
            </div>

            {/* Instructions */}
            <Card className="text-left max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-lg">Follow these steps:</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm">
                  {selectedExercise.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed">{instruction}</span>
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