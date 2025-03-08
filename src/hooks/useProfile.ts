import { useState, useEffect } from "react";
import { supabase } from "../../supabase/supabase";
import { UnifiedProfile } from "@/types/profile";

export function useProfile(
  id: string | undefined,
  type: "professors" | "students",
) {
  const [profile, setProfile] = useState<UnifiedProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [publications, setPublications] = useState<any[]>([]);
  const [loadingPublications, setLoadingPublications] = useState(true);
  const [department, setDepartment] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [publicationCount, setPublicationCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    if (id && (type === "professors" || type === "students")) {
      fetchProfile();
    }
  }, [id, type]);

  async function fetchProfile() {
    try {
      setLoading(true);
      setLoadingPublications(true);
      setError(null);

      // Determine if we're fetching a professor or student
      const profileType = type === "professors" ? "professor" : "student";

      // Try using the edge function first
      try {
        const { data: edgeData, error: edgeError } =
          await supabase.functions.invoke("get_profile_data", {
            body: { profileId: id, profileType },
          });

        if (!edgeError && edgeData && edgeData.success) {
          // Set department
          setDepartment(edgeData.department || "");

          // Transform the data to a unified profile format
          const profileData: UnifiedProfile = {
            ...edgeData.profile,
            department: edgeData.department || "",
            profileType: profileType as "professor" | "student",
            user_id: edgeData.profile.user_id || "",
          };

          setProfile(profileData);

          // Set publications and count
          setPublications(edgeData.publications || []);
          setPublicationCount(edgeData.publicationCount || 0);
          setLoadingPublications(false);
          return;
        }
      } catch (edgeError) {
        console.error(
          "Edge function error, falling back to direct query:",
          edgeError,
        );
      }

      // Fallback to direct query if edge function fails
      const tableName = type === "professors" ? "professors" : "students";

      // Direct query without joins
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Fetch department separately
        if (data.department_id) {
          const { data: deptData, error: deptError } = await supabase
            .from("departments")
            .select("name")
            .eq("id", data.department_id)
            .single();

          if (!deptError && deptData) {
            setDepartment(deptData.name);
          }
        }

        // Transform the data to a unified profile format
        const profileData: UnifiedProfile = {
          ...data,
          department: department || "",
          profileType: profileType as "professor" | "student",
          user_id: data.user_id || "",
        };

        setProfile(profileData);

        // Fetch publications
        await fetchPublications(profileData);
      } else {
        throw new Error("No data returned from Supabase");
      }
    } catch (error: any) {
      setError(error.message || "Failed to fetch profile");
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPublications(profileData: UnifiedProfile) {
    try {
      setLoadingPublications(true);
      // No pagination for profile view - fetch all publications

      if (profileData.profileType === "professor") {
        // Get all publications for professor
        const { data, error } = await supabase.rpc(
          "get_professor_publications",
          {
            p_id: id,
          },
        );

        if (error) throw error;
        setPublications(data || []);

        // If RPC fails or returns no data, fallback to direct query
        if (!data || data.length === 0) {
          const { data: fallbackData, error: fallbackError } = await supabase
            .from("publications")
            .select("*")
            .order("publication_year", { ascending: false });

          if (fallbackError) throw fallbackError;
          setPublications(fallbackData || []);
        }
      } else if (profileData.profileType === "student") {
        // Get all publications for student
        const { data, error } = await supabase.rpc("get_student_publications", {
          s_id: id,
        });

        if (error) throw error;
        setPublications(data || []);

        // If RPC fails, fallback to empty publications
        if (!data || data.length === 0) {
          setPublications([]);
        }
      }
    } catch (error) {
      console.error("Error fetching publications:", error);
    } finally {
      setLoadingPublications(false);
    }
  }

  // No pagination needed for profile view

  return {
    profile,
    loading,
    publications,
    loadingPublications,
    department,
    error,
    refetch: fetchProfile,
  };
}
