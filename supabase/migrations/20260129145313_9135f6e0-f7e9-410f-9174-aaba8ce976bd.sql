-- Create enum for property types
CREATE TYPE public.property_type AS ENUM ('residential', 'commercial', 'industrial', 'agricultural', 'mixed_use');

-- Create enum for property status
CREATE TYPE public.property_status AS ENUM ('active', 'pending', 'disputed', 'exempt');

-- Create properties table
CREATE TABLE public.properties (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    property_name TEXT NOT NULL,
    property_type property_type NOT NULL DEFAULT 'residential',
    address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Jaipur',
    state TEXT NOT NULL DEFAULT 'Rajasthan',
    pincode TEXT NOT NULL,
    area_sqft NUMERIC(12, 2) NOT NULL,
    built_up_area_sqft NUMERIC(12, 2),
    floor_count INTEGER DEFAULT 1,
    construction_year INTEGER,
    property_value NUMERIC(15, 2) NOT NULL,
    status property_status NOT NULL DEFAULT 'active',
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tax_calculations table
CREATE TABLE public.tax_calculations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    fiscal_year TEXT NOT NULL,
    base_tax NUMERIC(12, 2) NOT NULL,
    location_factor NUMERIC(5, 2) DEFAULT 1.0,
    property_type_factor NUMERIC(5, 2) DEFAULT 1.0,
    age_depreciation NUMERIC(5, 2) DEFAULT 0,
    total_tax NUMERIC(12, 2) NOT NULL,
    ai_reasoning TEXT,
    calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    payment_status TEXT DEFAULT 'pending',
    paid_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_calculations ENABLE ROW LEVEL SECURITY;

-- Properties policies
CREATE POLICY "Users can view their own properties" 
ON public.properties FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own properties" 
ON public.properties FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties" 
ON public.properties FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties" 
ON public.properties FOR DELETE 
USING (auth.uid() = user_id);

-- Tax calculations policies
CREATE POLICY "Users can view their own tax calculations" 
ON public.tax_calculations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tax calculations" 
ON public.tax_calculations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();