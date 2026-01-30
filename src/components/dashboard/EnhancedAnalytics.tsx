import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Property, TaxCalculation } from "@/hooks/useProperties";
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, AreaChart, Area, 
  RadialBarChart, RadialBar, ComposedChart, Line,
  Treemap
} from "recharts";
import { TrendingUp, PieChartIcon, BarChart3, Activity, Target } from "lucide-react";

interface EnhancedAnalyticsProps {
  properties: Property[];
  taxCalculations: TaxCalculation[];
}

const COLORS = [
  "hsl(200, 98%, 39%)", 
  "hsl(213, 93%, 67%)", 
  "hsl(142, 76%, 36%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 84%, 60%)",
];

const EnhancedAnalytics = ({ properties, taxCalculations }: EnhancedAnalyticsProps) => {
  // Property type distribution
  const propertyTypeData = properties.reduce((acc, prop) => {
    const type = prop.property_type.replace("_", " ").charAt(0).toUpperCase() + prop.property_type.slice(1).replace("_", " ");
    const existing = acc.find((item) => item.name === type);
    if (existing) {
      existing.value += 1;
      existing.totalValue += prop.property_value;
    } else {
      acc.push({ name: type, value: 1, totalValue: prop.property_value });
    }
    return acc;
  }, [] as { name: string; value: number; totalValue: number }[]);

  // Property value by city
  const cityData = properties.reduce((acc, prop) => {
    const city = prop.city;
    const existing = acc.find((item) => item.name === city);
    if (existing) {
      existing.value += prop.property_value;
      existing.count += 1;
      existing.area += prop.area_sqft;
    } else {
      acc.push({ name: city, value: prop.property_value, count: 1, area: prop.area_sqft });
    }
    return acc;
  }, [] as { name: string; value: number; count: number; area: number }[]);

  // Tax payment status
  const paymentStatusData = [
    { 
      name: "Paid", 
      value: taxCalculations.filter(t => t.payment_status === "paid").length,
      fill: "hsl(142, 76%, 36%)"
    },
    { 
      name: "Pending", 
      value: taxCalculations.filter(t => t.payment_status === "pending").length,
      fill: "hsl(38, 92%, 50%)"
    },
  ].filter(d => d.value > 0);

  // Tax by fiscal year with trend
  const taxByYear = taxCalculations.reduce((acc, calc) => {
    const year = calc.fiscal_year;
    const existing = acc.find((item) => item.year === year);
    if (existing) {
      existing.total += calc.total_tax;
      existing.count += 1;
      existing.avgTax = existing.total / existing.count;
    } else {
      acc.push({ year, total: calc.total_tax, count: 1, avgTax: calc.total_tax });
    }
    return acc;
  }, [] as { year: string; total: number; count: number; avgTax: number }[]);

  // Property value distribution for treemap
  const valueDistribution = properties.map(prop => ({
    name: prop.property_name.substring(0, 15),
    size: prop.property_value / 100000,
    type: prop.property_type,
  }));

  // Tax factor analysis
  const factorAnalysis = taxCalculations.slice(0, 10).map((calc, i) => {
    const prop = properties.find(p => p.id === calc.property_id);
    return {
      name: prop?.property_name?.substring(0, 10) || `Property ${i + 1}`,
      typeFactor: (calc.property_type_factor || 1) * 100,
      locationFactor: (calc.location_factor || 1) * 100,
      depreciation: calc.age_depreciation || 0,
    };
  });

  // Summary metrics for radial chart
  const totalProperties = properties.length;
  const totalTaxPaid = taxCalculations.filter(t => t.payment_status === "paid").reduce((sum, t) => sum + t.total_tax, 0);
  const totalTaxPending = taxCalculations.filter(t => t.payment_status === "pending").reduce((sum, t) => sum + t.total_tax, 0);
  const complianceRate = taxCalculations.length > 0 
    ? (taxCalculations.filter(t => t.payment_status === "paid").length / taxCalculations.length) * 100 
    : 0;

  const summaryData = [
    { name: "Compliance", value: complianceRate, fill: "hsl(142, 76%, 36%)" },
  ];

  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Data Available</h3>
          <p className="text-muted-foreground">Add properties to see detailed analytics and insights</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Row */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Properties</p>
                <p className="text-2xl font-bold text-foreground">{totalProperties}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/20">
                <Target className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Tax Paid</p>
                <p className="text-2xl font-bold text-green-600">₹{(totalTaxPaid / 1000).toFixed(1)}K</p>
              </div>
              <div className="p-2 rounded-lg bg-green-500/20">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Tax Pending</p>
                <p className="text-2xl font-bold text-amber-600">₹{(totalTaxPending / 1000).toFixed(1)}K</p>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Activity className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-chart-2/10 to-chart-2/5 border-chart-2/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Compliance Rate</p>
                <p className="text-2xl font-bold text-chart-2">{complianceRate.toFixed(0)}%</p>
              </div>
              <div className="p-2 rounded-lg bg-chart-2/20">
                <PieChartIcon className="w-5 h-5 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Property Type Distribution - Donut */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-primary" />
              Property Type Distribution
            </CardTitle>
            <CardDescription>Distribution by property category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string, props: any) => [
                    `${value} properties (₹${(props.payload.totalValue / 100000).toFixed(1)}L)`,
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* City-wise Analysis - Bar + Line */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              City-wise Property Analysis
            </CardTitle>
            <CardDescription>Value and count by city</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={cityData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis yAxisId="left" tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} className="text-xs" />
                <YAxis yAxisId="right" orientation="right" className="text-xs" />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === "value" ? `₹${value.toLocaleString('en-IN')}` : value,
                    name === "value" ? "Total Value" : "Properties"
                  ]}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="value" name="Total Value" fill="hsl(200, 98%, 39%)" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="count" name="Count" stroke="hsl(38, 92%, 50%)" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tax History Trend */}
        {taxByYear.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Tax Trend by Fiscal Year
              </CardTitle>
              <CardDescription>Total and average tax calculations</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={taxByYear}>
                  <defs>
                    <linearGradient id="taxGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(200, 98%, 39%)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(200, 98%, 39%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="year" className="text-xs" />
                  <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} className="text-xs" />
                  <Tooltip 
                    formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Tax Amount']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="hsl(200, 98%, 39%)" 
                    fill="url(#taxGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Payment Status */}
        {paymentStatusData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Payment Status Overview
              </CardTitle>
              <CardDescription>Tax payment compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="40%" 
                  outerRadius="80%" 
                  data={paymentStatusData}
                  startAngle={180}
                  endAngle={-180}
                >
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    label={{ fill: 'var(--foreground)', position: 'insideStart', formatter: (v: number) => `${v}` }}
                  />
                  <Legend 
                    iconSize={10}
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Tax Factor Comparison */}
        {factorAnalysis.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Tax Factor Analysis
              </CardTitle>
              <CardDescription>Comparison of tax factors across properties</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={factorAnalysis} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" domain={[0, 200]} className="text-xs" />
                  <YAxis dataKey="name" type="category" width={80} className="text-xs" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="typeFactor" name="Type Factor %" fill="hsl(200, 98%, 39%)" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="locationFactor" name="Location Factor %" fill="hsl(213, 93%, 67%)" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="depreciation" name="Age Depreciation %" fill="hsl(142, 76%, 36%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EnhancedAnalytics;
