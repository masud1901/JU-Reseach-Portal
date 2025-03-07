import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge-dark";
import { Button } from "@/components/ui/button-dark";
import { Card, CardContent } from "@/components/ui/card-dark";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Professor, Publication } from "@/types/professor";
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  Mail,
  Trophy,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";
import ImportPublicationsButton from "./ImportPublicationsButton";
import ProfileCompletionIndicator from "../profiles/ProfileCompletionIndicator";
import EditProfileButton from "../profiles/EditProfileButton";
import PublicationEditor from "../publications/PublicationEditor";

export default function ProfessorDetail() {
  const { id } = useParams<{ id: string }>();
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectMessage, setConnectMessage] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProfessor(id);
      fetchPublications(id);
    }
  }, [id]);

  useEffect(() => {
    if (user && professor) {
      setIsOwnProfile(user.id === professor.user_id);
    }
  }, [user, professor]);

  async function fetchProfessor(professorId: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("professors")
        .select("*")
        .eq("id", professorId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setProfessor(data as Professor);
      }
    } catch (error) {
      console.error("Error fetching professor:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPublications(professorId: string) {
    try {
      // Use the RPC function to get professor publications
      const { data, error } = await supabase.rpc("get_professor_publications", {
        p_id: professorId,
      });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        console.log("Professor publications found:", data);
        setPublications(data as Publication[]);
      } else {
        console.log("No publications found for professor ID:", professorId);

        // Fallback to direct query if RPC doesn't return results
        const { data: directData, error: directError } = await supabase
          .from("publications")
          .select("*")
          .eq("professor_id", professorId);

        if (!directError && directData && directData.length > 0) {
          console.log("Found publications through direct query:", directData);
          setPublications(directData as Publication[]);
        } else {
          // Try through publication_authors table
          const { data: authorData, error: authorError } = await supabase
            .from("publication_authors")
            .select("publication_id, publications(*)")
            .eq("professor_id", professorId);

          if (!authorError && authorData && authorData.length > 0) {
            const extractedPubs = authorData
              .map((item) => item.publications)
              .filter(Boolean);
            console.log(
              "Found publications through authors table:",
              extractedPubs,
            );
            setPublications(extractedPubs as Publication[]);
          } else {
            setPublications([]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching publications:", error);
    }
  }

  async function sendConnectionRequest() {
    if (!user || !professor) return;

    try {
      setIsConnecting(true);

      const { error } = await supabase.from("connection_requests").insert({
        from_user_id: user.id,
        to_user_id: professor.user_id,
        message: connectMessage,
        status: "pending",
      });

      if (error) {
        if (error.code === "23505") {
          // Unique violation - connection request already exists
          toast({
            title: "Connection request already sent",
            description:
              "You have already sent a connection request to this professor.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Connection request sent",
          description:
            "Your connection request has been sent to the professor.",
        });
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error sending connection request:", error);
      toast({
        title: "Failed to send connection request",
        description:
          "There was an error sending your connection request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  }

  const [workingWithStudents, setWorkingWithStudents] = useState<any[]>([]);

  useEffect(() => {
    if (professor) {
      fetchWorkingWithStudents();
    }
  }, [professor]);

  async function fetchWorkingWithStudents() {
    try {
      if (!professor || !professor.id) return;

      // Use the RPC function to get professor collaborators
      const { data, error } = await supabase.rpc(
        "get_professor_collaborators",
        { p_id: professor.id },
      );

      if (error) throw error;

      if (data && data.length > 0) {
        console.log("Professor collaborators found:", data);
        // Transform the data to match the expected format
        const students = data.map((student) => ({
          id: student.student_id,
          name: student.student_name,
        }));
        setWorkingWithStudents(students);
      } else {
        console.log("No collaborators found for professor ID:", professor.id);
        setWorkingWithStudents([]);
      }
    } catch (error) {
      console.error("Error fetching collaborating students:", error);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center h-64">
        <p>Loading professor profile...</p>
      </div>
    );
  }

  if (!professor) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Professor Not Found</h2>
        <p>The professor profile you're looking for doesn't exist.</p>
      </div>
    );
  }

  const initials = professor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4 border-2 border-primary/10">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${professor.name}`}
                    alt={professor.name}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold">{professor.name}</h1>
                  {professor.is_verified && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </div>

                <p className="text-muted-foreground mb-4">
                  {professor.department}
                </p>

                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  <span className="font-semibold">
                    {professor.ranking_points} points
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  {professor.badge && (
                    <Badge variant="outline">{professor.badge}</Badge>
                  )}
                  {professor.seeking_students && (
                    <Badge variant="secondary">Seeking Students</Badge>
                  )}
                </div>

                <div className="w-full mb-4">
                  <ProfileCompletionIndicator
                    profile={professor}
                    profileType="professor"
                  />
                </div>

                {isOwnProfile && (
                  <EditProfileButton
                    profileType="professor"
                    profileId={professor.id}
                    onProfileUpdated={() => {
                      fetchProfessor(professor.id);
                      fetchPublications(professor.id);
                      fetchWorkingWithStudents();
                    }}
                  />
                )}

                <div className="space-y-2 mb-6 w-full">
                  {professor.google_scholar_id && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        window.open(
                          `https://scholar.google.com/citations?user=${professor.google_scholar_id}`,
                          "_blank",
                        )
                      }
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Google Scholar Profile
                    </Button>
                  )}

                  {(isOwnProfile || user?.email === "admin@example.com") && (
                    <ImportPublicationsButton
                      professorId={professor.id}
                      onSuccess={() => fetchPublications(professor.id)}
                    />
                  )}

                  {user && !isOwnProfile && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          <Mail className="mr-2 h-4 w-4" />
                          Connect
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Connect with {professor.name}
                          </DialogTitle>
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
                        <DialogFooter>
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
                </div>

                <div className="w-full">
                  <h3 className="text-sm font-medium mb-2 text-left">
                    Research Interests
                  </h3>
                  <div className="flex flex-wrap gap-1 justify-start">
                    {professor.research_interests.map((interest, i) => (
                      <Badge key={i} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                {workingWithStudents.length > 0 && (
                  <div className="w-full mt-6">
                    <h3 className="text-sm font-medium mb-2 text-left">
                      Working With Students
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-start">
                      {workingWithStudents.map((student, i) => (
                        <Link to={`/students/${student.id}`} key={i}>
                          <Avatar
                            className="h-8 w-8 border-2 border-primary/10 hover:border-primary transition-colors cursor-pointer"
                            title={student.name}
                          >
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`}
                              alt={student.name}
                            />
                            <AvatarFallback>{student.name[0]}</AvatarFallback>
                          </Avatar>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="about">
            <TabsList className="mb-4">
              <TabsTrigger value="about">
                <User className="mr-2 h-4 w-4" /> About
              </TabsTrigger>
              <TabsTrigger value="publications">
                <FileText className="mr-2 h-4 w-4" /> Publications
                {publications.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {publications.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Biography</h2>
                  {professor.bio ? (
                    <p className="text-muted-foreground whitespace-pre-line">
                      {professor.bio}
                    </p>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No biography provided.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="publications">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Publications</h2>
                    {isOwnProfile && (
                      <PublicationEditor
                        mode="create"
                        professorId={professor.id}
                        onSuccess={() => {
                          fetchPublications(professor.id);
                          fetchProfessor(professor.id);
                        }}
                        buttonLabel="Add Publication"
                        buttonVariant="outline"
                        buttonSize="sm"
                      />
                    )}
                  </div>
                  {publications.length === 0 ? (
                    <p className="text-muted-foreground italic">
                      No publications found.
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {publications.map((pub) => (
                        <div
                          key={pub.id}
                          className="border-b pb-4 last:border-0"
                        >
                          <h3 className="font-medium">{pub.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {pub.authors.join(", ")}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            {pub.journal_name && (
                              <span className="text-muted-foreground">
                                {pub.journal_name}
                              </span>
                            )}
                            {pub.publication_year && (
                              <span className="text-muted-foreground">
                                {pub.publication_year}
                              </span>
                            )}
                            {pub.citation_count > 0 && (
                              <Badge variant="outline">
                                {pub.citation_count} citations
                              </Badge>
                            )}
                          </div>
                          {pub.url && (
                            <Button
                              variant="link"
                              className="p-0 h-auto mt-2"
                              onClick={() => window.open(pub.url, "_blank")}
                            >
                              View Publication
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </Button>
                          )}
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
