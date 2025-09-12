import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Phone, Heart, AlertTriangle, Users, ExternalLink, MessageCircle } from "lucide-react";

interface EmergencyContact {
  name: string;
  phone: string;
  description: string;
  available: string;
  type: 'crisis' | 'support' | 'text';
}

const emergencyContacts: EmergencyContact[] = [
  {
    name: "988 Suicide & Crisis Lifeline",
    phone: "988",
    description: "24/7 free and confidential support for people in distress",
    available: "24/7",
    type: "crisis"
  },
  {
    name: "Crisis Text Line",
    phone: "741741",
    description: "Text HOME for crisis support via text message",
    available: "24/7",
    type: "text"
  },
  {
    name: "National Child Abuse Hotline",
    phone: "1-800-4-A-CHILD",
    description: "Support for children experiencing abuse",
    available: "24/7",
    type: "support"
  },
  {
    name: "National Domestic Violence Hotline",
    phone: "1-800-799-7233",
    description: "Support for domestic violence situations",
    available: "24/7",
    type: "support"
  },
  {
    name: "Teen Line",
    phone: "1-800-852-8336",
    description: "Teens helping teens through difficult times",
    available: "6PM-10PM PST",
    type: "support"
  }
];

const warningSignsData = [
  {
    category: "Immediate Danger Signs",
    signs: [
      "Talking about wanting to die or kill themselves",
      "Looking for ways to kill themselves",
      "Talking about feeling hopeless or having no purpose",
      "Talking about feeling trapped or in unbearable pain",
      "Talking about being a burden to others",
      "Increasing use of alcohol or drugs",
      "Acting anxious, agitated, or recklessly",
      "Sleeping too little or too much",
      "Withdrawing or feeling isolated",
      "Showing rage or talking about seeking revenge",
      "Displaying extreme mood swings"
    ]
  },
  {
    category: "When to Seek Help",
    signs: [
      "Persistent sad, anxious, or empty mood",
      "Loss of interest in activities once enjoyed",
      "Significant changes in appetite or weight",
      "Trouble sleeping or sleeping too much",
      "Feeling restless or having trouble sitting still",
      "Feeling worthless or guilty",
      "Difficulty thinking or concentrating",
      "Thoughts of death or suicide"
    ]
  }
];

const resources = [
  {
    name: "Crisis Prevention",
    description: "Learn warning signs and prevention strategies",
    url: "#prevention"
  },
  {
    name: "Mental Health Resources",
    description: "Find local mental health professionals",
    url: "#resources"
  },
  {
    name: "Safety Planning",
    description: "Create a personal safety plan",
    url: "#safety"
  }
];

export function EmergencySection() {
  const [activeAlert, setActiveAlert] = useState(false);

  const handleEmergencyCall = (phone: string) => {
    // In a real app, this would trigger a call
    console.log(`Calling ${phone}`);
    setActiveAlert(true);
    setTimeout(() => setActiveAlert(false), 5000);
  };

  const handleCrisisDetected = () => {
    setActiveAlert(true);
  };

  return (
    <div className="space-y-6">
      {/* Emergency Alert */}
      {activeAlert && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Crisis Support Activated:</strong> If you're in immediate danger, please call 911 or go to your nearest emergency room. Your life matters and help is available.
          </AlertDescription>
        </Alert>
      )}

      {/* Immediate Crisis Support */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Immediate Crisis Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Heart className="h-4 w-4" />
              <AlertDescription>
                <strong>You are not alone.</strong> If you're having thoughts of suicide or self-harm, please reach out for help immediately. These resources are available 24/7.
              </AlertDescription>
            </Alert>
            
            <div className="grid gap-3">
              {emergencyContacts.slice(0, 2).map((contact, index) => (
                <Card key={index} className="bg-destructive/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-destructive">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground">{contact.description}</p>
                        <p className="text-sm font-medium">Available: {contact.available}</p>
                      </div>
                      <Button 
                        variant="emergency" 
                        size="lg"
                        onClick={() => handleEmergencyCall(contact.phone)}
                      >
                        {contact.type === 'text' ? (
                          <MessageCircle className="w-5 h-5 mr-2" />
                        ) : (
                          <Phone className="w-5 h-5 mr-2" />
                        )}
                        {contact.phone}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Support Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Additional Support Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {emergencyContacts.slice(2).map((contact, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{contact.name}</h3>
                        <Badge variant={contact.type === 'crisis' ? 'destructive' : 'secondary'}>
                          {contact.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{contact.description}</p>
                      <p className="text-sm text-muted-foreground">Available: {contact.available}</p>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => handleEmergencyCall(contact.phone)}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Warning Signs */}
      <Card>
        <CardHeader>
          <CardTitle>Know the Warning Signs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {warningSignsData.map((category, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-3 text-destructive">{category.category}</h3>
                <ul className="space-y-2">
                  {category.signs.map((sign, signIndex) => (
                    <li key={signIndex} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                      {sign}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Educational Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {resources.map((resource, index) => (
              <Card key={index}>
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold mb-2">{resource.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Action Plan */}
      <Card>
        <CardHeader>
          <CardTitle>If You're in Crisis Right Now</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Immediate action steps:</strong>
              </AlertDescription>
            </Alert>
            
            <ol className="space-y-2 text-sm">
              <li className="flex gap-3">
                <span className="bg-destructive text-destructive-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0">1</span>
                Remove any means of self-harm from your immediate area
              </li>
              <li className="flex gap-3">
                <span className="bg-destructive text-destructive-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0">2</span>
                Call 988 (Suicide & Crisis Lifeline) or text HOME to 741741
              </li>
              <li className="flex gap-3">
                <span className="bg-destructive text-destructive-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0">3</span>
                Reach out to a trusted friend, family member, or counselor
              </li>
              <li className="flex gap-3">
                <span className="bg-destructive text-destructive-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0">4</span>
                If in immediate danger, call 911 or go to your nearest emergency room
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}