import ProfessorCard from "@/components/professors/ProfessorCard";

export default function ProfessorCardStoryboard() {
  const sampleProfessor = {
    id: "1",
    user_id: "user-123",
    name: "Dr. Md. Rahman",
    department: "Computer Science and Engineering",
    research_interests: [
      "Machine Learning",
      "Artificial Intelligence",
      "Computer Vision",
    ],
    bio: "Professor of Computer Science with over 15 years of experience in AI research. Published extensively in top-tier journals and conferences.",
    google_scholar_id: "ABC123XYZ",
    is_verified: true,
    ranking_points: 320,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return (
    <div className="p-6 bg-slate-50">
      <div className="max-w-md">
        <ProfessorCard professor={sampleProfessor} />
      </div>
    </div>
  );
}
