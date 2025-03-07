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
import { UserPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, User } from "lucide-react";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [userType, setUserType] = useState<"professor" | "student">(
    "professor",
  );
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signUp(email, password, fullName);

      // Store the user type in local storage to redirect them to the correct profile creation page after email verification
      localStorage.setItem("userType", userType);

      navigate("/success");
    } catch (error) {
      setError("Error creating account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <UserPlus className="h-5 w-5" /> Create an account
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
                Sign up as a professor to showcase your research and connect
                with students.
              </p>
            </TabsContent>
            <TabsContent value="student">
              <p className="text-sm text-muted-foreground mb-4">
                Sign up as a student to discover research opportunities and
                connect with professors.
              </p>
            </TabsContent>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Creating account..."
                : `Sign up as ${userType === "professor" ? "Professor" : "Student"}`}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
