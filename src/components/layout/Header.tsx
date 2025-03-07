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
import { Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";

export default function Header() {
  const { user, signOut } = useAuth();

  return (
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
          <Link to="/students">
            <Button variant="ghost">Students</Button>
          </Link>
          <Link to="/leaderboard">
            <Button variant="ghost">Leaderboard</Button>
          </Link>
          <Link to="/how-it-works">
            <Button variant="ghost">How It Works</Button>
          </Link>
          {user && (
            <Link to="/connections">
              <Button variant="ghost">Connections</Button>
            </Link>
          )}
          {user && (
            <Link to="/admin">
              <Button variant="ghost">Admin</Button>
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-4">
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
                    <span className="hidden md:inline-block">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link
                      to="/create-professor-profile"
                      className="flex items-center w-full"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Create Professor Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      to="/create-student-profile"
                      className="flex items-center w-full"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Create Student Profile
                    </Link>
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
  );
}
