export interface Professor {
  id: string;
  user_id: string;
  name: string;
  department: string;
  research_interests: string[];
  bio?: string;
  google_scholar_id?: string;
  is_verified: boolean;
  ranking_points: number;
  created_at: string;
  updated_at: string;
}

export interface Publication {
  id: string;
  professor_id: string;
  title: string;
  authors: string[];
  journal?: string;
  year?: number;
  citation_count: number;
  url?: string;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  created_at: string;
}
