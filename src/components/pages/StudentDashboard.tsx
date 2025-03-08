import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, FileText, PenSquare, Plus, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";
import ResearchInterestMatches from "../profiles/ResearchInterestMatches";

type Publication = {
  id: string;
  title: string;
  journal: string;
  publication_year: number;
  citation_count: number;
  publication_type: string;
  url: string;
};

type Student = {
  id: string;
  name: string;
  department: string;
  bio: string;
  research_interests: string[];
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState<Student | null>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [connectionRequests, setConnectionRequests] = useState<any[]>([]);
  const [stats, setStats] = useState({
    publicationCount: 0,
    citationCount: 0,
    connectionCount: 0,
  });
  const [newPublication, setNewPublication] = useState({
    title: "",
    journal: "",
    publication_year: new Date().getFullYear(),
    publication_type: "journal",
    url: "",
  });
  const [publicationDialogOpen, setPublicationDialogOpen] = useState(false);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [professors, setProfessors] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchStudentProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  async function fetchStudentProfile() {
    try {
      setLoading(true);
      
      // Check for student profile
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("*, departments(name)")
        .eq("user_id", user.id)
        .single();
      
      if (studentError) {
        throw studentError;
      }
      
      setStudentProfile({
        ...studentData,
        department: studentData.departments?.name || "",
      });
      
      await fetchStudentData(studentData.id);
      await fetchProfessors();
      
    } catch (error) {
      console.error("Error fetching student profile:", error);
      // If no profile exists, redirect to create profile
      navigate("/create-student-profile");
    } finally {
      setLoading(false);
    }
  }
  
  async function fetchStudentData(studentId: string) {
    try {
      // Fetch publications where student is an author
      const { data: authorData, error: authorError } = await supabase
        .from("publication_authors")
        .select("*, publications(*)")
        .eq("student_id", studentId);
      
      if (authorError) {
        throw authorError;
      }
      
      if (authorData) {
        const pubs = authorData.map(a => a.publications);
        setPublications(pubs);
        
        // Calculate stats
        const citationCount = pubs.reduce((sum, pub) => sum + (pub.citation_count || 0), 0);
        
        setStats({
          publicationCount: pubs.length,
          citationCount,
          connectionCount: 0, // Will be updated later
        });
      }
      
      // Fetch connection requests
      const { data: requestsData, error: requestsError } = await supabase
        .from("connection_requests")
        .select("*, professors(*), students(*)")
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      
      if (requestsError) {
        throw requestsError;
      }
      
      if (requestsData) {
        setConnectionRequests(requestsData);
      }
      
      // Fetch connection count
      const { count, error: connError } = await supabase
        .from("connection_requests")
        .select("*", { count: "exact", head: true })
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .eq("status", "accepted");
      
      if (connError) {
        throw connError;
      }
      
      setStats(prev => ({
        ...prev,
        connectionCount: count || 0,
      }));
      
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  }

  async function fetchProfessors() {
    try {
      const { data, error } = await supabase
        .from("professors")
        .select("*, departments(name)")
        .eq("is_verified", true)
        .order("name");
      
      if (error) {
        throw error;
      }
      
      setProfessors(data.map(prof => ({
        ...prof,
        department: prof.departments?.name || "",
      })));
    } catch (error) {
      console.error("Error fetching professors:", error);
    }
  }

  const handleAddPublication = async () => {
    if (!studentProfile) return;
    
    try {
      // First create the publication
      const { data: pubData, error: pubError } = await supabase
        .from("publications")
        .insert([
          {
            title: newPublication.title,
            journal: newPublication.journal,
            publication_year: newPublication.publication_year,
            publication_type: newPublication.publication_type,
            url: newPublication.url,
            citation_count: 0,
          },
        ])
        .select();
      
      if (pubError) {
        throw pubError;
      }
      
      if (pubData && pubData.length > 0) {
        // Then add the student as an author
        const { error: authorError } = await supabase
          .from("publication_authors")
          .insert([
            {
              publication_id: pubData[0].id,
              student_id: studentProfile.id,
              author_order: 1,
            },
          ]);
        
        if (authorError) {
          throw authorError;
        }
        
        toast({
          title: "Publication Added",
          description: "Your publication has been added successfully.",
          variant: "default",
        });
        
        // Reset form and close dialog
        setNewPublication({
          title: "",
          journal: "",
          publication_year: new Date().getFullYear(),
          publication_type: "journal",
          url: "",
        });
        setPublicationDialogOpen(false);
        
        // Refresh publications
        fetchStudentData(studentProfile.id);
      }
    } catch (error) {
      console.error("Error adding publication:", error);
      toast({
        title: "Error",
        description: "Failed to add publication. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditPublication = async () => {
    if (!studentProfile || !editingPublication) return;
    
    try {
      const { error } = await supabase
        .from("publications")
        .update({
          title: newPublication.title,
          journal: newPublication.journal,
          publication_year: newPublication.publication_year,
          publication_type: newPublication.publication_type,
          url: newPublication.url,
        })
        .eq("id", editingPublication.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Publication Updated",
        description: "Your publication has been updated successfully.",
        variant: "default",
      });
      
      // Reset form and close dialog
      setNewPublication({
        title: "",
        journal: "",
        publication_year: new Date().getFullYear(),
        publication_type: "journal",
        url: "",
      });
      setEditingPublication(null);
      setPublicationDialogOpen(false);
      
      // Refresh publications
      fetchStudentData(studentProfile.id);
    } catch (error) {
      console.error("Error updating publication:", error);
      toast({
        title: "Error",
        description: "Failed to update publication. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePublication = async (publicationId: string) => {
    if (!studentProfile) return;
    
    if (!confirm("Are you sure you want to delete this publication?")) {
      return;
    }
    
    try {
      // First delete the author relationship
      const { error: authorError } = await supabase
        .from("publication_authors")
        .delete()
        .eq("publication_id", publicationId)
        .eq("student_id", studentProfile.id);
      
      if (authorError) {
        throw authorError;
      }
      
      // Then delete the publication
      const { error: pubError } = await supabase
        .from("publications")
        .delete()
        .eq("id", publicationId);
      
      if (pubError) {
        throw pubError;
      }
      
      toast({
        title: "Publication Deleted",
        description: "Your publication has been deleted successfully.",
        variant: "default",
      });
      
      // Refresh publications
      fetchStudentData(studentProfile.id);
    } catch (error) {
      console.error("Error deleting publication:", error);
      toast({
        title: "Error",
        description: "Failed to delete publication. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (publication: Publication) => {
    setEditingPublication(publication);
    setNewPublication({
      title: publication.title,
      journal: publication.journal,
      publication_year: publication.publication_year,
      publication_type: publication.publication_type,
      url: publication.url || "",
    });
    setPublicationDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingPublication(null);
    setNewPublication({
      title: "",
      journal: "",
      publication_year: new Date().getFullYear(),
      publication_type: "journal",
      url: "",
    });
    setPublicationDialogOpen(true);
  };

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
        <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map(i => (
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
  
  if (!studentProfile) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Welcome to JU Research Portal</h1>
        
        <div className="bg-muted/30 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Create Your Student Profile</h2>
          <p className="mb-6">You don't have a student profile yet. Create a profile to connect with professors and showcase your research.</p>
          
          <Button onClick={() => navigate("/create-student-profile")}>
            Create Student Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Manage your research profile, publications, and connections
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Your Publications
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publicationCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats.citationCount} total citations
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Research Connections
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.connectionCount}</div>
            <p className="text-xs text-muted-foreground">
              {connectionRequests.length} pending requests
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Profile Status
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                Active
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                {studentProfile.department}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="publications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="publications">
            <BookOpen className="h-4 w-4 mr-2" /> Publications
          </TabsTrigger>
          <TabsTrigger value="professors">
            <Users className="h-4 w-4 mr-2" /> Find Professors
          </TabsTrigger>
          <TabsTrigger value="connections">
            <Users className="h-4 w-4 mr-2" /> Connection Requests
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="publications" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Publications</h2>
            <Dialog open={publicationDialogOpen} onOpenChange={setPublicationDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAddDialog}>
                  <Plus className="h-4 w-4 mr-2" /> Add Publication
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingPublication ? "Edit Publication" : "Add New Publication"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingPublication 
                      ? "Update your publication details below." 
                      : "Enter your publication details below."}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newPublication.title}
                      onChange={(e) => setNewPublication({...newPublication, title: e.target.value})}
                      placeholder="Publication title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="journal">Journal/Conference</Label>
                    <Input
                      id="journal"
                      value={newPublication.journal}
                      onChange={(e) => setNewPublication({...newPublication, journal: e.target.value})}
                      placeholder="Journal or conference name"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        type="number"
                        value={newPublication.publication_year}
                        onChange={(e) => setNewPublication({...newPublication, publication_year: parseInt(e.target.value)})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={newPublication.publication_type}
                        onValueChange={(value) => setNewPublication({...newPublication, publication_type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="journal">Journal</SelectItem>
                          <SelectItem value="conference">Conference</SelectItem>
                          <SelectItem value="book">Book</SelectItem>
                          <SelectItem value="thesis">Thesis</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url">URL (optional)</Label>
                    <Input
                      id="url"
                      value={newPublication.url}
                      onChange={(e) => setNewPublication({...newPublication, url: e.target.value})}
                      placeholder="https://example.com/publication"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={editingPublication ? handleEditPublication : handleAddPublication}>
                    {editingPublication ? "Update Publication" : "Add Publication"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {publications.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-6">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Publications Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't added any publications yet. Add your research publications to showcase your work.
                  </p>
                  <Button onClick={openAddDialog}>
                    <Plus className="h-4 w-4 mr-2" /> Add Your First Publication
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {publications.map((pub) => (
                <Card key={pub.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{pub.title}</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(pub)}>
                          <PenSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeletePublication(pub.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>
                      {pub.journal} • {pub.publication_year} • {pub.publication_type}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <Badge variant="outline" className="mr-2">
                          {pub.citation_count} citations
                        </Badge>
                      </div>
                      {pub.url && (
                        <Button variant="link" asChild className="p-0 h-auto">
                          <a href={pub.url} target="_blank" rel="noopener noreferrer">
                            View Publication
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="professors" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Find Professors by Research Interest</h2>
          
          <ResearchInterestMatches 
            userType="student" 
            userId={studentProfile.id} 
            interests={studentProfile.research_interests} 
          />
          
          <h2 className="text-xl font-semibold mt-8 mb-4">All Verified Professors</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {professors.map((prof) => (
              <Card key={prof.id}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{prof.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{prof.name}</CardTitle>
                      <CardDescription>{prof.department}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2 mb-2">
                    {prof.bio || "No biography provided."}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {prof.research_interests?.slice(0, 3).map((interest: string) => (
                      <Badge key={interest} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                    {prof.research_interests?.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{prof.research_interests.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/professors/${prof.id}`}>View Profile</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="connections" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Connection Requests</h2>
          
          {connectionRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-6">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Pending Requests</h3>
                  <p className="text-muted-foreground">
                    You don't have any pending connection requests.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {connectionRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {request.from_user_id === user.id
                        ? `Request to ${request.professors?.name || request.students?.name}`
                        : `Request from ${request.professors?.name || request.students?.name}`}
                    </CardTitle>
                    <CardDescription>
                      Sent on {new Date(request.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{request.message || "No message provided."}</p>
                    {request.from_user_id !== user.id && (
                      <div className="flex gap-2">
                        <Button variant="default" className="w-full">
                          Accept
                        </Button>
                        <Button variant="outline" className="w-full">
                          Decline
                        </Button>
                      </div>
                    )}
                    {request.from_user_id === user.id && (
                      <Badge variant="outline">Awaiting Response</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard; 