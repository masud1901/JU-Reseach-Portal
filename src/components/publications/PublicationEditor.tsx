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
  FormDescription,
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
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../../supabase/supabase";
import * as z from "zod";

interface PublicationEditorProps {
  mode: "create" | "edit";
  professorId?: string;
  studentId?: string;
  publication?: any;
  onSuccess: () => void;
  buttonLabel?: string;
  buttonVariant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  buttonClassName?: string;
}

export default function PublicationEditor({
  mode,
  professorId,
  studentId,
  publication,
  onSuccess,
  buttonLabel,
  buttonVariant = "outline",
  buttonSize = "sm",
  buttonClassName = "",
}: PublicationEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Define form schema
  const formSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    authors: z.string().min(3, "Authors must be at least 3 characters"),
    journal_name: z
      .string()
      .min(3, "Journal name must be at least 3 characters"),
    publication_year: z.coerce
      .number()
      .min(1900, "Year must be 1900 or later")
      .max(new Date().getFullYear(), "Year cannot be in the future"),
    publication_type: z.string().min(3, "Publication type is required"),
    url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    citation_count: z.coerce
      .number()
      .min(0, "Citations must be a positive number"),
  });

  // Initialize form with default values or existing publication data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: publication?.title || "",
      authors: publication?.authors ? publication.authors.join(", ") : "",
      journal_name: publication?.journal_name || "",
      publication_year:
        publication?.publication_year || new Date().getFullYear(),
      publication_type: publication?.publication_type || "Research Article",
      url: publication?.url || "",
      citation_count: publication?.citation_count || 0,
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      if (mode === "create") {
        // Create new publication
        const { data, error } = await supabase
          .from("publications")
          .insert([
            {
              title: values.title,
              authors: values.authors.split(",").map((author) => author.trim()),
              journal_name: values.journal_name,
              publication_year: values.publication_year,
              publication_type: values.publication_type,
              url: values.url || null,
              citation_count: values.citation_count,
            },
          ])
          .select();

        if (error) throw error;

        // Link publication to professor or student
        if (data && data.length > 0) {
          const publicationId = data[0].id;

          const { error: authorError } = await supabase
            .from("publication_authors")
            .insert([
              {
                publication_id: publicationId,
                professor_id: professorId || null,
                student_id: studentId || null,
                author_order: 1,
              },
            ]);

          if (authorError) throw authorError;

          toast({
            title: "Publication added",
            description: "Your publication has been added successfully",
          });
        }
      } else if (mode === "edit" && publication?.id) {
        // Update existing publication
        const { error } = await supabase
          .from("publications")
          .update({
            title: values.title,
            authors: values.authors.split(",").map((author) => author.trim()),
            journal_name: values.journal_name,
            publication_year: values.publication_year,
            publication_type: values.publication_type,
            url: values.url || null,
            citation_count: values.citation_count,
          })
          .eq("id", publication.id);

        if (error) throw error;

        toast({
          title: "Publication updated",
          description: "Your publication has been updated successfully",
        });
      }

      // Update ranking points if professor is involved
      if (professorId) {
        await updateProfessorRankingPoints(professorId);
      }

      // Reset form and close dialog
      form.reset();
      setIsOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error saving publication:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to save publication. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to update professor's ranking points
  async function updateProfessorRankingPoints(professorId: string) {
    try {
      // Get all publications for this professor
      const { data: publications, error } = await supabase
        .from("publications")
        .select("citation_count, publication_year")
        .eq("professor_id", professorId);

      if (error) throw error;

      // Calculate ranking points
      let rankingPoints = 0;
      const currentYear = new Date().getFullYear();

      publications.forEach((pub) => {
        // Base points for each publication
        let points = 10;

        // Add points for citations
        points += pub.citation_count || 0;

        // Apply recency factor
        const yearDiff = currentYear - (pub.publication_year || currentYear);
        const recencyFactor = Math.max(0.5, 1 - yearDiff * 0.1);

        rankingPoints += points * recencyFactor;
      });

      // Update professor's ranking points
      const { error: updateError } = await supabase
        .from("professors")
        .update({ ranking_points: Math.round(rankingPoints) })
        .eq("id", professorId);

      if (updateError) throw updateError;
    } catch (error) {
      console.error("Error updating ranking points:", error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={buttonVariant}
          size={buttonSize}
          className={buttonClassName}
        >
          {mode === "create" ? (
            <>
              <Plus className="h-4 w-4 mr-2" />
              {buttonLabel || "Add Publication"}
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              {buttonLabel || "Edit Publication"}
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Publication" : "Edit Publication"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new publication to your profile. This will also update your ranking points."
              : "Update the details of your publication."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="authors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Authors</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of authors
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="journal_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Journal/Conference</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="publication_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="publication_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publication Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Research Article">
                          Research Article
                        </SelectItem>
                        <SelectItem value="Conference Paper">
                          Conference Paper
                        </SelectItem>
                        <SelectItem value="Journal Article">
                          Journal Article
                        </SelectItem>
                        <SelectItem value="Review Article">
                          Review Article
                        </SelectItem>
                        <SelectItem value="Book Chapter">
                          Book Chapter
                        </SelectItem>
                        <SelectItem value="Thesis">Thesis</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="citation_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Citations</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading
                  ? mode === "create"
                    ? "Adding..."
                    : "Updating..."
                  : mode === "create"
                    ? "Add Publication"
                    : "Update Publication"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
