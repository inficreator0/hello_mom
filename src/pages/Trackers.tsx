import { Baby, Heart, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

const Trackers = () => {
  const trackers = [
    {
      icon: Baby,
      title: "Baby Tracker",
      description: "Track feeding, sleep, diapers, growth milestones, and vaccinations",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Heart,
      title: "Mother Tracker",
      description: "Monitor mood, recovery, exercise, water intake, and medication",
      color: "text-accent-foreground",
      bgColor: "bg-accent/30",
    },
    {
      icon: Calendar,
      title: "Appointments",
      description: "Keep track of doctor visits and important dates",
      color: "text-secondary-foreground",
      bgColor: "bg-secondary/50",
    },
    {
      icon: TrendingUp,
      title: "Milestones",
      description: "Record and celebrate important moments in your journey",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Health Trackers</h1>
          <p className="text-muted-foreground">
            Monitor your health and your baby's development
          </p>
        </div>

        <div className="space-y-4">
          {trackers.map((tracker) => {
            const Icon = tracker.icon;
            return (
              <Card key={tracker.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`${tracker.bgColor} ${tracker.color} rounded-xl p-3 transition-transform hover:scale-110`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle>{tracker.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {tracker.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Open Tracker
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-primary/10">
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              Detailed tracking features with charts, insights, and reminders will be available soon.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Trackers;

