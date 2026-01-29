import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Property, useDeleteProperty, useCalculateTax } from "@/hooks/useProperties";
import { useToast } from "@/hooks/use-toast";
import { Home, Building2, Factory, Tractor, Layers, MapPin, Trash2, Calculator, Loader2 } from "lucide-react";

const propertyTypeIcons = {
  residential: Home,
  commercial: Building2,
  industrial: Factory,
  agricultural: Tractor,
  mixed_use: Layers,
};

const propertyTypeLabels = {
  residential: "Residential",
  commercial: "Commercial",
  industrial: "Industrial",
  agricultural: "Agricultural",
  mixed_use: "Mixed Use",
};

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const { mutate: deleteProperty, isPending: isDeleting } = useDeleteProperty();
  const { mutate: calculateTax, isPending: isCalculating } = useCalculateTax();
  const { toast } = useToast();

  const Icon = propertyTypeIcons[property.property_type];

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this property?")) {
      deleteProperty(property.id, {
        onSuccess: () => {
          toast({
            title: "Property Deleted",
            description: "The property has been removed.",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleCalculateTax = () => {
    calculateTax(property, {
      onSuccess: (data) => {
        toast({
          title: "Tax Calculated",
          description: `Estimated tax: ₹${data.total_tax.toLocaleString('en-IN')}`,
        });
      },
      onError: (error) => {
        toast({
          title: "Calculation Failed",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{property.property_name}</CardTitle>
              <Badge variant="secondary" className="mt-1">
                {propertyTypeLabels[property.property_type]}
              </Badge>
            </div>
          </div>
          <Badge variant={property.status === "active" ? "default" : "outline"}>
            {property.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{property.address}, {property.city}, {property.pincode}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Area</span>
            <p className="font-medium text-foreground">{property.area_sqft.toLocaleString('en-IN')} sq.ft</p>
          </div>
          <div>
            <span className="text-muted-foreground">Value</span>
            <p className="font-medium text-foreground">₹{property.property_value.toLocaleString('en-IN')}</p>
          </div>
          {property.floor_count && (
            <div>
              <span className="text-muted-foreground">Floors</span>
              <p className="font-medium text-foreground">{property.floor_count}</p>
            </div>
          )}
          {property.construction_year && (
            <div>
              <span className="text-muted-foreground">Built</span>
              <p className="font-medium text-foreground">{property.construction_year}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={handleCalculateTax}
            disabled={isCalculating}
          >
            {isCalculating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Calculator className="w-4 h-4 mr-2" />
            )}
            Calculate Tax
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
