import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  Search,
  Settings,
  Trophy,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";

export default function LandingPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="font-bold text-xl">
              JU Research Portal
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <Link to="/professors">
              <Button variant="ghost">Professors</Button>
            </Link>
            <Link to="/leaderboard">
              <Button variant="ghost">Leaderboard</Button>
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/create-profile">
                  <Button variant="ghost">Create Profile</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                          alt={user.email || ""}
                        />
                        <AvatarFallback>
                          {user.email?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline-block">
                        {user.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => signOut()}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4">
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center pt-16">
          <div className="relative w-full max-w-6xl">
            {/* Gradient orbs */}
            <div className="absolute -top-24 -z-10 h-[300px] w-[300px] rounded-full bg-purple-500/20 blur-[100px]" />
            <div className="absolute -right-24 -top-48 -z-10 h-[300px] w-[300px] rounded-full bg-blue-500/20 blur-[100px]" />

            <div className="flex flex-col items-center justify-center space-y-8 text-center mb-16">
              <h1 className="animate-fade-up bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-6xl font-bold tracking-tight text-transparent sm:text-7xl">
                JU Research Portal
              </h1>

              <p className="max-w-[700px] animate-fade-up text-muted-foreground/80 md:text-xl">
                Connecting Researchers at Jahangirnagar University
              </p>

              <div className="flex gap-4 mt-8">
                <Link to="/professors">
                  <Button size="lg" className="px-8">
                    Browse Professors
                  </Button>
                </Link>
                {!user && (
                  <Link to="/signup">
                    <Button size="lg" variant="outline" className="px-8">
                      Create Profile
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary/10 text-primary mb-4">
                  <User className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Professor Profiles
                </h3>
                <p className="text-muted-foreground">
                  Discover detailed profiles with research interests,
                  publications, and Google Scholar integration.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary/10 text-primary mb-4">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Advanced Search</h3>
                <p className="text-muted-foreground">
                  Find professors by name, department, or research interests
                  with powerful filtering options.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary/10 text-primary mb-4">
                  <Trophy className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Research Rankings
                </h3>
                <p className="text-muted-foreground">
                  Explore top researchers through our gamified ranking system
                  based on publications and citations.
                </p>
              </div>
            </div>

            <div className="mt-20 bg-white p-8 rounded-lg shadow-sm border border-border">
              <h2 className="text-3xl font-bold mb-6 text-center">
                How It Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                    <UserPlus className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Create Profile</h3>
                  <p className="text-muted-foreground">
                    Professors create profiles with their research interests and
                    connect their Google Scholar account.
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Showcase Research
                  </h3>
                  <p className="text-muted-foreground">
                    Publications are automatically imported and displayed on
                    professor profiles.
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                    <Users className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Connect</h3>
                  <p className="text-muted-foreground">
                    Students discover professors with matching research
                    interests for potential collaboration.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-20 text-center">
              <h2 className="text-3xl font-bold mb-6">
                Join the Research Community
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Whether you're a professor looking to showcase your research or
                a student seeking mentorship, the JU Research Portal connects
                the Jahangirnagar University research community.
              </p>
              <Link to={user ? "/professors" : "/signup"}>
                <Button size="lg" className="px-8">
                  {user ? "Explore Professors" : "Get Started"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
