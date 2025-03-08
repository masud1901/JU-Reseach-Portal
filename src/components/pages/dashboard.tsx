import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge-dark";
import { Button } from "@/components/ui/button-dark";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card-dark";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, BookOpen, CheckCircle2, FileText, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";
import ResearchInterestMatches from "../profiles/ResearchInterestMatches";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [professorProfile, setProfessorProfile] = useState<any>(null);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [recentPublications, setRecentPublications] = useState<any[]>([]);
  const [connectionRequests, setConnectionRequests] = useState<any[]>([]);
  const [stats, setStats] = useState({
    publicationCount: 0,
    citationCount: 0,
    connectionCount: 0,
  });

  useEffect(() => {
    if (user) {
      fetchUserProfiles();
    } else {
      setLoading(false);
    }
  }, [user]);

  async function fetchUserProfiles() {
    try {
      setLoading(true);

      // Check for professor profile
      const { data: professorData, error: professorError } = await supabase
        .from("professors")
        .select("*, departments(name)")
        .eq("user_id", user.id)
        .single();

      if (!professorError) {
        setProfessorProfile({
          ...professorData,
          department: professorData.departments?.name || "",
        });
        await fetchProfessorData(professorData.id);
      }

      // Check for student profile
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("*, departments(name)")
        .eq("user_id", user.id)
        .single();

      if (!studentError) {
        setStudentProfile({
          ...studentData,
          department: studentData.departments?.name || "",
        });
        await fetchStudentData(studentData.id);
      }

      // Fetch connection requests
      const { data: requestsData, error: requestsError } = await supabase
        .from("connection_requests")
        .select("*")
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (!requestsError && requestsData) {
        setConnectionRequests(requestsData);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProfessorData(professorId: string) {
    try {
      // Try to fetch publications using RPC function first
      const { data: rpcData, error: rpcError } = await supabase.rpc(
        "get_professor_publications",
        { p_id: professorId },
      );

      if (!rpcError && rpcData && rpcData.length > 0) {
        setRecentPublications(rpcData.slice(0, 5));

        // Calculate stats
        const citationCount = rpcData.reduce(
          (sum, pub) => sum + (pub.citation_count || 0),
          0,
        );

        setStats({
          publicationCount: rpcData.length,
          citationCount,
          connectionCount: 0, // Will be updated later
        });
      } else {
        // Fallback to publication_authors table
        const { data: authorData, error: authorError } = await supabase
          .from("publication_authors")
          .select("publications(*)")
          .eq("professor_id", professorId)
          .order("publications.publication_year", { ascending: false })
          .limit(5);

        if (!authorError && authorData && authorData.length > 0) {
          const publications = authorData
            .map((item) => item.publications)
            .filter(Boolean);

          setRecentPublications(publications);

          // Get all publications for stats
          const { data: allAuthorData, error: allAuthorError } = await supabase
            .from("publication_authors")
            .select("publications(citation_count)")
            .eq("professor_id", professorId);

          if (!allAuthorError && allAuthorData) {
            const allPubs = allAuthorData
              .map((item) => item.publications)
              .filter(Boolean);

            const citationCount = allPubs.reduce(
              (sum, pub) => sum + (pub.citation_count || 0),
              0,
            );

            setStats({
              publicationCount: allPubs.length,
              citationCount,
              connectionCount: 0, // Will be updated later
            });
          }
        } else {
          // Legacy approach as last resort
          const { data: publicationsData, error: publicationsError } =
            await supabase
              .from("publications")
              .select("*")
              .eq("professor_id", professorId)
              .order("publication_year", { ascending: false })
              .limit(5);

          if (!publicationsError && publicationsData) {
            setRecentPublications(publicationsData);

            // Calculate stats
            const { data: allPubs, error: allPubsError } = await supabase
              .from("publications")
              .select("citation_count")
              .eq("professor_id", professorId);

            if (!allPubsError && allPubs) {
              const citationCount = allPubs.reduce(
                (sum, pub) => sum + (pub.citation_count || 0),
                0,
              );

              setStats({
                publicationCount: allPubs.length,
                citationCount,
                connectionCount: 0, // Will be updated later
              });
            }
          }
        }
      }

      // Fetch connection count
      const { count, error: connError } = await supabase
        .from("connection_requests")
        .select("*", { count: "exact", head: true })
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .eq("status", "accepted");

      if (!connError) {
        setStats((prev) => ({
          ...prev,
          connectionCount: count || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching professor data:", error);
    }
  }

  async function fetchStudentData(studentId: string) {
    try {
      // Try to fetch publications using RPC function first
      const { data: rpcData, error: rpcError } = await supabase.rpc(
        "get_student_publications",
        { s_id: studentId },
      );

      if (!rpcError && rpcData && rpcData.length > 0) {
        setRecentPublications(rpcData.slice(0, 5));

        // Calculate stats
        const citationCount = rpcData.reduce(
          (sum, pub) => sum + (pub.citation_count || 0),
          0,
        );

        setStats({
          publicationCount: rpcData.length,
          citationCount,
          connectionCount: 0, // Will be updated later
        });
      } else {
        // Fallback to publication_authors table
        const { data: authorData, error: authorError } = await supabase
          .from("publication_authors")
          .select("publications(*)")
          .eq("student_id", studentId);

        if (!authorError && authorData && authorData.length > 0) {
          const publications = authorData
            .map((item) => item.publications)
            .filter(Boolean);

          setRecentPublications(publications.slice(0, 5));

          // Calculate stats
          const citationCount = publications.reduce(
            (sum, pub) => sum + (pub.citation_count || 0),
            0,
          );

          setStats({
            publicationCount: publications.length,
            citationCount,
            connectionCount: 0, // Will be updated later
          });
        } else {
          // Legacy approach as last resort
          const { data: directData, error: directError } = await supabase
            .from("publications")
            .select("*")
            .eq("student_id", studentId)
            .order("publication_year", { ascending: false })
            .limit(5);

          if (!directError && directData && directData.length > 0) {
            setRecentPublications(directData);

            // Calculate stats
            const citationCount = directData.reduce(
              (sum, pub) => sum + (pub.citation_count || 0),
              0,
            );

            setStats({
              publicationCount: directData.length,
              citationCount,
              connectionCount: 0, // Will be updated later
            });
          } else {
            setRecentPublications([]);
            setStats({
              publicationCount: 0,
              citationCount: 0,
              connectionCount: 0,
            });
          }
        }
      }

      // Fetch connection count
      const { count, error: connError } = await supabase
        .from("connection_requests")
        .select("*", { count: "exact", head: true })
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .eq("status", "accepted");

      if (!connError) {
        setStats((prev) => ({
          ...prev,
          connectionCount: count || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
        <p className="mb-6">Please log in to view your dashboard.</p>
        <Button onClick={() => navigate("/login")}>Log In</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!professorProfile && !studentProfile) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">
          Welcome to JU Research Portal
        </h1>

        <div className="bg-muted/30 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Create Your Profile</h2>
          <p className="mb-6">
            You don't have a profile yet. Create a profile to connect with
            researchers and students.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Professor Profile</CardTitle>
                <CardDescription>
                  For faculty members and researchers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create a professor profile to showcase your research, connect
                  with students, and collaborate with other researchers.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => navigate("/create-professor-profile")}
                  className="w-full"
                >
                  Create Professor Profile
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Profile</CardTitle>
                <CardDescription>
                  For students and research assistants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create a student profile to find research mentors, showcase
                  your interests, and connect with professors.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => navigate("/create-student-profile")}
                  className="w-full"
                >
                  Create Student Profile
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Tabs defaultValue={professorProfile ? "professor" : "student"}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <TabsList>
            {professorProfile && (
              <TabsTrigger value="professor">Professor View</TabsTrigger>
            )}
            {studentProfile && (
              <TabsTrigger value="student">Student View</TabsTrigger>
            )}
          </TabsList>
        </div>

        {professorProfile && (
          <TabsContent value="professor" className="space-y-8">
            {/* Professor Profile Summary */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/10">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${professorProfile.name}`}
                      />
                      <AvatarFallback>
                        {professorProfile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle>{professorProfile.name}</CardTitle>
                        {professorProfile.is_verified && (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <CardDescription>
                        {professorProfile.department}
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="font-semibold">
                          {professorProfile.ranking_points || 0} points
                        </Badge>
                        {professorProfile.seeking_students && (
                          <Badge variant="secondary">Seeking Students</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(`/professors/${professorProfile.id}`)
                    }
                  >
                    View Profile
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-muted/30 p-4 rounded-lg flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Publications
                      </p>
                      <p className="text-2xl font-bold">
                        {stats.publicationCount}
                      </p>
                    </div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Citations</p>
                      <p className="text-2xl font-bold">
                        {stats.citationCount}
                      </p>
                    </div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Connections
                      </p>
                      <p className="text-2xl font-bold">
                        {stats.connectionCount}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Research Matches */}
            {professorProfile && (
              <ResearchInterestMatches professorId={professorProfile.id} />
            )}

            {/* Recent Publications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Publications</CardTitle>
                <CardDescription>
                  Your most recent research publications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentPublications.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No publications yet</p>
                    <Button
                      variant="link"
                      onClick={() =>
                        navigate(`/professors/${professorProfile.id}`)
                      }
                      className="mt-2"
                    >
                      Add publications to your profile
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentPublications.map((pub) => (
                      <div key={pub.id} className="border-b pb-4 last:border-0">
                        <h3 className="font-medium">{pub.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {pub.journal_name || pub.publisher},{" "}
                          {pub.publication_year}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {pub.citation_count || 0} citations
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {pub.publication_type || "Research Article"}
                          </Badge>
                        </div>
                      </div>
                    ))}

                    {recentPublications.length > 0 && (
                      <Button
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() =>
                          navigate(`/professors/${professorProfile.id}`)
                        }
                      >
                        View All Publications
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Connection Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Connection Requests</CardTitle>
                <CardDescription>
                  Pending requests from students
                </CardDescription>
              </CardHeader>
              <CardContent>
                {connectionRequests.filter((req) => req.to_user_id === user.id)
                  .length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      No pending connection requests
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {connectionRequests
                      .filter((req) => req.to_user_id === user.id)
                      .map((request) => (
                        <div
                          key={request.id}
                          className="flex items-center justify-between border-b pb-4 last:border-0"
                        >
                          <div>
                            <p className="font-medium">
                              New connection request
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {request.message || "No message provided"}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate("/connections")}
                          >
                            Review
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/connections")}
                >
                  Manage Connections
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}

        {studentProfile && (
          <TabsContent value="student" className="space-y-8">
            {/* Student Profile Summary */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/10">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${studentProfile.name}`}
                      />
                      <AvatarFallback>
                        {studentProfile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{studentProfile.name}</CardTitle>
                      <CardDescription>
                        {studentProfile.department}
                      </CardDescription>
                      {studentProfile.badge && (
                        <div className="mt-1">
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border border-amber-300">
                            <Award className="h-3 w-3 mr-1" />
                            {studentProfile.badge}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/students/${studentProfile.id}`)}
                  >
                    View Profile
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-muted/30 p-4 rounded-lg flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Publications
                      </p>
                      <p className="text-2xl font-bold">
                        {stats.publicationCount}
                      </p>
                    </div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Citations</p>
                      <p className="text-2xl font-bold">
                        {stats.citationCount}
                      </p>
                    </div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Connections
                      </p>
                      <p className="text-2xl font-bold">
                        {stats.connectionCount}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Research Matches */}
            {studentProfile && (
              <ResearchInterestMatches studentId={studentProfile.id} />
            )}

            {/* Publications */}
            <Card>
              <CardHeader>
                <CardTitle>Your Publications</CardTitle>
                <CardDescription>
                  Research you've contributed to
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentPublications.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No publications yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect with professors to collaborate on research
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentPublications.map((pub) => (
                      <div key={pub.id} className="border-b pb-4 last:border-0">
                        <h3 className="font-medium">{pub.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {pub.journal_name || pub.publisher},{" "}
                          {pub.publication_year}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {pub.citation_count || 0} citations
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {pub.publication_type || "Research Article"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Connection Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Connection Status</CardTitle>
                <CardDescription>
                  Your connection requests to professors
                </CardDescription>
              </CardHeader>
              <CardContent>
                {connectionRequests.filter(
                  (req) => req.from_user_id === user.id,
                ).length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      No pending connection requests
                    </p>
                    <Button
                      variant="link"
                      onClick={() => navigate("/professors")}
                      className="mt-2"
                    >
                      Find professors to connect with
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {connectionRequests
                      .filter((req) => req.from_user_id === user.id)
                      .map((request) => (
                        <div
                          key={request.id}
                          className="flex items-center justify-between border-b pb-4 last:border-0"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">
                                Connection request pending
                              </p>
                              <Badge variant="outline" className="text-xs">
                                Pending
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {request.message || "No message provided"}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate("/connections")}
                          >
                            Check Status
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/connections")}
                >
                  Manage Connections
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Dashboard;
