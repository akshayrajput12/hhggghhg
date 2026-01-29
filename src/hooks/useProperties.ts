import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export interface Property {
  id: string;
  user_id: string;
  property_name: string;
  property_type: "residential" | "commercial" | "industrial" | "agricultural" | "mixed_use";
  address: string;
  city: string;
  state: string;
  pincode: string;
  area_sqft: number;
  built_up_area_sqft: number | null;
  floor_count: number | null;
  construction_year: number | null;
  property_value: number;
  status: "active" | "pending" | "disputed" | "exempt";
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export interface TaxCalculation {
  id: string;
  property_id: string;
  user_id: string;
  fiscal_year: string;
  base_tax: number;
  location_factor: number;
  property_type_factor: number;
  age_depreciation: number;
  total_tax: number;
  ai_reasoning: string | null;
  calculated_at: string;
  payment_status: string;
  paid_at: string | null;
}

export interface PropertyFormData {
  property_name: string;
  property_type: Property["property_type"];
  address: string;
  city: string;
  state: string;
  pincode: string;
  area_sqft: number;
  built_up_area_sqft?: number;
  floor_count?: number;
  construction_year?: number;
  property_value: number;
}

export function useProperties() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["properties", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Property[];
    },
    enabled: !!user,
  });
}

export function useTaxCalculations() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["tax_calculations", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tax_calculations")
        .select("*")
        .order("calculated_at", { ascending: false });
      
      if (error) throw error;
      return data as TaxCalculation[];
    },
    enabled: !!user,
  });
}

export function useAddProperty() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (formData: PropertyFormData) => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("properties")
        .insert({
          ...formData,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as Property;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (propertyId: string) => {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", propertyId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["tax_calculations"] });
    },
  });
}

export function useCalculateTax() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (property: Property) => {
      if (!user) throw new Error("User not authenticated");
      
      // Call AI edge function
      const response = await supabase.functions.invoke("calculate-tax", {
        body: {
          property: {
            property_type: property.property_type,
            area_sqft: property.area_sqft,
            built_up_area_sqft: property.built_up_area_sqft,
            property_value: property.property_value,
            city: property.city,
            construction_year: property.construction_year,
            floor_count: property.floor_count,
          },
        },
      });
      
      if (response.error) throw response.error;
      
      const taxData = response.data;
      
      // Save to database
      const fiscalYear = `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;
      const { data, error } = await supabase
        .from("tax_calculations")
        .insert({
          property_id: property.id,
          user_id: user.id,
          fiscal_year: fiscalYear,
          base_tax: taxData.base_tax,
          location_factor: taxData.location_factor,
          property_type_factor: taxData.property_type_factor,
          age_depreciation: taxData.age_depreciation,
          total_tax: taxData.total_tax,
          ai_reasoning: taxData.reasoning,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as TaxCalculation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax_calculations"] });
    },
  });
}
