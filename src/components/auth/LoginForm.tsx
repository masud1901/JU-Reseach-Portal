import { useState } from "react";
import { useAuth } from "../../../supabase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { LogIn } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, User } from "lucide-react";
import { supabase } from "../../../supabase/supabase";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userType, setUserType] = useState<"professor" | "student">(
    "professor",
  );
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);
      if (error) throw error;

      // Check if the user has the correct profile type
      if (data?.user) {
        // Check if user is an admin
        const { data: adminData } = await supabase
          .from("admin_users")
          .select("*")
          .eq("email", data.user.email)
          .single();

        if (adminData) {
          // Admin users can access the admin dashboard
          navigate("/admin");
          return;
        }

        if (userType === "professor") {
          const { data: professorData, error: professorError } = await supabase
            .from("professors")
            .select("*")
            .eq("user_id", data.user.id)
            .single();

          if (professorError && professorError.code !== "PGRST116") {
            throw professorError;
          }

          if (!professorData) {
            // Redirect to create professor profile if they don't have one
            navigate("/create-professor-profile");
            return;
          }
        } else {
          // Check for student profile
          const { data: studentData, error: studentError } = await supabase
            .from("students")
            .select("*")
            .eq("user_id", data.user.id)
            .single();

          if (studentError && studentError.code !== "PGRST116") {
            throw studentError;
          }

          if (!studentData) {
            // Redirect to create student profile if they don't have one
            navigate("/create-student-profile");
            return;
          }
        }
      }

      navigate("/");
    } catch (error) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <LogIn className="h-5 w-5" /> Sign in
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
                Sign in as a student to discover research opportunities and
                connect with professors.
              </p>
            </TabsContent>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Signing in..."
                : `Sign in as ${userType === "professor" ? "Professor" : "Student"}`}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-slate-600">
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
