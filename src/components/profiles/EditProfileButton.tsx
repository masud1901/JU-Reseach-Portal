import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../../supabase/supabase";
import * as z from "zod";
import ResearchKeywordSelector from "../professors/ResearchKeywordSelector";

interface EditProfileButtonProps {
  profileType: "professor" | "student";
  profileId: string;
  onProfileUpdated: () => void;
}

export default function EditProfileButton({
  profileType,
  profileId,
  onProfileUpdated,
}: EditProfileButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [departments, setDepartments] = useState<
    { id: string; name: string }[]
  >([]);
  const { toast } = useToast();

  // Define form schema based on profile type
  const professorFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    department_id: z.string().min(1, "Department is required"),
    bio: z.string().optional(),
    google_scholar_id: z.string().optional(),
    seeking_students: z.boolean().optional(),
  });

  const studentFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    department_id: z.string().min(1, "Department is required"),
    bio: z.string().optional(),
  });

  const formSchema =
    profileType === "professor" ? professorFormSchema : studentFormSchema;

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      department_id: "",
      bio: "",
      ...(profileType === "professor"
        ? { google_scholar_id: "", seeking_students: false }
        : {}),
    },
  });

  const [researchInterests, setResearchInterests] = useState<string[]>([]);

  // Fetch profile data and departments
  useEffect(() => {
    const fetchData = async () => {
      setInitialLoading(true);
      try {
        // Fetch departments
        const { data: deptData, error: deptError } = await supabase
          .from("departments")
          .select("id, name");

        if (deptError) throw deptError;
        setDepartments(deptData || []);

        // Fetch profile data
        const table = profileType === "professor" ? "professors" : "students";
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .eq("id", profileId)
          .single();

        if (error) throw error;

        if (data) {
          // Set form values
          form.reset({
            name: data.name || "",
            department_id: data.department_id || "",
            bio: data.bio || "",
            ...(profileType === "professor"
              ? {
                  google_scholar_id: data.google_scholar_id || "",
                  seeking_students: data.seeking_students || false,
                }
              : {}),
          });

          // Set research interests
          setResearchInterests(data.research_interests || []);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setInitialLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, profileId, profileType, form, toast]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const table = profileType === "professor" ? "professors" : "students";

      // Update profile
      const { error } = await supabase
        .from(table)
        .update({
          name: values.name,
          department_id: values.department_id,
          bio: values.bio,
          research_interests: researchInterests,
          ...(profileType === "professor"
            ? {
                google_scholar_id: values.google_scholar_id,
                seeking_students: values.seeking_students,
              }
            : {}),
        })
        .eq("id", profileId);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });

      setIsOpen(false);
      onProfileUpdated();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mb-6">
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Edit {profileType === "professor" ? "Professor" : "Student"} Profile
          </DialogTitle>
          <DialogDescription>
            Update your profile information and research interests
          </DialogDescription>
        </DialogHeader>

        {initialLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biography</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Tell us about your academic background and research focus"
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {profileType === "professor" && (
                <>
                  <FormField
                    control={form.control}
                    name="google_scholar_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Google Scholar ID (optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. A1B2C3D4E5F" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="seeking_students"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>I am currently seeking students</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </>
              )}

              <div className="space-y-2">
                <FormLabel>Research Interests</FormLabel>
                <ResearchKeywordSelector
                  selectedKeywords={researchInterests}
                  onChange={setResearchInterests}
                />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
