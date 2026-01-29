import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaxCalculation } from "@/hooks/useProperties";
import { Receipt, Calendar, TrendingUp, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TaxHistoryCardProps {
  calculation: TaxCalculation;
}

const TaxHistoryCard = ({ calculation }: TaxHistoryCardProps) => {
  const date = new Date(calculation.calculated_at);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-primary" />
            <CardTitle className="text-base">FY {calculation.fiscal_year}</CardTitle>
          </div>
          <Badge 
            variant={calculation.payment_status === "paid" ? "default" : "secondary"}
            className={calculation.payment_status === "paid" ? "bg-green-600" : ""}
          >
            {calculation.payment_status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-2xl font-bold text-foreground">
          ₹{calculation.total_tax.toLocaleString('en-IN')}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>Base Tax:</span>
            <span className="text-foreground">₹{calculation.base_tax.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>Location Factor:</span>
            <span className="text-foreground">{calculation.location_factor}x</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>Type Factor:</span>
            <span className="text-foreground">{calculation.property_type_factor}x</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>Depreciation:</span>
            <span className="text-foreground">{calculation.age_depreciation}%</span>
          </div>
        </div>

        {calculation.ai_reasoning && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-xs text-primary cursor-help">
                <Info className="w-3 h-3" />
                <span>AI Reasoning</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">{calculation.ai_reasoning}</p>
            </TooltipContent>
          </Tooltip>
        )}

        <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t border-border">
          <Calendar className="w-3 h-3" />
          <span>Calculated: {date.toLocaleDateString('en-IN')}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxHistoryCard;
