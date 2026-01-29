import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface PropertyData {
  property_type: string;
  area_sqft: number;
  built_up_area_sqft?: number;
  property_value: number;
  city: string;
  construction_year?: number;
  floor_count?: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { property } = await req.json() as { property: PropertyData };
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const currentYear = new Date().getFullYear();
    const propertyAge = property.construction_year 
      ? currentYear - property.construction_year 
      : 0;

    const systemPrompt = `You are an expert property tax calculator for Indian municipalities, specifically for Rajasthan state. 
    
You calculate property tax based on:
1. Unit Area Value (UAV) method used in Rajasthan
2. Property type factors: Residential (1.0), Commercial (1.5), Industrial (1.3), Agricultural (0.5), Mixed Use (1.2)
3. Location factors for cities: Jaipur (1.2), Jodhpur (1.0), Udaipur (1.1), Other (0.8)
4. Age depreciation: Properties older than 10 years get 10% reduction, 20+ years get 20% reduction
5. Base rate: ₹5 per sq.ft for residential, ₹8 for commercial

Return your response as a valid JSON object with these exact fields:
{
  "base_tax": <number - base tax amount in INR>,
  "location_factor": <number - multiplier based on city>,
  "property_type_factor": <number - multiplier based on property type>,
  "age_depreciation": <number - percentage reduction for old properties>,
  "total_tax": <number - final calculated tax in INR>,
  "reasoning": "<string - brief explanation of calculation>"
}`;

    const userPrompt = `Calculate property tax for:
- Property Type: ${property.property_type}
- Total Area: ${property.area_sqft} sq.ft
- Built-up Area: ${property.built_up_area_sqft || property.area_sqft} sq.ft
- Property Value: ₹${property.property_value.toLocaleString('en-IN')}
- City: ${property.city}, Rajasthan
- Construction Year: ${property.construction_year || 'Unknown'}
- Property Age: ${propertyAge} years
- Number of Floors: ${property.floor_count || 1}

Calculate the annual property tax using UAV method and return the JSON response.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response from AI
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse AI response");
    }

    const taxCalculation = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(taxCalculation), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("calculate-tax error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
