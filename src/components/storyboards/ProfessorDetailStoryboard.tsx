import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  Trophy,
  User,
} from "lucide-react";

export default function ProfessorDetailStoryboard() {
  const professor = {
    id: "1",
    user_id: "user-123",
    name: "Dr. Md. Rahman",
    department: "Computer Science and Engineering",
    research_interests: [
      "Machine Learning",
      "Artificial Intelligence",
      "Computer Vision",
    ],
    bio: "Professor of Computer Science with over 15 years of experience in AI research. Published extensively in top-tier journals and conferences.",
    google_scholar_id: "ABC123XYZ",
    is_verified: true,
    ranking_points: 320,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const publications = [
    {
      id: "pub1",
      professor_id: "1",
      title: "Deep Learning Approaches for Bengali Natural Language Processing",
      authors: ["Md. Rahman", "S. Ahmed", "K. Islam"],
      journal: "IEEE Transactions on Pattern Analysis and Machine Intelligence",
      year: 2022,
      citation_count: 45,
      url: "https://example.com/publication1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "pub2",
      professor_id: "1",
      title:
        "Computer Vision Applications in Agriculture: A Case Study from Bangladesh",
      authors: ["Md. Rahman", "F. Hossain"],
      journal: "Journal of Computer Vision Research",
      year: 2021,
      citation_count: 32,
      url: "https://example.com/publication2",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const initials = professor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="container mx-auto py-8 px-4 bg-slate-50">
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

                <div className="flex items-center gap-2 mb-6">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  <span className="font-semibold">
                    {professor.ranking_points} points
                  </span>
                </div>

                <div className="space-y-2 mb-6 w-full">
                  {professor.google_scholar_id && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {}}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Google Scholar Profile
                    </Button>
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
                              onClick={() => {}}
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
