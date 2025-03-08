import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, CheckCircle2, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../supabase/supabase";

// Define a unified profile type
interface UnifiedProfile {
  id: string;
  user_id: string | null;
  name: string;
  department: string;
  department_id?: string;
  bio?: string;
  research_interests?: string[];
  badge?: string;
  is_verified?: boolean;
  ranking_points?: number;
  seeking_students?: boolean;
  google_scholar_id?: string;
  verification_badge_type?: string;
  profileType: 'professor' | 'student';
}

export default function FallbackProfileDetail() {
  // Extract the ID from the URL
  const { id } = useParams<{ id: string }>();
  // Determine the profile type from the URL path
  const type = window.location.pathname.includes('/professors/') ? 'professors' : 'students';
  
  console.log("FallbackProfileDetail mounted with:", { id, type, path: window.location.pathname });
  
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UnifiedProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [publications, setPublications] = useState<any[]>([]);
  const [loadingPublications, setLoadingPublications] = useState(true);
  const [department, setDepartment] = useState<string>("");

  useEffect(() => {
    console.log("useEffect triggered with id:", id, "type:", type);
    if (id && (type === 'professors' || type === 'students')) {
      fetchProfile();
    }
  }, [id, type]);

  async function fetchProfile() {
    try {
      setLoading(true);
      
      // Determine if we're fetching a professor or student
      const tableName = type === 'professors' ? 'professors' : 'students';
      const profileType = type === 'professors' ? 'professor' : 'student';
      
      console.log(`Fetching ${profileType} with ID: ${id} from table: ${tableName}`);
      
      // Direct query without joins
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("id", id)
        .single();

      console.log("Supabase response:", { data, error });

      if (error) {
        console.error("Error fetching profile:", error);
        return;
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
          profileType: profileType as 'professor' | 'student',
          user_id: data.user_id || ""
        };
        
        console.log("Setting profile data:", profileData);
        setProfile(profileData);
        
        // Fetch publications
        fetchPublications(profileData);
      } else {
        console.error("No data returned from Supabase");
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPublications(profileData: UnifiedProfile) {
    try {
      setLoadingPublications(true);
      
      console.log("Fetching publications for", profileData.profileType, "with ID:", id);
      
      if (profileData.profileType === 'professor') {
        // Try to get all publications and filter by name
        const { data, error } = await supabase
          .from("publications")
          .select("*")
          .order("publication_year", { ascending: false });
          
        if (error) {
          console.error("Error fetching publications:", error);
          return;
        }
        
        // Filter by professor name if available
        const filteredData = profileData.name 
          ? data.filter(pub => 
              pub.authors && pub.authors.toLowerCase().includes(profileData.name.toLowerCase())
            )
          : data;
        
        console.log("Filtered publications:", filteredData);
        setPublications(filteredData);
      } else {
        // For students, just show empty publications for now
        setPublications([]);
      }
    } catch (error) {
      console.error("Error fetching publications:", error);
    } finally {
      setLoadingPublications(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Skeleton className="h-24 w-24 rounded-full mb-4" />
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-32 mb-4" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
        <p>The profile you're looking for doesn't exist.</p>
      </div>
    );
  }

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4 border-2 border-primary/10">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`}
                    alt={profile.name}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  {profile.is_verified && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </div>

                <p className="text-muted-foreground mb-4">
                  {department || "Department not available"}
                </p>

                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {profile.profileType === 'professor' && profile.ranking_points !== undefined && (
                    <Badge variant="outline" className="font-semibold">
                      {profile.ranking_points} points
                    </Badge>
                  )}
                  
                  {profile.profileType === 'professor' && profile.seeking_students && (
                    <Badge variant="secondary">Seeking Students</Badge>
                  )}
                  
                  {profile.profileType === 'student' && profile.badge && (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border border-amber-300">
                      <Award className="h-3 w-3 mr-1" />
                      {profile.badge}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Bio Section */}
              {profile.bio && (
                <div className="mt-6">
                  <h2 className="font-semibold mb-2">About</h2>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {profile.bio}
                  </p>
                </div>
              )}

              {/* Research Interests */}
              {profile.research_interests && profile.research_interests.length > 0 && (
                <div className="mt-6">
                  <h2 className="font-semibold mb-2">Research Interests</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.research_interests.map((interest, index) => (
                      <Badge key={index} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Google Scholar Link */}
              {profile.profileType === 'professor' && profile.google_scholar_id && (
                <div className="mt-6">
                  <h2 className="font-semibold mb-2">External Links</h2>
                  <a
                    href={`https://scholar.google.com/citations?user=${profile.google_scholar_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-blue-600 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Google Scholar Profile
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="publications">
            <TabsList className="mb-6">
              <TabsTrigger value="publications">Publications</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
            </TabsList>

            {/* Publications Tab */}
            <TabsContent value="publications">
              <Card>
                <CardHeader>
                  <CardTitle>Publications</CardTitle>
                  <CardDescription>
                    {profile.profileType === 'professor' 
                      ? 'Research publications authored by this professor' 
                      : 'Research publications this student has contributed to'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingPublications ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="border-b pb-4">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2 mb-2" />
                          <Skeleton className="h-4 w-1/4" />
                        </div>
                      ))}
                    </div>
                  ) : publications.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No publications found</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {publications.map((pub, index) => (
                        <div key={pub.id || `pub-${index}`} className="border-b pb-6 last:border-0">
                          <h3 className="font-medium">{pub.title || 'Untitled Publication'}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {pub.journal_name || pub.publisher || 'Unknown Publisher'}, {pub.publication_year || 'N/A'}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {pub.citation_count || 0} citations
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {pub.publication_type || "Research Article"}
                            </Badge>
                          </div>
                          {pub.url && (
                            <a
                              href={pub.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-xs text-blue-600 hover:underline mt-2"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View Publication
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Connections Tab */}
            <TabsContent value="connections">
              <Card>
                <CardHeader>
                  <CardTitle>Connections</CardTitle>
                  <CardDescription>
                    {profile.profileType === 'professor' 
                      ? 'Students and colleagues connected with this professor' 
                      : 'Professors and peers connected with this student'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No connections found</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 