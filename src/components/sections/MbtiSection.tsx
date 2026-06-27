import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Brain, Sparkles } from "lucide-react";

interface Question {
  id: number;
  text: string;
  dimension: 'E-I' | 'S-N' | 'T-F' | 'J-P';
  options: {
    text: string;
    value: number; // Positive for first letter (E, S, T, J), negative for second (I, N, F, P)
  }[];
}

const mbtiQuestions: Question[] = [
  // E-I Questions (Extraversion vs Introversion)
  {
    id: 1,
    text: "At a party, you tend to:",
    dimension: 'E-I',
    options: [
      { text: "Interact with many people, including strangers", value: 2 },
      { text: "Interact with a few close friends", value: -2 }
    ]
  },
  {
    id: 2,
    text: "After a long week, you feel recharged by:",
    dimension: 'E-I',
    options: [
      { text: "Going out with friends and being social", value: 2 },
      { text: "Spending quiet time alone or with one close person", value: -2 }
    ]
  },
  {
    id: 3,
    text: "You prefer to:",
    dimension: 'E-I',
    options: [
      { text: "Think out loud and discuss ideas with others", value: 2 },
      { text: "Think things through internally before sharing", value: -2 }
    ]
  },
  
  // S-N Questions (Sensing vs Intuition)
  {
    id: 4,
    text: "When learning something new, you focus on:",
    dimension: 'S-N',
    options: [
      { text: "Concrete facts and practical applications", value: 2 },
      { text: "Concepts, patterns, and future possibilities", value: -2 }
    ]
  },
  {
    id: 5,
    text: "You trust:",
    dimension: 'S-N',
    options: [
      { text: "Your direct experience and proven methods", value: 2 },
      { text: "Your intuition and innovative ideas", value: -2 }
    ]
  },
  {
    id: 6,
    text: "You are more interested in:",
    dimension: 'S-N',
    options: [
      { text: "What is real and tangible", value: 2 },
      { text: "What could be and theoretical possibilities", value: -2 }
    ]
  },

  // T-F Questions (Thinking vs Feeling)
  {
    id: 7,
    text: "When making decisions, you prioritize:",
    dimension: 'T-F',
    options: [
      { text: "Logic, consistency, and objective analysis", value: 2 },
      { text: "People's feelings and maintaining harmony", value: -2 }
    ]
  },
  {
    id: 8,
    text: "In disagreements, you value:",
    dimension: 'T-F',
    options: [
      { text: "Being right and finding the truth", value: 2 },
      { text: "Being tactful and considering others' emotions", value: -2 }
    ]
  },
  {
    id: 9,
    text: "You believe it's worse to be:",
    dimension: 'T-F',
    options: [
      { text: "Too emotional and impractical", value: 2 },
      { text: "Too cold and uncaring", value: -2 }
    ]
  },

  // J-P Questions (Judging vs Perceiving)
  {
    id: 10,
    text: "You prefer your life to be:",
    dimension: 'J-P',
    options: [
      { text: "Structured and organized with clear plans", value: 2 },
      { text: "Flexible and spontaneous with open options", value: -2 }
    ]
  },
  {
    id: 11,
    text: "When working on a project, you:",
    dimension: 'J-P',
    options: [
      { text: "Start early and work steadily to finish on time", value: 2 },
      { text: "Work best under pressure near the deadline", value: -2 }
    ]
  },
  {
    id: 12,
    text: "You feel more comfortable:",
    dimension: 'J-P',
    options: [
      { text: "Having decisions made and plans set", value: 2 },
      { text: "Keeping options open and adapting as you go", value: -2 }
    ]
  }
];

const personalityDescriptions: Record<string, { title: string; description: string }> = {
  INTJ: { title: "The Architect", description: "Strategic, analytical, and independent thinkers who love planning and implementing complex ideas." },
  INTP: { title: "The Logician", description: "Innovative, curious problem-solvers who seek to understand complex systems and theories." },
  ENTJ: { title: "The Commander", description: "Bold, decisive leaders who excel at organizing people and projects to achieve goals." },
  ENTP: { title: "The Debater", description: "Quick-witted, clever innovators who love intellectual challenges and debates." },
  INFJ: { title: "The Advocate", description: "Idealistic, insightful visionaries dedicated to helping others and pursuing meaningful goals." },
  INFP: { title: "The Mediator", description: "Empathetic, creative idealists guided by values and desire to help humanity." },
  ENFJ: { title: "The Protagonist", description: "Charismatic, inspiring leaders passionate about helping others reach their potential." },
  ENFP: { title: "The Campaigner", description: "Enthusiastic, creative spirits who see life as full of possibilities and connections." },
  ISTJ: { title: "The Logistician", description: "Practical, responsible organizers who value tradition and clear systems." },
  ISFJ: { title: "The Defender", description: "Dedicated, warm protectors who are committed to caring for others." },
  ESTJ: { title: "The Executive", description: "Organized, practical administrators who excel at managing people and processes." },
  ESFJ: { title: "The Consul", description: "Caring, social connectors who create harmony and help their communities." },
  ISTP: { title: "The Virtuoso", description: "Bold, practical experimenters who master tools and techniques with ease." },
  ISFP: { title: "The Adventurer", description: "Flexible, charming artists who live in the moment and explore life's beauty." },
  ESTP: { title: "The Entrepreneur", description: "Energetic, perceptive action-takers who thrive on spontaneity and immediate challenges." },
  ESFP: { title: "The Entertainer", description: "Spontaneous, enthusiastic performers who love life and bring energy to others." }
};

export function MbtiSection() {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [personalityType, setPersonalityType] = useState<string>("");
  const [existingResult, setExistingResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExistingResult();
  }, [user]);

  const loadExistingResult = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('mbti_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error loading MBTI result:', error);
      } else if (data) {
        setExistingResult(data);
        setPersonalityType(data.personality_type);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error loading MBTI result:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (value: number) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const handleNext = () => {
    if (currentQuestion < mbtiQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = async () => {
    const scores = {
      'E-I': 0,
      'S-N': 0,
      'T-F': 0,
      'J-P': 0
    };

    mbtiQuestions.forEach((question, index) => {
      const answer = answers[index];
      if (answer !== undefined) {
        scores[question.dimension] += answer;
      }
    });

    const type = 
      (scores['E-I'] >= 0 ? 'E' : 'I') +
      (scores['S-N'] >= 0 ? 'S' : 'N') +
      (scores['T-F'] >= 0 ? 'T' : 'F') +
      (scores['J-P'] >= 0 ? 'J' : 'P');

    setPersonalityType(type);
    setShowResults(true);

    if (user) {
      try {
        const { error } = await supabase
          .from('mbti_results')
          .insert({
            user_id: user.id,
            personality_type: type,
            e_i_score: Math.round(scores['E-I']),
            s_n_score: Math.round(scores['S-N']),
            t_f_score: Math.round(scores['T-F']),
            j_p_score: Math.round(scores['J-P']),
            test_answers: answers
          });

        if (error) {
          console.error('Error saving MBTI result:', error);
          toast.error("Failed to save your results");
        } else {
          toast.success("Your personality type has been saved!");
        }
      } catch (error) {
        console.error('Error saving MBTI result:', error);
        toast.error("Failed to save your results");
      }
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setPersonalityType("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">Loading your personality profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="p-8 text-center">
        <Brain className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h3 className="text-2xl font-bold mb-2">Sign In Required</h3>
        <p className="text-muted-foreground mb-4">
          Please sign in to take the MBTI personality test and save your results.
        </p>
      </Card>
    );
  }

  if (showResults) {
    const description = personalityDescriptions[personalityType];
    return (
      <div className="space-y-6">
        <Card className="p-8 bg-gradient-to-br from-primary/10 to-purple-500/10">
          <div className="text-center space-y-4">
            <Sparkles className="w-16 h-16 mx-auto text-primary animate-pulse" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {personalityType}
            </h2>
            <h3 className="text-2xl font-semibold">{description.title}</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description.description}
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">What This Means:</h3>
          <div className="space-y-3 text-muted-foreground">
            <p>
              <strong className="text-foreground">Energy Source:</strong> You are {personalityType[0] === 'E' ? 'Extraverted - energized by social interaction' : 'Introverted - energized by solitude and reflection'}
            </p>
            <p>
              <strong className="text-foreground">Information Processing:</strong> You prefer {personalityType[1] === 'S' ? 'Sensing - concrete facts and real experiences' : 'Intuition - patterns and future possibilities'}
            </p>
            <p>
              <strong className="text-foreground">Decision Making:</strong> You make decisions based on {personalityType[2] === 'T' ? 'Thinking - logic and objective analysis' : 'Feeling - values and consideration of people'}
            </p>
            <p>
              <strong className="text-foreground">Lifestyle:</strong> You prefer a {personalityType[3] === 'J' ? 'Judging - structured and organized approach' : 'Perceiving - flexible and spontaneous approach'}
            </p>
          </div>
        </Card>

        <div className="text-center">
          <Button onClick={resetTest} variant="outline" size="lg">
            Retake Test
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Your personality type will be shared with the AI chatbot to provide more personalized support.
          </p>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / mbtiQuestions.length) * 100;
  const question = mbtiQuestions[currentQuestion];
  const currentAnswer = answers[currentQuestion];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Question {currentQuestion + 1} of {mbtiQuestions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="p-8">
        <h3 className="text-2xl font-semibold mb-6">{question.text}</h3>
        
        <RadioGroup
          key={currentQuestion}
          value={currentAnswer !== undefined ? currentAnswer.toString() : ""}
          onValueChange={(value) => handleAnswer(parseInt(value))}
          className="space-y-4"
        >
          {question.options.map((option, index) => (
            <div key={`${currentQuestion}-${index}`} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent transition-colors">
              <RadioGroupItem value={option.value.toString()} id={`q${currentQuestion}-option-${index}`} />
              <Label 
                htmlFor={`q${currentQuestion}-option-${index}`}
                className="flex-1 cursor-pointer text-base"
              >
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </Card>

      <div className="flex justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          variant="outline"
          size="lg"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentAnswer === undefined}
          size="lg"
        >
          {currentQuestion === mbtiQuestions.length - 1 ? 'See Results' : 'Next'}
        </Button>
      </div>
    </div>
  );
}