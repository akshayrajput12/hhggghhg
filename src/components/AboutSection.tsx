import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Brain, Shield, Users, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered",
    description: "Leveraging cutting-edge artificial intelligence for intelligent automation"
  },
  {
    icon: Shield,
    title: "Transparent",
    description: "Ensuring accountability and transparency in governance"
  },
  {
    icon: Users,
    title: "Citizen-Friendly",
    description: "Designed with citizens at the center of every decision"
  },
  {
    icon: BarChart3,
    title: "Data-Driven",
    description: "Making informed decisions through comprehensive analytics"
  }
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            About STMS
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transforming traditional tax systems with intelligent automation and transparency
          </p>
        </div>
        
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="group hover:shadow-lg transition-shadow duration-300 border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To leverage cutting-edge AI and NLP technologies in creating a transparent, 
                efficient, and citizen-friendly property tax management system that reduces 
                administrative burden and enhances governance.
              </p>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-lg transition-shadow duration-300 border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To establish STMS as a benchmark for digital governance solutions across India, 
                demonstrating how technology can bridge the gap between citizens and government 
                services while ensuring transparency and accountability.
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center p-6 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors duration-300"
            >
              <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
