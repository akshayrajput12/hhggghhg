import { Zap, MapPin, GraduationCap, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-primary">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">STMS</span>
            </div>
            <p className="text-secondary-foreground/70 text-sm mb-4">
              Smart Tax Management System
            </p>
            <p className="text-secondary-foreground/50 text-sm italic">
              "Bridging AI and Governance for a Smarter India"
            </p>
          </div>

          {/* Institution */}
          <div>
            <h4 className="font-semibold mb-4">Institution</h4>
            <p className="text-secondary-foreground/70 text-sm mb-2">
              Swami Keshvanand Institute of Technology, Management & Gramothan
            </p>
            <p className="text-secondary-foreground/70 text-sm">
              Department of Computer Science & Engineering
            </p>
            <p className="text-secondary-foreground/50 text-sm mt-2">
              Academic Session 2025-26
            </p>
          </div>

          {/* Credentials */}
          <div>
            <h4 className="font-semibold mb-4">Credentials</h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-secondary-foreground/70 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Jaipur, Rajasthan, India</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-foreground/70 text-sm">
                <GraduationCap className="w-4 h-4" />
                <span>Affiliated to RTU Kota</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-foreground/70 text-sm">
                <Award className="w-4 h-4" />
                <span>NAAC Accredited</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-secondary-foreground/10 text-center">
          <p className="text-secondary-foreground/50 text-sm">
            © 2025 STMS. All rights reserved. | Bridging AI and Governance for a Smarter India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
