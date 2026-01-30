import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Building2, MapPin, Calendar, TrendingDown, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const TaxMethodCard = () => {
  const taxFactors = [
    {
      title: "Base Rate (per sq.ft)",
      description: "Annual Rateable Value calculation",
      residential: "₹5",
      commercial: "₹8",
      icon: Calculator,
    },
    {
      title: "Property Type Factor",
      description: "Multiplier based on usage",
      values: [
        { type: "Residential", factor: "1.0x" },
        { type: "Commercial", factor: "1.5x" },
        { type: "Industrial", factor: "1.3x" },
        { type: "Agricultural", factor: "0.5x" },
        { type: "Mixed Use", factor: "1.2x" },
      ],
      icon: Building2,
    },
    {
      title: "Location Factor",
      description: "City-wise multiplier",
      values: [
        { type: "Jaipur", factor: "1.2x" },
        { type: "Udaipur", factor: "1.1x" },
        { type: "Jodhpur", factor: "1.0x" },
        { type: "Other Cities", factor: "0.8x" },
      ],
      icon: MapPin,
    },
    {
      title: "Age Depreciation",
      description: "Reduction for older properties",
      values: [
        { type: "0-10 years", factor: "0%" },
        { type: "10-20 years", factor: "10%" },
        { type: "20+ years", factor: "20%" },
      ],
      icon: Calendar,
    },
  ];

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Rajasthan UAV Method</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Unit Area Value Tax Calculation</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
            Official Method
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formula Display */}
        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Tax Calculation Formula</span>
          </div>
          <div className="text-center py-3">
            <code className="text-sm bg-background px-4 py-2 rounded-lg border border-border text-foreground">
              Tax = (Area × Base Rate) × Type Factor × Location Factor × (1 - Depreciation)
            </code>
          </div>
        </div>

        {/* Base Rates */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-foreground">Base Rates (per sq.ft/year)</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-chart-1/10 border border-chart-1/20">
              <p className="text-xs text-muted-foreground">Residential</p>
              <p className="text-xl font-bold text-chart-1">₹5</p>
            </div>
            <div className="p-3 rounded-lg bg-chart-2/10 border border-chart-2/20">
              <p className="text-xs text-muted-foreground">Commercial</p>
              <p className="text-xl font-bold text-chart-2">₹8</p>
            </div>
          </div>
        </div>

        {/* Property Type Factors */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-foreground">Property Type Factors</h4>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[
              { type: "Residential", factor: "1.0x", color: "bg-chart-1" },
              { type: "Commercial", factor: "1.5x", color: "bg-chart-2" },
              { type: "Industrial", factor: "1.3x", color: "bg-chart-3" },
              { type: "Agricultural", factor: "0.5x", color: "bg-chart-4" },
              { type: "Mixed", factor: "1.2x", color: "bg-chart-5" },
            ].map((item) => (
              <Tooltip key={item.type}>
                <TooltipTrigger asChild>
                  <div className="p-2 rounded-lg bg-muted/50 text-center cursor-help hover:bg-muted transition-colors">
                    <div className={`w-2 h-2 rounded-full ${item.color} mx-auto mb-1`} />
                    <p className="text-xs text-muted-foreground truncate">{item.type}</p>
                    <p className="text-sm font-bold text-foreground">{item.factor}</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.type} property multiplier: {item.factor}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Location Factors */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-foreground">Location Factors</h4>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { city: "Jaipur", factor: "1.2x" },
              { city: "Udaipur", factor: "1.1x" },
              { city: "Jodhpur", factor: "1.0x" },
              { city: "Others", factor: "0.8x" },
            ].map((item) => (
              <div key={item.city} className="p-2 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">{item.city}</p>
                <p className="text-sm font-bold text-foreground">{item.factor}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Age Depreciation */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-foreground">Age Depreciation</h4>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { age: "0-10 yrs", reduction: "0%" },
              { age: "10-20 yrs", reduction: "10%" },
              { age: "20+ yrs", reduction: "20%" },
            ].map((item) => (
              <div key={item.age} className="p-2 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">{item.age}</p>
                <p className="text-sm font-bold text-green-600">-{item.reduction}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            As per Rajasthan Municipalities Act, 2009 & Urban Development Guidelines
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxMethodCard;
