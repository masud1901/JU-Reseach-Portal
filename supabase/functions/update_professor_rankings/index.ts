import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all professors
    const { data: professors, error: professorsError } = await supabase
      .from("professors")
      .select("id");

    if (professorsError) {
      throw professorsError;
    }

    const currentYear = new Date().getFullYear();
    let updatedCount = 0;

    // Update ranking points for each professor
    for (const professor of professors) {
      // Get all publications for this professor
      const { data: publications, error: pubError } = await supabase
        .from("publications")
        .select("citation_count, year")
        .eq("professor_id", professor.id);

      if (pubError) {
        console.error(
          `Error fetching publications for professor ${professor.id}:`,
          pubError,
        );
        continue;
      }

      // Calculate ranking points
      let rankingPoints = 0;

      publications.forEach((pub) => {
        // Base points for each publication
        let points = 10;

        // Add points for citations
        points += pub.citation_count || 0;

        // Apply recency factor (more recent publications get more weight)
        const yearDiff = currentYear - (pub.year || currentYear);
        const recencyFactor = Math.max(0.5, 1 - yearDiff * 0.1); // Minimum factor of 0.5

        rankingPoints += points * recencyFactor;
      });

      // Update the professor's ranking points
      const { error: updateError } = await supabase
        .from("professors")
        .update({ ranking_points: Math.round(rankingPoints) })
        .eq("id", professor.id);

      if (updateError) {
        console.error(
          `Error updating ranking points for professor ${professor.id}:`,
          updateError,
        );
        continue;
      }

      updatedCount++;
    }

    return new Response(
      JSON.stringify({
        success: true,
        updatedCount,
        message: `Successfully updated ranking points for ${updatedCount} professors.`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
