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
import { X } from "lucide-react";

export default function ProfessorFormStoryboard() {
  const departments = [
    { id: "1", name: "Computer Science and Engineering" },
    { id: "2", name: "Physics" },
    { id: "3", name: "Mathematics" },
    { id: "4", name: "Chemistry" },
    { id: "5", name: "Biology" },
  ];

  const researchInterests = [
    "Machine Learning",
    "Artificial Intelligence",
    "Computer Vision",
  ];

  return (
    <div className="container mx-auto py-8 px-4 bg-slate-50">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create Professor Profile</CardTitle>
          <CardDescription>
            Fill out the form below to create your professor profile. Your
            profile will be reviewed for verification.
          </CardDescription>
        </CardHeader>
        <form>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue="Dr. John Smith"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select defaultValue={departments[0].name}>
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
                rows={4}
                defaultValue="Professor of Computer Science with over 15 years of experience in AI research. Published extensively in top-tier journals and conferences."
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
                defaultValue="ABC123XYZ"
                placeholder="e.g. A1B2C3D4E5F"
              />
              <p className="text-xs text-muted-foreground">
                Find your ID in your Google Scholar profile URL:
                scholar.google.com/citations?user=YOUR_ID
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="research_interest">Research Interests</Label>
              <div className="flex gap-2">
                <Input
                  id="research_interest"
                  name="research_interest"
                  placeholder="Add a research interest"
                />
                <Button type="button">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {researchInterests.map((interest, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="pl-2 pr-1 py-1"
                  >
                    {interest}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="button" className="w-full">
              Create Profile
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
