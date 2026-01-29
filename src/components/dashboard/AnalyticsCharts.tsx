import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property, TaxCalculation } from "@/hooks/useProperties";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line, AreaChart, Area } from "recharts";

interface AnalyticsChartsProps {
  properties: Property[];
  taxCalculations: TaxCalculation[];
}

const COLORS = ["hsl(200, 98%, 39%)", "hsl(213, 93%, 67%)", "hsl(215, 20%, 65%)", "hsl(215, 16%, 46%)", "hsl(215, 19%, 34%)"];

const AnalyticsCharts = ({ properties, taxCalculations }: AnalyticsChartsProps) => {
  // Property type distribution
  const propertyTypeData = properties.reduce((acc, prop) => {
    const type = prop.property_type;
    const existing = acc.find((item) => item.name === type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: type, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Property value by city
  const cityData = properties.reduce((acc, prop) => {
    const city = prop.city;
    const existing = acc.find((item) => item.name === city);
    if (existing) {
      existing.value += prop.property_value;
      existing.count += 1;
    } else {
      acc.push({ name: city, value: prop.property_value, count: 1 });
    }
    return acc;
  }, [] as { name: string; value: number; count: number }[]);

  // Tax by fiscal year
  const taxByYear = taxCalculations.reduce((acc, calc) => {
    const year = calc.fiscal_year;
    const existing = acc.find((item) => item.year === year);
    if (existing) {
      existing.total += calc.total_tax;
      existing.count += 1;
    } else {
      acc.push({ year, total: calc.total_tax, count: 1 });
    }
    return acc;
  }, [] as { year: string; total: number; count: number }[]);

  // Area distribution
  const areaData = properties.map((prop) => ({
    name: prop.property_name.substring(0, 12),
    area: prop.area_sqft,
    value: prop.property_value / 100000, // In lakhs
  }));

  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Add properties to see analytics and charts
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Property Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Property Type Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={propertyTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {propertyTypeData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Property Value by City */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Property Value by City (₹)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={cityData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`} className="text-xs" />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Value']}
                labelClassName="text-foreground"
              />
              <Bar dataKey="value" fill="hsl(200, 98%, 39%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tax History */}
      {taxByYear.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tax by Fiscal Year</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={taxByYear}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="year" className="text-xs" />
                <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} className="text-xs" />
                <Tooltip 
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Total Tax']}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="hsl(200, 98%, 39%)" 
                  fill="hsl(200, 98%, 39%)" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Area vs Value Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Area vs Value Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={areaData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis yAxisId="left" className="text-xs" />
              <YAxis yAxisId="right" orientation="right" className="text-xs" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="area" name="Area (sq.ft)" fill="hsl(213, 93%, 67%)" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="value" name="Value (₹L)" fill="hsl(200, 98%, 39%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsCharts;
