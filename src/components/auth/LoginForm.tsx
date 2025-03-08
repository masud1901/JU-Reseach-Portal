import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { GraduationCap, LogIn, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import AuthLayout from "./AuthLayout";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userType, setUserType] = useState<"professor" | "student">("professor");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { signIn, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        throw error;
      }

      // If remember me is checked, store the email in localStorage
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      toast({
        title: "Login successful",
        description: "Welcome back!",
        variant: "default",
      });

      // The redirect will be handled by the useEffect below
      // which watches for changes in userRole
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Invalid email or password");
      
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  // Redirect based on user role
  useEffect(() => {
    if (userRole === 'admin') {
      navigate('/admin');
    } else if (userRole === 'professor' || userRole === 'student') {
      navigate('/dashboard');
    }
  }, [userRole, navigate]);

  return (
    <AuthLayout>
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <LogIn className="h-5 w-5" /> Sign in to your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="professor"
            value={userType}
            onValueChange={(value) =>
              setUserType(value as "professor" | "student")
            }
            className="w-full mb-4"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="professor"
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" /> Professor
              </TabsTrigger>
              <TabsTrigger value="student" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" /> Student
              </TabsTrigger>
            </TabsList>
            <TabsContent value="professor">
              <p className="text-sm text-muted-foreground mb-4">
                Sign in as a professor to manage your research profile and
                connect with students.
              </p>
            </TabsContent>
            <TabsContent value="student">
              <p className="text-sm text-muted-foreground mb-4">
                Sign in as a student to explore research opportunities and
                connect with professors.
              </p>
            </TabsContent>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m.example@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-2 rounded-md">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
