import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GraduationCap, Award, BookOpen } from "lucide-react";

const MentorSection = () => {
  return (
    <section id="mentor" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Project Mentor
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Guiding our journey towards innovation in digital governance
          </p>
        </div>
        
        {/* Mentor Card */}
        <Card className="max-w-3xl mx-auto border-primary/20 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row items-center">
              {/* Avatar Section */}
              <div className="bg-gradient-to-br from-primary to-chart-2 p-8 md:p-12 flex items-center justify-center">
                <Avatar className="w-32 h-32 ring-4 ring-primary-foreground/30 bg-secondary">
                  <AvatarFallback className="text-3xl font-bold text-secondary-foreground">
                    DM
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Info Section */}
              <div className="p-8 flex-1">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Dr. Mehul Mahrishi
                </h3>
                <p className="text-primary font-medium mb-4">
                  Associate Professor
                </p>
                <p className="text-muted-foreground mb-6">
                  Department of Computer Science & Engineering
                  <br />
                  Swami Keshvanand Institute of Technology, Management & Gramothan, Jaipur
                </p>
                
                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <span>Research Expert</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="w-4 h-4 text-primary" />
                    <span>AI & ML Specialist</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span>Published Author</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MentorSection;
