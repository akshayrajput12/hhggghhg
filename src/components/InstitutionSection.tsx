import { Card, CardContent } from "@/components/ui/card";
import { MapPin, GraduationCap, Award, Building2 } from "lucide-react";

const highlights = [
  {
    icon: MapPin,
    label: "Jaipur, Rajasthan, India"
  },
  {
    icon: GraduationCap,
    label: "Affiliated to RTU Kota"
  },
  {
    icon: Award,
    label: "NAAC Accredited"
  }
];

const InstitutionSection = () => {
  return (
    <section id="institution" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto border-primary/20 overflow-hidden">
          <CardContent className="p-0">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-secondary to-secondary/80 p-8 text-center">
              <div className="inline-flex p-4 rounded-full bg-secondary-foreground/10 mb-4">
                <Building2 className="w-10 h-10 text-secondary-foreground" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-secondary-foreground mb-2">
                Swami Keshvanand Institute of Technology
              </h2>
              <p className="text-secondary-foreground/80">
                Management & Gramothan, Jaipur
              </p>
            </div>
            
            {/* Content */}
            <div className="p-8">
              <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto leading-relaxed">
                SKIT Jaipur is a premier technical institution committed to excellence 
                in education and innovation. The Department of Computer Science & Engineering 
                fosters cutting-edge research and practical solutions to real-world problems.
              </p>
              
              {/* Highlights */}
              <div className="flex flex-wrap justify-center gap-6">
                {highlights.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border"
                  >
                    <item.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default InstitutionSection;
