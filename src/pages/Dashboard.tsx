import { useAuth } from "@/contexts/AuthContext";
import { useProperties, useTaxCalculations } from "@/hooks/useProperties";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, Zap, Home, BarChart3, MessageSquare, Receipt, Loader2, Calculator } from "lucide-react";
import { useEffect } from "react";
import StatsCards from "@/components/dashboard/StatsCards";
import PropertyCard from "@/components/dashboard/PropertyCard";
import AddPropertyDialog from "@/components/dashboard/AddPropertyDialog";
import TaxBreakdownCard from "@/components/dashboard/TaxBreakdownCard";
import TaxMethodCard from "@/components/dashboard/TaxMethodCard";
import EnhancedAnalytics from "@/components/dashboard/EnhancedAnalytics";
import AIAssistant from "@/components/dashboard/AIAssistant";

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const { data: properties = [], isLoading: propertiesLoading } = useProperties();
  const { data: taxCalculations = [], isLoading: taxLoading } = useTaxCalculations();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const initials = user.user_metadata?.full_name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || user.email?.[0].toUpperCase() || "U";

  const isLoading = propertiesLoading || taxLoading;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">STMS</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 bg-primary">
                <AvatarFallback className="bg-transparent text-primary-foreground text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">
                  {user.user_metadata?.full_name || "User"}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
            Welcome back, {user.user_metadata?.full_name?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-muted-foreground">
            Manage your property taxes with AI-powered insights
          </p>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-card rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="mb-8">
            <StatsCards properties={properties} taxCalculations={taxCalculations} />
          </div>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="properties" className="gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Properties</span>
            </TabsTrigger>
            <TabsTrigger value="tax-history" className="gap-2">
              <Receipt className="w-4 h-4" />
              <span className="hidden sm:inline">Tax & Payments</span>
            </TabsTrigger>
            <TabsTrigger value="tax-method" className="gap-2">
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">UAV Method</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="assistant" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">AI Assistant</span>
            </TabsTrigger>
          </TabsList>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Your Properties</h2>
              <AddPropertyDialog />
            </div>
            
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 bg-card rounded-lg animate-pulse" />
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border border-border">
                <Home className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Properties Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first property to start calculating taxes
                </p>
                <AddPropertyDialog />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tax History Tab */}
          <TabsContent value="tax-history" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Tax Calculations & Payments</h2>
                <p className="text-sm text-muted-foreground">View detailed tax breakdowns and pay online</p>
              </div>
            </div>
            
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-card rounded-lg animate-pulse" />
                ))}
              </div>
            ) : taxCalculations.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border border-border">
                <Receipt className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Tax Calculations</h3>
                <p className="text-muted-foreground">
                  Calculate tax on your properties to see history here
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {taxCalculations.map((calculation) => {
                  const property = properties.find(p => p.id === calculation.property_id);
                  return (
                    <TaxBreakdownCard 
                      key={calculation.id} 
                      calculation={calculation} 
                      property={property}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Tax Method Tab */}
          <TabsContent value="tax-method" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Rajasthan Property Tax Method</h2>
              <p className="text-sm text-muted-foreground">Understanding the Unit Area Value (UAV) calculation method</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <TaxMethodCard />
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-primary" />
                    Example Calculation
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-muted-foreground mb-1">Property Details</p>
                      <p className="text-foreground">Residential • 1,000 sq.ft • Jaipur • Built 2015</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Base: 1,000 × ₹5</span>
                        <span className="text-foreground font-medium">₹5,000</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>× Type Factor (Residential)</span>
                        <span className="text-foreground font-medium">×1.0</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>× Location (Jaipur)</span>
                        <span className="text-foreground font-medium">×1.2</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>- Age Depreciation (10 yrs)</span>
                        <span className="text-green-600 font-medium">-10%</span>
                      </div>
                      <div className="border-t border-border pt-2 flex justify-between">
                        <span className="font-medium text-foreground">Annual Tax</span>
                        <span className="font-bold text-primary text-lg">₹5,400</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-medium text-foreground mb-3">Key Points</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      Tax is calculated annually based on property characteristics
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      Commercial properties have higher base rates than residential
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      Major cities like Jaipur have higher location factors
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      Older properties get depreciation benefits up to 20%
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Analytics & Insights</h2>
              <p className="text-sm text-muted-foreground">Comprehensive analysis of your property portfolio</p>
            </div>
            <EnhancedAnalytics properties={properties} taxCalculations={taxCalculations} />
          </TabsContent>

          {/* AI Assistant Tab */}
          <TabsContent value="assistant" className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">AI Tax Assistant</h2>
            <div className="grid lg:grid-cols-2 gap-6">
              <AIAssistant properties={properties} taxCalculations={taxCalculations} />
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-medium text-foreground mb-4">Quick Questions</h3>
                  <div className="space-y-2">
                    {[
                      "What are the property tax exemptions in Rajasthan?",
                      "How is property tax calculated using UAV method?",
                      "What's the deadline for property tax payment?",
                      "What rebates are available for senior citizens?",
                    ].map((question, i) => (
                      <button
                        key={i}
                        className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
