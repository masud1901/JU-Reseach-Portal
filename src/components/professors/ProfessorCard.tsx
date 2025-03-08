import ProfileCard from "@/components/ui/ProfileCard";
import { Professor } from "@/types/professor";

interface ProfessorCardProps {
  professor: Professor & { matchScore?: number; matchingKeywords?: number };
  showMatchScore?: boolean;
}

export default function ProfessorCard({
  professor,
  showMatchScore = false,
}: ProfessorCardProps) {
  return (
    <ProfileCard
      id={professor.id}
      name={professor.name}
      department={professor.department}
      role="professor"
      isVerified={professor.is_verified}
      seekingStudents={professor.seeking_students}
      researchInterests={professor.research_interests}
      bio={professor.bio}
      rankingPoints={professor.ranking_points}
      matchScore={showMatchScore ? professor.matchScore : undefined}
      matchingKeywords={showMatchScore ? professor.matchingKeywords : undefined}
    />
  );
}
