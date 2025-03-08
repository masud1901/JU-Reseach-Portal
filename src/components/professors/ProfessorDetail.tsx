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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Professor, Publication } from "@/types/professor";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    CheckCircle2,
    ExternalLink,
    FileText,
    Mail,
    Plus,
    Trophy,
    User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import * as z from "zod";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";
import ImportPublicationsButton from "./ImportPublicationsButton";

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
      const { data, error } = await supabase
        .from("publications")
        .select("*")
        .eq("professor_id", professorId)
        .order("year", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setPublications(data as Publication[]);
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

  const [workingWithStudents, setWorkingWithStudents] = useState<any[]>([]);

  useEffect(() => {
    if (professor) {
      fetchWorkingWithStudents();
    }
  }, [professor]);

  async function fetchWorkingWithStudents() {
    try {
      // Find publications where this professor is an author
      const { data: pubData, error: pubError } = await supabase
        .from("publication_authors")
        .select("publication_id")
        .eq("professor_id", professor.id);

      if (pubError) throw pubError;

      if (pubData && pubData.length > 0) {
        const publicationIds = pubData.map((p) => p.publication_id);

        // Find students who are also authors on these publications
        const { data: studentData, error: studentError } = await supabase
          .from("publication_authors")
          .select("student_id, students(id, name)")
          .in("publication_id", publicationIds)
          .not("student_id", "is", null);

        if (studentError) throw studentError;

        if (studentData) {
          // Extract unique students
          const uniqueStudents = Array.from(
            new Set(
              studentData
                .filter((item) => item.student_id && item.students)
                .map((item) => JSON.stringify(item.students)),
            ),
          ).map((str) => JSON.parse(str));

          setWorkingWithStudents(uniqueStudents);
        }
      }
    } catch (error) {
      console.error("Error fetching collaborating students:", error);
    }
  }

  function AddPublicationForm({ professorId, onSuccess }: { professorId: string, onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    
    // Define form schema
    const formSchema = z.object({
      title: z.string().min(5, "Title must be at least 5 characters"),
      authors: z.string().min(3, "Authors must be at least 3 characters"),
      journal_name: z.string().min(3, "Journal name must be at least 3 characters"),
      publication_year: z.coerce.number().min(1900).max(new Date().getFullYear()),
      publication_type: z.string().min(3, "Publication type must be at least 3 characters"),
      url: z.string().url("Must be a valid URL").optional(),
      citation_count: z.coerce.number().min(0, "Citations must be a positive number"),
    });

    // Initialize form
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        title: "",
        authors: "",
        journal_name: "",
        publication_year: new Date().getFullYear(),
        publication_type: "Research Article",
        url: "",
        citation_count: 0,
      },
    });

    // Handle form submission
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
        setLoading(true);
        
        // Convert authors string to array
        const authorsArray = values.authors.split(',').map(author => author.trim());
        
        // Insert publication
        const { data, error } = await supabase
          .from('publications')
          .insert([
            {
              professor_id: professorId,
              title: values.title,
              authors: authorsArray,
              journal_name: values.journal_name,
              publication_year: values.publication_year,
              publication_type: values.publication_type,
              url: values.url || null,
              citation_count: values.citation_count,
            }
          ]);
        
        if (error) throw error;
        
        // Update professor's ranking points
        await updateProfessorRankingPoints(professorId);
        
        toast({
          title: "Publication added",
          description: "Your publication has been added successfully",
        });
        
        // Reset form and close dialog
        form.reset();
        onSuccess();
        
      } catch (error) {
        console.error("Error adding publication:", error);
        toast({
          title: "Error",
          description: "Failed to add publication. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    // Function to update professor's ranking points
    async function updateProfessorRankingPoints(professorId: string) {
      try {
        // Get all publications for this professor
        const { data: publications, error } = await supabase
          .from('publications')
          .select('citation_count, publication_year')
          .eq('professor_id', professorId);
        
        if (error) throw error;
        
        // Calculate ranking points
        let rankingPoints = 0;
        const currentYear = new Date().getFullYear();
        
        publications.forEach((pub) => {
          // Base points for each publication
          let points = 10;
          
          // Add points for citations
          points += pub.citation_count || 0;
          
          // Apply recency factor
          const yearDiff = currentYear - (pub.publication_year || currentYear);
          const recencyFactor = Math.max(0.5, 1 - yearDiff * 0.1);
          
          rankingPoints += points * recencyFactor;
        });
        
        // Update professor's ranking points
        const { error: updateError } = await supabase
          .from('professors')
          .update({ ranking_points: Math.round(rankingPoints) })
          .eq('id', professorId);
        
        if (updateError) throw updateError;
        
      } catch (error) {
        console.error("Error updating ranking points:", error);
      }
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="authors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Authors</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Comma-separated list of authors</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="journal_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Journal/Conference</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="publication_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="publication_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publication Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Research Article">Research Article</SelectItem>
                      <SelectItem value="Conference Paper">Conference Paper</SelectItem>
                      <SelectItem value="Journal Article">Journal Article</SelectItem>
                      <SelectItem value="Review Article">Review Article</SelectItem>
                      <SelectItem value="Book Chapter">Book Chapter</SelectItem>
                      <SelectItem value="Thesis">Thesis</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="citation_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Citations</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL (optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Publication"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

                <div className="flex flex-wrap gap-2 mb-6 justify-center">
                  {professor.badge && (
                    <Badge variant="outline">{professor.badge}</Badge>
                  )}
                  {professor.seeking_students && (
                    <Badge variant="secondary">Seeking Students</Badge>
                  )}
                </div>

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
                  <h2 className="text-xl font-semibold mb-4">Publications</h2>
                  {isOwnProfile && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="ml-auto">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Publication
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Add Publication</DialogTitle>
                          <DialogDescription>
                            Add a new publication to your profile. This will also update your ranking points.
                          </DialogDescription>
                        </DialogHeader>
                        <AddPublicationForm 
                          professorId={professor.id} 
                          onSuccess={() => {
                            fetchPublications();
                            fetchProfessor();
                          }} 
                        />
                      </DialogContent>
                    </Dialog>
                  )}
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
                            {pub.journal && (
                              <span className="text-muted-foreground">
                                {pub.journal}
                              </span>
                            )}
                            {pub.year && (
                              <span className="text-muted-foreground">
                                {pub.year}
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
