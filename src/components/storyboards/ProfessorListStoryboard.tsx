import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import ProfessorCard from "@/components/professors/ProfessorCard";

export default function ProfessorListStoryboard() {
  const professors = [
    {
      id: "1",
      user_id: "user-123",
      name: "Dr. Md. Rahman",
      department: "Computer Science and Engineering",
      research_interests: ["Machine Learning", "Artificial Intelligence", "Computer Vision"],
      bio: "Professor of Computer Science with over 15 years of experience in AI research. Published extensively in top-tier journals and conferences.",
      google_scholar_id: "ABC123XYZ",
      is_verified: true,
      ranking_points: 320,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      user_id: "user-456",
      name: "Dr. Fatima Ahmed",
      department: "Physics",
      research_interests: ["Quantum Physics", "Theoretical Physics", "Particle Physics"],
      bio: "