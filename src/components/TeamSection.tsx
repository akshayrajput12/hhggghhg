import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const teamMembers = [
  {
    initials: "GPS",
    name: "Gaurav Pratap Singh",
    role: "Full Stack Developer",
    skills: ["AI Model Integration", "Backend Architecture"],
    color: "bg-primary"
  },
  {
    initials: "KJ",
    name: "Kapil Jarwal",
    role: "Frontend Developer",
    skills: ["UI/UX Design", "Dashboard Development"],
    color: "bg-chart-2"
  },
  {
    initials: "KJ",
    name: "Khushal Jangid",
    role: "Data Engineer",
    skills: ["NLP Pipeline", "Data Analytics"],
    color: "bg-chart-5"
  }
];

const TeamSection = () => {
  return (
    <section id="team" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Meet Our Team
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Final Year CSE Students, SKIT Jaipur | Session 2025-26
          </p>
        </div>
        
        {/* Team Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member, index) => (
            <Card 
              key={index}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 overflow-hidden"
            >
              <CardContent className="p-8 text-center">
                {/* Avatar */}
                <Avatar className={`w-24 h-24 mx-auto mb-6 ${member.color} ring-4 ring-primary/20`}>
                  <AvatarFallback className="text-xl font-bold bg-transparent text-primary-foreground">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                
                {/* Name & Role */}
                <h3 className="text-xl font-bold text-foreground mb-2">{member.name}</h3>
                <p className="text-primary font-medium mb-4">{member.role}</p>
                
                {/* Skills */}
                <div className="flex flex-wrap justify-center gap-2">
                  {member.skills.map((skill, skillIndex) => (
                    <Badge 
                      key={skillIndex}
                      variant="secondary"
                      className="text-xs"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
