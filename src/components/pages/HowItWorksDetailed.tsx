import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Search, Trophy, User, UserPlus, Users } from "lucide-react";

export default function HowItWorksDetailed() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          How JU Research Portal Works
        </h1>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4">For Professors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                      <UserPlus className="h-5 w-5" />
                    </div>
                    <CardTitle>Create Your Profile</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      Sign up for an account or log in if you already have one
                    </li>
                    <li>
                      Click on "Create Professor Profile" in the user menu
                    </li>
                    <li>
                      Fill in your details, including department and research
                      interests
                    </li>
                    <li>
                      Add your Google Scholar ID to automatically import
                      publications
                    </li>
                    <li>Submit your profile for verification</li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <CardTitle>Manage Publications</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      Publications are automatically imported from Google
                      Scholar
                    </li>
                    <li>
                      Your citation counts contribute to your ranking points
                    </li>
                    <li>
                      Recent publications have a higher impact on your ranking
                    </li>
                    <li>
                      You can manually add publications that aren't on Google
                      Scholar
                    </li>
                    <li>
                      Keep your profile updated to maintain accurate rankings
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">For Students</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                      <User className="h-5 w-5" />
                    </div>
                    <CardTitle>Create Student Profile</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      Sign up for an account or log in if you already have one
                    </li>
                    <li>Click on "Create Student Profile" in the user menu</li>
                    <li>Enter your details and select your department</li>
                    <li>
                      Add your research interests to help match with professors
                    </li>
                    <li>Add any publications you've authored or co-authored</li>
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                      <Search className="h-5 w-5" />
                    </div>
                    <CardTitle>Find Research Mentors</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      Browse the professor directory or use the search function
                    </li>
                    <li>
                      Filter professors by department or research interests
                    </li>
                    <li>
                      Look for the "Seeking Students" badge on professor
                      profiles
                    </li>
                    <li>
                      Review professor publications to understand their work
                    </li>
                    <li>
                      Send connection requests to professors you'd like to work
                      with
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              Connecting and Collaborating
            </h2>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <CardTitle>Building Research Relationships</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Send a connection request with a personalized message
                    explaining your research interests
                  </li>
                  <li>Recipients can accept or decline connection requests</li>
                  <li>
                    Once connected, you can communicate directly via email
                  </li>
                  <li>Collaborate on research projects and publications</li>
                  <li>
                    Students can gain recognition through the badge system as
                    they publish more research
                  </li>
                </ol>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              Leaderboard and Recognition
            </h2>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <CardTitle>Research Impact Rankings</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  The leaderboard showcases top researchers based on publication
                  impact. Ranking points are calculated using:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Publication Count:</strong> Each publication adds
                    base points to your ranking
                  </li>
                  <li>
                    <strong>Citation Impact:</strong> Higher citation counts
                    increase your ranking
                  </li>
                  <li>
                    <strong>Recency Factor:</strong> Recent publications have
                    more weight in the ranking algorithm
                  </li>
                  <li>
                    <strong>Verification Status:</strong> Verified profiles
                    appear more prominently
                  </li>
                  <li>
                    <strong>Badges:</strong> Special recognition is given to
                    distinguished researchers and mentors
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
