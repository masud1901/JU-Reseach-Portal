import ProfileCard from "@/components/ui/ProfileCard";
import { Student } from "@/types/professor";

interface StudentCardProps {
  student: Student;
}

export default function StudentCard({ student }: StudentCardProps) {
  return (
    <ProfileCard
      id={student.id}
      name={student.name}
      department={student.department}
      role="student"
      badge={student.badge}
      researchInterests={student.research_interests}
      bio={student.bio}
      rankingPoints={student.ranking_points}
    />
  );
}
