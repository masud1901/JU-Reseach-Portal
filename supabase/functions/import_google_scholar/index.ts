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
    const { professorId } = await req.json();

    if (!professorId) {
      throw new Error("Professor ID is required");
    }

    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the professor's Google Scholar ID
    const { data: professor, error: professorError } = await supabase
      .from("professors")
      .select("google_scholar_id")
      .eq("id", professorId)
      .single();

    if (professorError) {
      throw professorError;
    }

    if (!professor?.google_scholar_id) {
      throw new Error("Professor does not have a Google Scholar ID");
    }

    // In a real implementation, you would fetch publications from Google Scholar API
    // For this demo, we'll create some sample publications
    const samplePublications = [
      {
        professor_id: professorId,
        title:
          "Recent Advances in Machine Learning for Natural Language Processing",
        authors: ["Author Name", "Co-author Name"],
        journal: "Journal of Artificial Intelligence Research",
        year: 2023,
        citation_count: Math.floor(Math.random() * 50) + 1,
        url: "https://example.com/publication1",
      },
      {
        professor_id: professorId,
        title:
          "A Novel Approach to Computer Vision in Low-Resource Environments",
        authors: ["Author Name", "Another Co-author"],
        journal: "IEEE Transactions on Pattern Analysis",
        year: 2022,
        citation_count: Math.floor(Math.random() * 30) + 1,
        url: "https://example.com/publication2",
      },
      {
        professor_id: professorId,
        title: "Implementing Deep Learning Models for Environmental Monitoring",
        authors: ["Author Name", "Third Co-author"],
        journal: "Environmental Data Science",
        year: 2021,
        citation_count: Math.floor(Math.random() * 20) + 1,
        url: "https://example.com/publication3",
      },
    ];

    // Insert the publications
    const { data: insertedData, error: insertError } = await supabase
      .from("publications")
      .insert(samplePublications)
      .select();

    if (insertError) {
      throw insertError;
    }

    // Update the professor's ranking points based on publications
    const { data: publicationsData, error: pubCountError } = await supabase
      .from("publications")
      .select("citation_count, year")
      .eq("professor_id", professorId);

    if (pubCountError) {
      throw pubCountError;
    }

    // Calculate ranking points based on publications and citations
    let rankingPoints = 0;
    const currentYear = new Date().getFullYear();

    publicationsData.forEach((pub) => {
      // Base points for each publication
      let points = 10;

      // Add points for citations
      points += pub.citation_count;

      // Apply recency factor (more recent publications get more weight)
      const yearDiff = currentYear - (pub.year || currentYear);
      const recencyFactor = Math.max(0.5, 1 - yearDiff * 0.1); // Minimum factor of 0.5

      rankingPoints += points * recencyFactor;
    });

    // Update the professor's ranking points
    const { error: updateError } = await supabase
      .from("professors")
      .update({ ranking_points: Math.round(rankingPoints) })
      .eq("id", professorId);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        count: samplePublications.length,
        message: `Successfully imported ${samplePublications.length} publications and updated ranking points.`,
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
