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
    const { studentId } = await req.json();

    if (!studentId) {
      throw new Error("Student ID is required");
    }

    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the student's publications
    const { data: publications, error: pubError } = await supabase
      .from("publication_authors")
      .select("*, publications(*)")
      .eq("student_id", studentId);

    if (pubError) {
      throw pubError;
    }

    // Calculate total publications and citations
    let totalPublications = publications?.length || 0;
    let totalCitations = 0;
    let hasHighImpactPublication = false;
    let hasRecentPublication = false;
    const currentYear = new Date().getFullYear();

    publications?.forEach((pub) => {
      // Add citations
      totalCitations += pub.publications?.citation_count || 0;
      
      // Check for high impact publications (more than 20 citations)
      if ((pub.publications?.citation_count || 0) > 20) {
        hasHighImpactPublication = true;
      }
      
      // Check for recent publications (within last 2 years)
      const pubYear = pub.publications?.publication_year || 0;
      if (currentYear - pubYear <= 2) {
        hasRecentPublication = true;
      }
    });

    // Determine badge based on research contributions
    let badge = null;

    if (totalPublications >= 10 || totalCitations >= 100) {
      badge = "Distinguished Researcher";
    } else if ((totalPublications >= 5 && totalCitations >= 30) || hasHighImpactPublication) {
      badge = "Research Excellence";
    } else if (totalPublications >= 3 || (totalPublications >= 1 && hasRecentPublication)) {
      badge = "Emerging Researcher";
    } else if (totalPublications >= 1) {
      badge = "Research Contributor";
    }

    // Update the student's badge
    const { error: updateError } = await supabase
      .from("students")
      .update({ badge })
      .eq("id", studentId);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        badge,
        stats: {
          publications: totalPublications,
          citations: totalCitations,
          hasHighImpactPublication,
          hasRecentPublication,
        },
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