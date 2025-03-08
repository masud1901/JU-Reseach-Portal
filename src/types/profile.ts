// Define a unified profile type for both professors and students
export interface UnifiedProfile {
  id: string;
  user_id: string | null;
  name: string;
  department: string;
  department_id?: string;
  bio?: string;
  research_interests?: string[];
  badge?: string;
  is_verified?: boolean;
  ranking_points?: number;
  seeking_students?: boolean;
  google_scholar_id?: string;
  verification_badge_type?: string;
  profileType: "professor" | "student";
}

// Publication type
export interface Publication {
  id: string;
  title: string;
  authors: string[] | string;
  journal_name?: string;
  publisher?: string;
  publication_year?: number;
  publication_date?: string;
  citation_count: number;
  url?: string;
  publication_type?: string;
}
