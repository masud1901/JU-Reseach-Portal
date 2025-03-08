import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { checkColumnExists, checkTableExists, logTableStructure, sampleTableData } from "@/utils/debugUtils";
import { Award, CheckCircle2, ExternalLink, FileText, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";

// Define a unified profile type
interface UnifiedProfile {
  id: string;
  user_id: string;
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

export default function ProfileDetail() {
  // Extract the ID from the URL
  const { id } = useParams<{ id: string }>();
  // Determine the profile type from the URL path
  const type = window.location.pathname.includes('/professors/') ? 'professors' : 'students';
  
  console.log("ProfileDetail mounted with:", { id, type, path: window.location.pathname });
  
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UnifiedProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectMessage, setConnectMessage] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [publications, setPublications] = useState<any[]>([]);
  const [loadingPublications, setLoadingPublications] = useState(true);
  const [connections, setConnections] = useState<any[]>([]);
  const [loadingConnections, setLoadingConnections] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    console.log("useEffect triggered with id:", id, "type:", type);
    if (id && (type === 'professors' || type === 'students')) {
      fetchProfile();
      
      // Debug database structure
      debugDatabaseStructure();
    }
  }, [id, type]);

  useEffect(() => {
    if (profile && id) {
      fetchPublications();
      fetchConnections();
      fetchResearchInterests();
    }
  }, [profile, id]);

  useEffect(() => {
    if (user && profile) {
      setIsOwner(user.id === profile.user_id);
    }
  }, [user, profile]);

  async function fetchProfile() {
    try {
      setLoading(true);
      
      // Determine if we're fetching a professor or student
      const tableName = type === 'professors' ? 'professors' : 'students';
      const profileType = type === 'professors' ? 'professor' : 'student';
      
      console.log(`Fetching ${profileType} with ID: ${id} from table: ${tableName}`);
      
      // First, try to get the profile with the department name
      let { data, error } = await supabase
        .from(tableName)
        .select("*, departments(name)")
        .eq("id", id)
        .single();

      console.log("Supabase response with departments:", { data, error });

      // If that fails, try without the departments join
      if (error) {
        console.log("Error with departments join, trying without it");
        const { data: basicData, error: basicError } = await supabase
          .from(tableName)
          .select("*")
          .eq("id", id)
          .single();
        
        if (basicError) {
          throw basicError;
        }
        
        data = basicData;
        
        // If we have a department_id, fetch the department name separately
        if (data && data.department_id) {
          const { data: deptData } = await supabase
            .from("departments")
            .select("name")
            .eq("id", data.department_id)
            .single();
          
          if (deptData) {
            data.department = deptData.name;
          }
        }
      }

      if (data) {
        // Transform the data to a unified profile format
        const profileData = {
          ...data,
          department: data.departments?.name || data.department || "",
          profileType: profileType as 'professor' | 'student',
          // Ensure user_id is set even if null in the database
          user_id: data.user_id || ""
        };
        console.log("Setting profile data:", profileData);
        setProfile(profileData);
      } else {
        console.error("No data returned from Supabase");
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPublications() {
    try {
      setLoadingPublications(true);
      
      console.log("Fetching publications for", profile?.profileType, "with ID:", id);
      
      if (profile?.profileType === 'professor') {
        // Fetch publications for professor
        // Try with professor_id first
        const { data, error } = await supabase
          .from("publications")
          .select("*")
          .eq("professor_id", id)
          .order("publication_year", { ascending: false });
          
        if (error) {
          console.error("Error fetching professor publications with professor_id:", error);
          
          // If that fails, try with author_id
          const { data: authorData, error: authorError } = await supabase
            .from("publications")
            .select("*")
            .eq("author_id", id)
            .order("publication_year", { ascending: false });
            
          if (authorError) {
            console.error("Error fetching professor publications with author_id:", authorError);
            
            // If both fail, try getting all publications and filter by name
            const { data: allData, error: allError } = await supabase
              .from("publications")
              .select("*")
              .order("publication_year", { ascending: false });
              
            if (allError) {
              console.error("Error fetching all publications:", allError);
              return;
            }
            
            // Filter publications by professor name if ID-based queries fail
            if (allData && profile?.name) {
              const filteredData = allData.filter(pub => 
                pub.authors && pub.authors.toLowerCase().includes(profile.name.toLowerCase())
              );
              console.log("Filtered publications by name:", filteredData);
              setPublications(filteredData);
            }
            return;
          }
          
          console.log("Professor publications with author_id:", authorData);
          if (authorData) {
            setPublications(authorData);
          }
          return;
        }
        
        console.log("Professor publications with professor_id:", data);
        if (data) {
          setPublications(data);
        }
      } else {
        // Fetch publications for student
        const { data, error } = await supabase
          .from("publication_authors")
          .select("*, publications(*)")
          .eq("student_id", id);
          
        if (error) {
          console.error("Error fetching student publications:", error);
          return;
        }
        
        console.log("Student publication authors:", data);
        
        if (data) {
          const publicationsData = data
            .filter(item => item.publications)
            .map(item => item.publications);
            
          console.log("Student publications:", publicationsData);
          setPublications(publicationsData);
        }
      }
    } catch (error) {
      console.error("Error fetching publications:", error);
    } finally {
      setLoadingPublications(false);
    }
  }

  async function fetchConnections() {
    try {
      setLoadingConnections(true);
      
      if (!profile?.user_id) {
        console.log("No user_id in profile, can't fetch connections");
        // If user_id is missing, we'll show empty connections
        setConnections([]);
        return;
      }
      
      console.log("Fetching connections for user_id:", profile.user_id);
      
      // Get accepted connections
      const { data, error } = await supabase
        .from("connection_requests")
        .select(`
          id, 
          from_user_id, 
          to_user_id,
          professors!professors_user_id_fkey(id, name, department_id, departments(name)),
          professors!professors_user_id_fkey2(id, name, department_id, departments(name)),
          students!students_user_id_fkey(id, name, department_id, departments(name)),
          students!students_user_id_fkey2(id, name, department_id, departments(name))
        `)
        .or(`from_user_id.eq.${profile.user_id},to_user_id.eq.${profile.user_id}`)
        .eq("status", "accepted");
        
      if (error) {
        console.error("Error fetching connections:", error);
        return;
      }
      
      console.log("Connection data:", data);
      
      if (data) {
        // Process connections to get the other party's profile
        const processedConnections = data.map(conn => {
          const isFromUser = conn.from_user_id === profile.user_id;
          const otherUserId = isFromUser ? conn.to_user_id : conn.from_user_id;
          
          // Check if the other user is a professor
          const professorKey = isFromUser ? 'professors!professors_user_id_fkey2' : 'professors!professors_user_id_fkey';
          const studentKey = isFromUser ? 'students!students_user_id_fkey2' : 'students!students_user_id_fkey';
          
          if (conn[professorKey]) {
            return {
              ...conn[professorKey],
              department: conn[professorKey].departments?.name || "",
              profileType: 'professor'
            };
          } else if (conn[studentKey]) {
            return {
              ...conn[studentKey],
              department: conn[studentKey].departments?.name || "",
              profileType: 'student'
            };
          }
          
          return null;
        }).filter(Boolean);
        
        console.log("Processed connections:", processedConnections);
        setConnections(processedConnections);
      }
    } catch (error) {
      console.error("Error fetching connections:", error);
    } finally {
      setLoadingConnections(false);
    }
  }

  async function sendConnectionRequest() {
    if (!user || !profile) return;

    try {
      setIsConnecting(true);

      const { error } = await supabase.from("connection_requests").insert({
        from_user_id: user.id,
        to_user_id: profile.user_id,
        message: connectMessage,
        status: "pending",
      });

      if (error) {
        if (error.code === "23505") {
          // Unique violation - connection request already exists
          toast({
            title: "Connection request already sent",
            description: "You have already sent a connection request to this user.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Connection request sent",
          description: `Your connection request has been sent to ${profile.name}.`,
        });
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error sending connection request:", error);
      toast({
        title: "Failed to send connection request",
        description: "There was an error sending your connection request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  }

  async function importPublications() {
    if (!profile || profile.profileType !== 'professor' || !profile.google_scholar_id) return;
    
    try {
      const { error } = await supabase.functions.invoke('import_google_scholar', {
        body: { professorId: profile.id }
      });
      
      if (error) throw error;
      
      toast({
        title: "Publications imported",
        description: "Your publications have been imported from Google Scholar.",
      });
      
      // Refresh publications
      fetchPublications();
      // Refresh profile to get updated ranking points
      fetchProfile();
      
    } catch (error) {
      console.error("Error importing publications:", error);
      toast({
        title: "Failed to import publications",
        description: "There was an error importing your publications. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function fetchResearchInterests() {
    if (!profile || !id) return;
    
    try {
      console.log("Fetching research interests for", profile.profileType, "with ID:", id);
      
      if (profile.profileType === 'professor') {
        // Fetch professor research interests
        const { data, error } = await supabase
          .from("professor_research_keywords")
          .select("research_keywords(keyword)")
          .eq("professor_id", id);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const interests = data
            .filter(item => item.research_keywords)
            .map(item => item.research_keywords.keyword);
            
          console.log("Professor research interests:", interests);
          
          // Update the profile with the research interests
          setProfile(prev => prev ? {
            ...prev,
            research_interests: interests
          } : null);
        }
      } else {
        // Fetch student research interests
        const { data, error } = await supabase
          .from("student_research_keywords")
          .select("research_keywords(keyword)")
          .eq("student_id", id);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const interests = data
            .filter(item => item.research_keywords)
            .map(item => item.research_keywords.keyword);
            
          console.log("Student research interests:", interests);
          
          // Update the profile with the research interests
          setProfile(prev => prev ? {
            ...prev,
            research_interests: interests
          } : null);
        }
      }
    } catch (error) {
      console.error("Error fetching research interests:", error);
    }
  }

  // Function to debug database structure
  async function debugDatabaseStructure() {
    console.log("Debugging database structure...");
    
    // Check if tables exist
    const professorsExists = await checkTableExists('professors');
    const studentsExists = await checkTableExists('students');
    const publicationsExists = await checkTableExists('publications');
    const publicationAuthorsExists = await checkTableExists('publication_authors');
    
    console.log("Tables exist check:", {
      professors: professorsExists,
      students: studentsExists,
      publications: publicationsExists,
      publication_authors: publicationAuthorsExists
    });
    
    // Check publications table columns
    if (publicationsExists) {
      const professorIdExists = await checkColumnExists('publications', 'professor_id');
      const authorIdExists = await checkColumnExists('publications', 'author_id');
      
      console.log("Publications columns check:", {
        professor_id: professorIdExists,
        author_id: authorIdExists
      });
      
      // Log table structure
      await logTableStructure('publications');
      
      // Sample data
      await sampleTableData('publications');
    }
    
    // Check professors table
    if (professorsExists) {
      await logTableStructure('professors');
      // Don't sample data here to avoid logging sensitive information
    }
    
    // Check students table
    if (studentsExists) {
      await logTableStructure('students');
      // Don't sample data here to avoid logging sensitive information
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
                  {profile.department}
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

                {user && user.id !== profile.user_id && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full mb-6">
                        <Mail className="mr-2 h-4 w-4" />
                        Connect
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Connect with {profile.name}</DialogTitle>
                        <DialogDescription>
                          Send a message to introduce yourself and explain why
                          you'd like to connect.
                        </DialogDescription>
                      </DialogHeader>
                      <Textarea
                        placeholder="Hello, I'm interested in your research on..."
                        value={connectMessage}
                        onChange={(e) => setConnectMessage(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <DialogFooter className="mt-4">
                        <Button
                          onClick={sendConnectionRequest}
                          disabled={isConnecting}
                        >
                          {isConnecting ? "Sending..." : "Send Request"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                {isOwner && profile.profileType === 'professor' && profile.google_scholar_id && (
                  <Button 
                    variant="outline" 
                    className="w-full mb-6"
                    onClick={importPublications}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Import Publications
                  </Button>
                )}
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
                      {publications.map((pub) => (
                        <div key={pub.id || Math.random()} className="border-b pb-6 last:border-0">
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
                  {loadingConnections ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 border-b pb-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div>
                            <Skeleton className="h-5 w-32 mb-1" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : connections.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No connections found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {connections.map((connection) => (
                        <div key={connection.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${connection.name}`} />
                              <AvatarFallback>
                                {connection.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{connection.name}</p>
                              <p className="text-sm text-muted-foreground">{connection.department}</p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/${connection.profileType}s/${connection.id}`)}
                          >
                            View Profile
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 