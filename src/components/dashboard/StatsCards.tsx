import { Card, CardContent } from "@/components/ui/card";
import { Property, TaxCalculation } from "@/hooks/useProperties";
import { Home, IndianRupee, Receipt, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  properties: Property[];
  taxCalculations: TaxCalculation[];
}

const StatsCards = ({ properties, taxCalculations }: StatsCardsProps) => {
  const totalProperties = properties.length;
  const totalValue = properties.reduce((sum, p) => sum + p.property_value, 0);
  const totalArea = properties.reduce((sum, p) => sum + p.area_sqft, 0);
  const pendingTax = taxCalculations
    .filter((t) => t.payment_status === "pending")
    .reduce((sum, t) => sum + t.total_tax, 0);
  const totalTax = taxCalculations.reduce((sum, t) => sum + t.total_tax, 0);

  const stats = [
    {
      icon: Home,
      label: "Total Properties",
      value: totalProperties.toString(),
      subtext: `${totalArea.toLocaleString('en-IN')} sq.ft total area`,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: IndianRupee,
      label: "Total Property Value",
      value: `₹${(totalValue / 10000000).toFixed(2)}Cr`,
      subtext: `₹${totalValue.toLocaleString('en-IN')}`,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      icon: Receipt,
      label: "Pending Tax",
      value: `₹${pendingTax.toLocaleString('en-IN')}`,
      subtext: pendingTax > 0 ? "Payment due" : "All clear!",
      color: pendingTax > 0 ? "text-destructive" : "text-green-600",
      bgColor: pendingTax > 0 ? "bg-destructive/10" : "bg-green-600/10",
    },
    {
      icon: TrendingUp,
      label: "Total Tax Calculated",
      value: `₹${totalTax.toLocaleString('en-IN')}`,
      subtext: `${taxCalculations.length} calculations`,
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
