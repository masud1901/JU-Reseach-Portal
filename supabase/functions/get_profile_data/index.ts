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
    const { profileId, profileType } = await req.json();

    if (!profileId || !profileType) {
      throw new Error("Missing required parameters: profileId and profileType");
    }

    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Determine the table to query based on profileType
    const tableName = profileType === "professor" ? "professors" : "students";

    // Get the profile data
    const { data: profile, error: profileError } = await supabase
      .from(tableName)
      .select("*, departments(name)")
      .eq("id", profileId)
      .single();

    if (profileError) throw profileError;

    // Get publication count and first page of publications
    let publications = [];
    let publicationCount = 0;
    const pageSize = 5; // Default page size
    const pageNumber = 1; // Default to first page

    if (profileType === "professor") {
      // Get count and paginated publications in parallel
      const countPromise = supabase.rpc("get_professor_publication_count", {
        p_id: profileId,
      });
      const pubPromise = supabase.rpc("get_professor_publications_paginated", {
        p_id: profileId,
        page_number: pageNumber,
        page_size: pageSize,
      });

      const [countResult, pubResult] = await Promise.all([
        countPromise,
        pubPromise,
      ]);

      if (!countResult.error) {
        publicationCount = countResult.data || 0;
      }

      if (!pubResult.error && pubResult.data) {
        publications = pubResult.data;
      }
    } else {
      // Get count and paginated publications in parallel
      const countPromise = supabase.rpc("get_student_publication_count", {
        s_id: profileId,
      });
      const pubPromise = supabase.rpc("get_student_publications_paginated", {
        s_id: profileId,
        page_number: pageNumber,
        page_size: pageSize,
      });

      const [countResult, pubResult] = await Promise.all([
        countPromise,
        pubPromise,
      ]);

      if (!countResult.error) {
        publicationCount = countResult.data || 0;
      }

      if (!pubResult.error && pubResult.data) {
        publications = pubResult.data;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        profile,
        publications,
        publicationCount,
        department: profile.departments?.name || "",
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
