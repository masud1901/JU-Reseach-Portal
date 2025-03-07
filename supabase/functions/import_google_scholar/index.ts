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
    // Get the request body
    const { professorId } = await req.json();

    if (!professorId) {
      throw new Error("Professor ID is required");
    }

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

    // Get the professor's Google Scholar ID
    const { data: professor, error: professorError } = await supabaseClient
      .from("professors")
      .select("google_scholar_id")
      .eq("id", professorId)
      .single();

    if (professorError) {
      throw professorError;
    }

    if (!professor.google_scholar_id) {
      throw new Error("Professor does not have a Google Scholar ID");
    }

    // In a real implementation, we would fetch data from Google Scholar API
    // Since there's no official API, this would typically involve web scraping
    // For this demo, we'll simulate the import with mock data
    const mockPublications = [
      {
        title: "Advances in Machine Learning for Natural Language Processing",
        authors: ["John Smith", "Jane Doe", "Robert Johnson"],
        journal: "Journal of Artificial Intelligence Research",
        year: 2022,
        citation_count: 45,
        url: "https://example.com/publication1",
      },
      {
        title: "Deep Learning Applications in Computer Vision",
        authors: ["John Smith", "Michael Brown"],
        journal: "IEEE Transactions on Pattern Analysis",
        year: 2021,
        citation_count: 78,
        url: "https://example.com/publication2",
      },
      {
        title: "Reinforcement Learning: A Survey",
        authors: ["John Smith", "Sarah Wilson", "David Lee"],
        journal: "Machine Learning Journal",
        year: 2020,
        citation_count: 120,
        url: "https://example.com/publication3",
      },
    ];

    // Insert the publications into the database
    for (const pub of mockPublications) {
      const { error: insertError } = await supabaseClient
        .from("publications")
        .insert({
          professor_id: professorId,
          title: pub.title,
          authors: pub.authors,
          journal: pub.journal,
          year: pub.year,
          citation_count: pub.citation_count,
          url: pub.url,
        });

      if (insertError) {
        throw insertError;
      }
    }

    // After importing publications, update the professor's ranking points
    // Call the update_professor_rankings function
    const updateRankingsResponse = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/functions/v1/update_professor_rankings`,
      {
        method: "POST",
        headers: {
          Authorization: req.headers.get("Authorization")!,
          "Content-Type": "application/json",
        },
      },
    );

    if (!updateRankingsResponse.ok) {
      throw new Error("Failed to update professor rankings");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Publications imported successfully",
        count: mockPublications.length,
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
