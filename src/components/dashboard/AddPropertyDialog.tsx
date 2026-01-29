import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAddProperty, PropertyFormData } from "@/hooks/useProperties";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2 } from "lucide-react";
import { z } from "zod";

const propertySchema = z.object({
  property_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  property_type: z.enum(["residential", "commercial", "industrial", "agricultural", "mixed_use"]),
  address: z.string().min(5, "Address is required").max(500),
  city: z.string().min(2, "City is required").max(100),
  state: z.string().default("Rajasthan"),
  pincode: z.string().regex(/^\d{6}$/, "Enter valid 6-digit pincode"),
  area_sqft: z.number().min(50, "Area must be at least 50 sq.ft").max(1000000),
  built_up_area_sqft: z.number().optional(),
  floor_count: z.number().min(1).max(100).optional(),
  construction_year: z.number().min(1900).max(new Date().getFullYear()).optional(),
  property_value: z.number().min(10000, "Property value must be at least ₹10,000").max(10000000000),
});

const AddPropertyDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<PropertyFormData>>({
    city: "Jaipur",
    state: "Rajasthan",
    property_type: "residential",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { mutate: addProperty, isPending } = useAddProperty();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = propertySchema.safeParse({
      ...formData,
      area_sqft: Number(formData.area_sqft),
      built_up_area_sqft: formData.built_up_area_sqft ? Number(formData.built_up_area_sqft) : undefined,
      floor_count: formData.floor_count ? Number(formData.floor_count) : undefined,
      construction_year: formData.construction_year ? Number(formData.construction_year) : undefined,
      property_value: Number(formData.property_value),
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    addProperty(result.data as PropertyFormData, {
      onSuccess: () => {
        toast({
          title: "Property Added",
          description: "Your property has been registered successfully.",
        });
        setOpen(false);
        setFormData({ city: "Jaipur", state: "Rajasthan", property_type: "residential" });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Property
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register New Property</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="property_name">Property Name *</Label>
              <Input
                id="property_name"
                placeholder="My House"
                value={formData.property_name || ""}
                onChange={(e) => setFormData({ ...formData, property_name: e.target.value })}
                className={errors.property_name ? "border-destructive" : ""}
              />
              {errors.property_name && <p className="text-xs text-destructive">{errors.property_name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="property_type">Property Type *</Label>
              <Select
                value={formData.property_type}
                onValueChange={(v) => setFormData({ ...formData, property_type: v as PropertyFormData["property_type"] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="agricultural">Agricultural</SelectItem>
                  <SelectItem value="mixed_use">Mixed Use</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              placeholder="Plot No, Street, Area"
              value={formData.address || ""}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className={errors.address ? "border-destructive" : ""}
            />
            {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Select
                value={formData.city}
                onValueChange={(v) => setFormData({ ...formData, city: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Jaipur">Jaipur</SelectItem>
                  <SelectItem value="Jodhpur">Jodhpur</SelectItem>
                  <SelectItem value="Udaipur">Udaipur</SelectItem>
                  <SelectItem value="Kota">Kota</SelectItem>
                  <SelectItem value="Ajmer">Ajmer</SelectItem>
                  <SelectItem value="Bikaner">Bikaner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" value="Rajasthan" disabled className="bg-muted" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                placeholder="302001"
                value={formData.pincode || ""}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className={errors.pincode ? "border-destructive" : ""}
              />
              {errors.pincode && <p className="text-xs text-destructive">{errors.pincode}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area_sqft">Plot Area (sq.ft) *</Label>
              <Input
                id="area_sqft"
                type="number"
                placeholder="1000"
                value={formData.area_sqft || ""}
                onChange={(e) => setFormData({ ...formData, area_sqft: Number(e.target.value) })}
                className={errors.area_sqft ? "border-destructive" : ""}
              />
              {errors.area_sqft && <p className="text-xs text-destructive">{errors.area_sqft}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="built_up_area_sqft">Built-up Area (sq.ft)</Label>
              <Input
                id="built_up_area_sqft"
                type="number"
                placeholder="800"
                value={formData.built_up_area_sqft || ""}
                onChange={(e) => setFormData({ ...formData, built_up_area_sqft: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="floor_count">Number of Floors</Label>
              <Input
                id="floor_count"
                type="number"
                placeholder="2"
                value={formData.floor_count || ""}
                onChange={(e) => setFormData({ ...formData, floor_count: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="construction_year">Construction Year</Label>
              <Input
                id="construction_year"
                type="number"
                placeholder="2015"
                value={formData.construction_year || ""}
                onChange={(e) => setFormData({ ...formData, construction_year: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="property_value">Property Value (₹) *</Label>
              <Input
                id="property_value"
                type="number"
                placeholder="5000000"
                value={formData.property_value || ""}
                onChange={(e) => setFormData({ ...formData, property_value: Number(e.target.value) })}
                className={errors.property_value ? "border-destructive" : ""}
              />
              {errors.property_value && <p className="text-xs text-destructive">{errors.property_value}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Register Property
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPropertyDialog;
