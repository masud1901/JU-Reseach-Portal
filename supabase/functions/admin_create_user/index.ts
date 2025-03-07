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
    const { email, password, fullName, userType, department, department_id } =
      await req.json();

    if (
      !email ||
      !password ||
      !fullName ||
      !userType ||
      !department ||
      !department_id
    ) {
      throw new Error("Missing required fields");
    }

    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if the request is from an admin
    const authHeader = req.headers.get("Authorization")?.split(" ")[1] || "";
    const {
      data: { user: adminUser },
      error: authError,
    } = await supabase.auth.getUser(authHeader);

    if (authError || !adminUser) {
      throw new Error("Unauthorized");
    }

    // Check if the user is an admin
    const { data: adminData, error: adminCheckError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", adminUser.email)
      .single();

    if (adminCheckError || !adminData) {
      throw new Error("Unauthorized - Admin access required");
    }

    // Create the user in Auth
    const { data: userData, error: userError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      });

    if (userError) {
      throw userError;
    }

    if (!userData.user) {
      throw new Error("Failed to create user");
    }

    // Create the profile based on user type
    if (userType === "professor") {
      const { error: profileError } = await supabase.from("professors").insert([
        {
          user_id: userData.user.id,
          name: fullName,
          department_id,
          research_interests: [],
          is_verified: true,
          ranking_points: 0,
        },
      ]);

      if (profileError) {
        throw profileError;
      }
    } else if (userType === "student") {
      const { error: profileError } = await supabase.from("students").insert([
        {
          user_id: userData.user.id,
          name: fullName,
          department_id,
          research_interests: [],
        },
      ]);

      if (profileError) {
        throw profileError;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully created ${userType} account for ${email}`,
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
