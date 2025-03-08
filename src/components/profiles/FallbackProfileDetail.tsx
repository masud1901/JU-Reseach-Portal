import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge-dark";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card-dark";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, CheckCircle2, ExternalLink } from "lucide-react";
import { useParams } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { getInitials } from "@/utils/formatUtils";
import PublicationItem from "@/components/ui/PublicationItem";
// Pagination removed from profile view

export default function FallbackProfileDetail() {
  // Extract the ID from the URL
  const { id } = useParams<{ id: string }>();
  // Determine the profile type from the URL path
  const type = window.location.pathname.includes("/professors/")
    ? "professors"
    : "students";

  // Use the custom hook to fetch profile data
  const {
    profile,
    loading,
    publications,
    loadingPublications,
    department,
    error,
  } = useProfile(id, type as "professors" | "students");

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

  if (error || !profile) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
        <p>{error || "The profile you're looking for doesn't exist."}</p>
      </div>
    );
  }

  const initials = getInitials(profile.name);

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
                  {profile.profileType === "professor" &&
                    profile.ranking_points !== undefined && (
                      <Badge variant="outline" className="font-semibold">
                        {profile.ranking_points} points
                      </Badge>
                    )}

                  {profile.profileType === "professor" &&
                    profile.seeking_students && (
                      <Badge variant="secondary">Seeking Students</Badge>
                    )}

                  {profile.profileType === "student" && profile.badge && (
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
              {profile.research_interests &&
                profile.research_interests.length > 0 && (
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
              {profile.profileType === "professor" &&
                profile.google_scholar_id && (
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
                    {profile.profileType === "professor"
                      ? "Research publications authored by this professor"
                      : "Research publications this student has contributed to"}
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
                      <p className="text-muted-foreground">
                        No publications found
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-6">
                        {publications.map((pub, index) => (
                          <PublicationItem
                            key={pub.id || `pub-${index}`}
                            publication={pub}
                          />
                        ))}
                      </div>
                    </>
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
                    {profile.profileType === "professor"
                      ? "Students and colleagues connected with this professor"
                      : "Professors and peers connected with this student"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      No connections found
                    </p>
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
