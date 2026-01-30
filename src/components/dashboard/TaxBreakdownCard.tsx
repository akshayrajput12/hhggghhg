import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaxCalculation, Property } from "@/hooks/useProperties";
import { Receipt, Calendar, TrendingUp, Info, CreditCard, Clock, CheckCircle2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";

interface TaxBreakdownCardProps {
  calculation: TaxCalculation;
  property?: Property;
}

const TaxBreakdownCard = ({ calculation, property }: TaxBreakdownCardProps) => {
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const date = new Date(calculation.calculated_at);

  // Calculate step-by-step breakdown
  const baseRate = property?.property_type === "commercial" || property?.property_type === "industrial" ? 8 : 5;
  const area = property?.area_sqft || 0;
  const stepByStep = {
    baseCalculation: area * baseRate,
    afterTypeFactor: area * baseRate * (calculation.property_type_factor || 1),
    afterLocationFactor: area * baseRate * (calculation.property_type_factor || 1) * (calculation.location_factor || 1),
    depreciation: calculation.age_depreciation || 0,
  };

  return (
    <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Receipt className="w-4 h-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">FY {calculation.fiscal_year}</CardTitle>
              {property && (
                <p className="text-xs text-muted-foreground">{property.property_name}</p>
              )}
            </div>
          </div>
          <Badge 
            variant={calculation.payment_status === "paid" ? "default" : "secondary"}
            className={calculation.payment_status === "paid" ? "bg-green-600" : "bg-amber-500 text-amber-950"}
          >
            {calculation.payment_status === "paid" ? (
              <><CheckCircle2 className="w-3 h-3 mr-1" /> Paid</>
            ) : (
              <><Clock className="w-3 h-3 mr-1" /> Pending</>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Tax Amount */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-center">
          <p className="text-xs text-muted-foreground mb-1">Total Annual Tax</p>
          <p className="text-3xl font-bold text-primary">
            ₹{calculation.total_tax.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Calculation Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Calculation Breakdown
          </h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Base Tax (Area × Rate)</span>
              <span className="font-medium text-foreground">₹{calculation.base_tax.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-border">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Property Type Factor</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Multiplier based on property usage type</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Badge variant="outline" className="font-mono">
                ×{calculation.property_type_factor}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-border">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Location Factor</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>City-wise rate adjustment</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Badge variant="outline" className="font-mono">
                ×{calculation.location_factor}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-border">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Age Depreciation</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reduction for property age</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Badge variant="outline" className="font-mono text-green-600">
                -{calculation.age_depreciation}%
              </Badge>
            </div>
          </div>
        </div>

        {/* AI Reasoning */}
        {calculation.ai_reasoning && (
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-foreground">AI Analysis</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {calculation.ai_reasoning}
            </p>
          </div>
        )}

        {/* Calculated Date */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>Calculated: {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>

        {/* Pay Now Button */}
        {calculation.payment_status !== "paid" && (
          <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" size="lg">
                <CreditCard className="w-4 h-4 mr-2" />
                Pay Now - ₹{calculation.total_tax.toLocaleString('en-IN')}
              </Button>
            </DialogTrigger>
            <DialogContent className="text-center">
              <DialogHeader>
                <DialogTitle className="text-center">Online Payment</DialogTitle>
                <DialogDescription className="text-center">Payment gateway integration status</DialogDescription>
              </DialogHeader>
              <div className="py-8">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-10 h-10 text-primary" />
                </div>
                <Badge className="mb-4 bg-amber-500 text-amber-950">Coming Soon</Badge>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Payment Gateway Integration
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  We're integrating with Rajasthan Government's official payment portal. 
                  Online payments will be available soon with UPI, Net Banking, and Card options.
                </p>
                <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-xs text-muted-foreground">
                    Meanwhile, you can pay at your nearest Nagar Nigam office or e-Mitra Kiosk
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setPayDialogOpen(false)}>
                Close
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default TaxBreakdownCard;
