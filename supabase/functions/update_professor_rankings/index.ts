import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    // Get all professors
    const { data: professors, error: professorsError } = await supabaseClient
      .from("professors")
      .select("id");

    if (professorsError) {
      throw professorsError;
    }

    // For each professor, calculate ranking points based on publications
    for (const professor of professors) {
      const { data: publications, error: publicationsError } =
        await supabaseClient
          .from("publications")
          .select("citation_count, year")
          .eq("professor_id", professor.id);

      if (publicationsError) {
        throw publicationsError;
      }

      // Calculate ranking points based on publications and citations
      // Formula: sum of (citation_count * recency_factor)
      // where recency_factor gives more weight to recent publications
      const currentYear = new Date().getFullYear();
      let rankingPoints = 0;

      for (const pub of publications) {
        if (pub.year && pub.citation_count) {
          const yearsAgo = currentYear - pub.year;
          const recencyFactor = Math.max(0.5, 1 - yearsAgo * 0.05); // Publications up to 10 years old get full weight
          rankingPoints += Math.round(pub.citation_count * recencyFactor);
        }
      }

      // Add base points for each publication
      rankingPoints += publications.length * 5;

      // Update professor's ranking points
      const { error: updateError } = await supabaseClient
        .from("professors")
        .update({ ranking_points: rankingPoints })
        .eq("id", professor.id);

      if (updateError) {
        throw updateError;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Professor rankings updated successfully",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
