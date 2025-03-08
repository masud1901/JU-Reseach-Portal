import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Student } from "@/types/professor";
import { ExternalLink, FileText, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectMessage, setConnectMessage] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [publications, setPublications] = useState<any[]>([]);
  const [loadingPublications, setLoadingPublications] = useState(true);
  const [workingWithProfessors, setWorkingWithProfessors] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchStudent(id);
    }
  }, [id]);

  useEffect(() => {
    if (student && id) {
      fetchStudentPublications();
      fetchWorkingWithProfessors();
    }
  }, [student, id]);

  async function fetchStudent(studentId: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", studentId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setStudent(data as Student);
      }
    } catch (error) {
      console.error("Error fetching student:", error);
    } finally {
      setLoading(false);
    }
  }

  async function sendConnectionRequest() {
    if (!user || !student) return;

    try {
      setIsConnecting(true);

      const { error } = await supabase.from("connection_requests").insert({
        from_user_id: user.id,
        to_user_id: student.user_id,
        message: connectMessage,
        status: "pending",
      });

      if (error) {
        if (error.code === "23505") {
          // Unique violation - connection request already exists
          toast({
            title: "Connection request already sent",
            description:
              "You have already sent a connection request to this student.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Connection request sent",
          description: "Your connection request has been sent to the student.",
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

  async function fetchStudentPublications() {
    try {
      setLoadingPublications(true);
      const { data, error } = await supabase
        .from("publication_authors")
        .select("*, publications(*)")
        .eq("student_id", id);

      if (error) throw error;

      if (data) {
        const publicationsData = data.map((item) => item.publications);
        setPublications(publicationsData);
      }
    } catch (error) {
      console.error("Error fetching student publications:", error);
    } finally {
      setLoadingPublications(false);
    }
  }

  async function fetchWorkingWithProfessors() {
    try {
      // Find publications where this student is an author
      const { data: pubData, error: pubError } = await supabase
        .from("publication_authors")
        .select("publication_id")
        .eq("student_id", id);

      if (pubError) throw pubError;

      if (pubData && pubData.length > 0) {
        const publicationIds = pubData.map((p) => p.publication_id);

        // Find professors who are also authors on these publications
        const { data: profData, error: profError } = await supabase
          .from("publication_authors")
          .select("professor_id, professors(id, name)")
          .in("publication_id", publicationIds)
          .not("professor_id", "is", null);

        if (profError) throw profError;

        if (profData) {
          // Extract unique professors
          const uniqueProfessors = Array.from(
            new Set(
              profData
                .filter((item) => item.professor_id && item.professors)
                .map((item) => JSON.stringify(item.professors)),
            ),
          ).map((str) => JSON.parse(str));

          setWorkingWithProfessors(uniqueProfessors);
        }
      }
    } catch (error) {
      console.error("Error fetching collaborating professors:", error);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center h-64">
        <p>Loading student profile...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Student Not Found</h2>
        <p>The student profile you're looking for doesn't exist.</p>
      </div>
    );
  }

  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4 border-2 border-primary/10">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`}
                    alt={student.name}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold">{student.name}</h1>
                </div>

                <p className="text-muted-foreground mb-4">
                  {student.department}
                </p>

                {student.badge && (
                  <Badge className="mb-6">{student.badge}</Badge>
                )}

                {user && user.id !== student.user_id && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full mb-6">
                        <Mail className="mr-2 h-4 w-4" />
                        Connect
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Connect with {student.name}</DialogTitle>
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

                <div className="w-full">
                  <h3 className="text-sm font-medium mb-2 text-left">
                    Research Interests
                  </h3>
                  <div className="flex flex-wrap gap-1 justify-start">
                    {student.research_interests.map((interest, i) => (
                      <Badge key={i} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                {workingWithProfessors.length > 0 && (
                  <div className="w-full mt-6">
                    <h3 className="text-sm font-medium mb-2 text-left">
                      Working With
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-start">
                      {workingWithProfessors.map((professor, i) => (
                        <Link to={`/professors/${professor.id}`} key={i}>
                          <Avatar
                            className="h-8 w-8 border-2 border-primary/10 hover:border-primary transition-colors cursor-pointer"
                            title={professor.name}
                          >
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${professor.name}`}
                              alt={professor.name}
                            />
                            <AvatarFallback>{professor.name[0]}</AvatarFallback>
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
                  {student.bio ? (
                    <p className="text-muted-foreground whitespace-pre-line">
                      {student.bio}
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
                  <h2 className="text-xl font-semibold mb-4">Publications</h2>
                  {loadingPublications ? (
                    <p className="text-muted-foreground">
                      Loading publications...
                    </p>
                  ) : publications.length === 0 ? (
                    <p className="text-muted-foreground italic">
                      No publications found.
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {publications.map((pub, index) => (
                        <div
                          key={index}
                          className="border-b pb-4 last:border-0"
                        >
                          <h3 className="font-medium">{pub.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {pub.authors?.join(", ") || ""}
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
