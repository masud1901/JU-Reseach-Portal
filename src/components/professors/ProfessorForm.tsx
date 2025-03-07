import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ResearchKeywordSelector from "./ResearchKeywordSelector";

export default function ProfessorForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<
    { id: string; name: string }[]
  >([]);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    bio: "",
    google_scholar_id: "",
    research_interest: "",
    research_interests: [] as string[],
  });

  useEffect(() => {
    fetchDepartments();
    checkExistingProfile();
  }, []);

  async function fetchDepartments() {
    try {
      const { data, error } = await supabase
        .from("departments")
        .select("id, name");

      if (error) {
        throw error;
      }

      if (data) {
        setDepartments(data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }

  async function checkExistingProfile() {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("professors")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        // User already has a profile, redirect to it
        navigate(`/professors/${data.id}`);
      }
    } catch (error) {
      console.error("Error checking existing profile:", error);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDepartmentChange = (value: string) => {
    setFormData({ ...formData, department: value });
  };

  // Research interests are now handled by the ResearchKeywordSelector component

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to create a profile");
      return;
    }

    if (formData.research_interests.length === 0) {
      alert("Please add at least one research interest");
      return;
    }

    try {
      setLoading(true);

      // Get department ID
      const { data: deptData, error: deptError } = await supabase
        .from("departments")
        .select("id")
        .eq("name", formData.department)
        .single();

      if (deptError) throw deptError;

      // Create professor without research interests
      const { data, error } = await supabase
        .from("professors")
        .insert([
          {
            user_id: user.id,
            name: formData.name,
            department_id: deptData.id,
            bio: formData.bio,
            google_scholar_id: formData.google_scholar_id,
            is_verified: false,
            ranking_points: 0,
          },
        ])
        .select();

      if (error) throw error;

      // Add research keywords using the edge function
      if (formData.research_interests.length > 0) {
        const { error: keywordError } = await supabase.functions.invoke(
          "add_professor_keywords",
          {
            body: {
              professorId: data[0].id,
              keywords: formData.research_interests,
            },
          },
        );

        if (keywordError) throw keywordError;
      }

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        navigate(`/professors/${data[0].id}`);
      }
    } catch (error) {
      console.error("Error creating professor profile:", error);
      alert("Error creating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
        <p>Please log in to create a professor profile.</p>
        <Button onClick={() => navigate("/login")} className="mt-4">
          Log In
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create Professor Profile</CardTitle>
          <CardDescription>
            Fill out the form below to create your professor profile. Your
            profile will be reviewed for verification.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.department}
                onValueChange={handleDepartmentChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biography</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about your academic background and research focus"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="google_scholar_id">
                Google Scholar ID (optional)
              </Label>
              <Input
                id="google_scholar_id"
                name="google_scholar_id"
                value={formData.google_scholar_id}
                onChange={handleChange}
                placeholder="e.g. A1B2C3D4E5F"
              />
              <p className="text-xs text-muted-foreground">
                Find your ID in your Google Scholar profile URL:
                scholar.google.com/citations?user=YOUR_ID
              </p>
            </div>

            <ResearchKeywordSelector
              selectedKeywords={formData.research_interests}
              onChange={(keywords) =>
                setFormData({ ...formData, research_interests: keywords })
              }
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating Profile..." : "Create Profile"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
