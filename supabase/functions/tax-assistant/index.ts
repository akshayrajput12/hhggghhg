import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface TaxQuery {
  question: string;
  properties?: Array<{
    property_name: string;
    property_type: string;
    area_sqft: number;
    property_value: number;
    city: string;
  }>;
  taxCalculations?: Array<{
    fiscal_year: string;
    total_tax: number;
    payment_status: string;
  }>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, properties, taxCalculations } = await req.json() as TaxQuery;
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are STMS AI Assistant, an expert on Indian property tax laws, specifically for Rajasthan state. You help citizens understand:
- Property tax calculation methods (Unit Area Value)
- Tax exemptions and rebates
- Payment deadlines and penalties
- Required documents for property registration
- Appeal procedures
- Government schemes for tax relief

Be helpful, concise, and provide actionable advice. If the user has property data, reference it in your answers.`;

    let contextInfo = "";
    if (properties && properties.length > 0) {
      contextInfo += "\n\nUser's Properties:\n";
      properties.forEach((p, i) => {
        contextInfo += `${i + 1}. ${p.property_name} - ${p.property_type}, ${p.area_sqft} sq.ft, ₹${p.property_value.toLocaleString('en-IN')}, ${p.city}\n`;
      });
    }
    if (taxCalculations && taxCalculations.length > 0) {
      contextInfo += "\n\nRecent Tax Calculations:\n";
      taxCalculations.forEach((t, i) => {
        contextInfo += `${i + 1}. FY ${t.fiscal_year}: ₹${t.total_tax.toLocaleString('en-IN')} (${t.payment_status})\n`;
      });
    }

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
          { role: "user", content: question + contextInfo },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("tax-assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
