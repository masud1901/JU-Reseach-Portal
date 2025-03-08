export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      connection_requests: {
        Row: {
          created_at: string
          from_user_id: string
          id: string
          message: string | null
          status: string
          to_user_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          from_user_id: string
          id?: string
          message?: string | null
          status?: string
          to_user_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          from_user_id?: string
          id?: string
          message?: string | null
          status?: string
          to_user_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string
          faculty_id: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          faculty_id: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          faculty_id?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculties"
            referencedColumns: ["id"]
          },
        ]
      }
      faculties: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      professor_research_keywords: {
        Row: {
          created_at: string
          professor_id: string
          research_keyword_id: string
        }
        Insert: {
          created_at?: string
          professor_id: string
          research_keyword_id: string
        }
        Update: {
          created_at?: string
          professor_id?: string
          research_keyword_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "professor_research_keywords_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professor_research_keywords_research_keyword_id_fkey"
            columns: ["research_keyword_id"]
            isOneToOne: false
            referencedRelation: "research_keywords"
            referencedColumns: ["id"]
          },
        ]
      }
      professors: {
        Row: {
          bio: string | null
          created_at: string
          department_id: string | null
          google_scholar_id: string | null
          id: string
          is_verified: boolean
          name: string
          ranking_points: number
          research_interests: string[]
          seeking_students: boolean
          updated_at: string
          user_id: string | null
          verification_badge_type:
            | Database["public"]["Enums"]["verification_badge_type_enum"]
            | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          department_id?: string | null
          google_scholar_id?: string | null
          id?: string
          is_verified?: boolean
          name: string
          ranking_points?: number
          research_interests?: string[]
          seeking_students?: boolean
          updated_at?: string
          user_id?: string | null
          verification_badge_type?:
            | Database["public"]["Enums"]["verification_badge_type_enum"]
            | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          department_id?: string | null
          google_scholar_id?: string | null
          id?: string
          is_verified?: boolean
          name?: string
          ranking_points?: number
          research_interests?: string[]
          seeking_students?: boolean
          updated_at?: string
          user_id?: string | null
          verification_badge_type?:
            | Database["public"]["Enums"]["verification_badge_type_enum"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "professors_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      publication_authors: {
        Row: {
          author_order: number | null
          created_at: string
          id: string
          professor_id: string | null
          publication_id: string
          student_id: string | null
          updated_at: string
        }
        Insert: {
          author_order?: number | null
          created_at?: string
          id?: string
          professor_id?: string | null
          publication_id: string
          student_id?: string | null
          updated_at?: string
        }
        Update: {
          author_order?: number | null
          created_at?: string
          id?: string
          professor_id?: string | null
          publication_id?: string
          student_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "publication_authors_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publication_authors_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publication_authors_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      publications: {
        Row: {
          authors: string[] | null
          citation_count: number
          created_at: string
          id: string
          journal: string | null
          journal_name: string | null
          professor_id: string | null
          publication_date: string | null
          publication_type: string | null
          publication_year: number | null
          publisher: string | null
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          authors?: string[] | null
          citation_count?: number
          created_at?: string
          id?: string
          journal?: string | null
          journal_name?: string | null
          professor_id?: string | null
          publication_date?: string | null
          publication_type?: string | null
          publication_year?: number | null
          publisher?: string | null
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          authors?: string[] | null
          citation_count?: number
          created_at?: string
          id?: string
          journal?: string | null
          journal_name?: string | null
          professor_id?: string | null
          publication_date?: string | null
          publication_type?: string | null
          publication_year?: number | null
          publisher?: string | null
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "publications_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
            referencedColumns: ["id"]
          },
        ]
      }
      research_keywords: {
        Row: {
          created_at: string
          id: string
          keyword: string
        }
        Insert: {
          created_at?: string
          id?: string
          keyword: string
        }
        Update: {
          created_at?: string
          id?: string
          keyword?: string
        }
        Relationships: []
      }
      student_research_keywords: {
        Row: {
          created_at: string
          research_keyword_id: string
          student_id: string
        }
        Insert: {
          created_at?: string
          research_keyword_id: string
          student_id: string
        }
        Update: {
          created_at?: string
          research_keyword_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_research_keywords_research_keyword_id_fkey"
            columns: ["research_keyword_id"]
            isOneToOne: false
            referencedRelation: "research_keywords"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_research_keywords_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          badge: string | null
          bio: string | null
          created_at: string
          department_id: string | null
          id: string
          name: string
          ranking_points: number | null
          research_interests: string[]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          badge?: string | null
          bio?: string | null
          created_at?: string
          department_id?: string | null
          id?: string
          name: string
          ranking_points?: number | null
          research_interests?: string[]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          badge?: string | null
          bio?: string | null
          created_at?: string
          department_id?: string | null
          id?: string
          name?: string
          ranking_points?: number | null
          research_interests?: string[]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      combined_leaderboard: {
        Row: {
          department_id: string | null
          id: string | null
          is_verified: boolean | null
          name: string | null
          ranking_points: number | null
          role: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_student_keyword: {
        Args: {
          s_id: string
          keyword_text: string
        }
        Returns: undefined
      }
      get_combined_leaderboard: {
        Args: {
          limit_count?: number
        }
        Returns: {
          id: string
          name: string
          role: string
          department_id: string
          department_name: string
          ranking_points: number
          is_verified: boolean
        }[]
      }
      get_matching_professors_for_student: {
        Args: {
          student_id: string
        }
        Returns: {
          professor_id: string
          professor_name: string
          department_id: string
          department_name: string
          match_count: number
          is_verified: boolean
          seeking_students: boolean
        }[]
      }
      get_matching_students_for_professor: {
        Args: {
          professor_id: string
        }
        Returns: {
          student_id: string
          student_name: string
          department_id: string
          department_name: string
          match_count: number
        }[]
      }
      get_professor_collaborators: {
        Args: {
          p_id: string
        }
        Returns: {
          student_id: string
          student_name: string
        }[]
      }
      get_professor_keywords: {
        Args: {
          professor_id: string
        }
        Returns: {
          keyword_id: string
          keyword: string
        }[]
      }
      get_professor_publication_count: {
        Args: {
          p_id: string
        }
        Returns: number
      }
      get_professor_publications: {
        Args: {
          p_id: string
        }
        Returns: {
          id: string
          title: string
          authors: string[]
          journal_name: string
          publication_year: number
          citation_count: number
          url: string
          publication_type: string
        }[]
      }
      get_professor_publications_paginated: {
        Args: {
          p_id: string
          page_number?: number
          page_size?: number
        }
        Returns: {
          id: string
          title: string
          authors: string[]
          journal_name: string
          publication_year: number
          citation_count: number
          url: string
          publication_type: string
        }[]
      }
      get_student_collaborators: {
        Args: {
          s_id: string
        }
        Returns: {
          professor_id: string
          professor_name: string
        }[]
      }
      get_student_keywords: {
        Args: {
          student_id: string
        }
        Returns: {
          keyword_id: string
          keyword: string
        }[]
      }
      get_student_publication_count: {
        Args: {
          s_id: string
        }
        Returns: number
      }
      get_student_publications: {
        Args: {
          s_id: string
        }
        Returns: {
          id: string
          title: string
          authors: string[]
          journal_name: string
          publication_year: number
          citation_count: number
          url: string
          publication_type: string
        }[]
      }
      get_student_publications_paginated: {
        Args: {
          s_id: string
          page_number?: number
          page_size?: number
        }
        Returns: {
          id: string
          title: string
          authors: string[]
          journal_name: string
          publication_year: number
          citation_count: number
          url: string
          publication_type: string
        }[]
      }
      get_user_role: {
        Args: {
          user_id: string
        }
        Returns: string
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      is_professor: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      is_student: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      remove_student_keyword: {
        Args: {
          s_id: string
          keyword_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      connection_status_enum: "pending" | "accepted" | "rejected" | "cancelled"
      publication_type_enum:
        | "journal_article"
        | "conference_paper"
        | "book_chapter"
        | "book"
        | "thesis"
        | "other"
        | "Research Article"
        | "Conference Paper"
        | "Journal Article"
        | "Review Article"
        | "Book Chapter"
        | "Thesis"
      verification_badge_type_enum: "none" | "verified" | "top_researcher"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
