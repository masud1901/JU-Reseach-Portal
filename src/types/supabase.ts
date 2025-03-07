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
      connection_requests: {
        Row: {
          created_at: string | null
          from_user_id: string | null
          id: string
          message: string | null
          status: string | null
          to_user_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          from_user_id?: string | null
          id?: string
          message?: string | null
          status?: string | null
          to_user_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          from_user_id?: string | null
          id?: string
          message?: string | null
          status?: string | null
          to_user_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string | null
          faculty_id: string | null
          id: string
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          faculty_id?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          faculty_id?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
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
          created_at: string | null
          id: string
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      professor_research_keywords: {
        Row: {
          created_at: string | null
          professor_id: string
          research_keyword_id: string
        }
        Insert: {
          created_at?: string | null
          professor_id: string
          research_keyword_id: string
        }
        Update: {
          created_at?: string | null
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
          badge: string | null
          bio: string | null
          created_at: string | null
          department: string | null
          google_scholar_id: string | null
          id: string
          is_verified: boolean | null
          name: string | null
          ranking_points: number | null
          research_interests: string[] | null
          seeking_students: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          badge?: string | null
          bio?: string | null
          created_at?: string | null
          department?: string | null
          google_scholar_id?: string | null
          id?: string
          is_verified?: boolean | null
          name?: string | null
          ranking_points?: number | null
          research_interests?: string[] | null
          seeking_students?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          badge?: string | null
          bio?: string | null
          created_at?: string | null
          department?: string | null
          google_scholar_id?: string | null
          id?: string
          is_verified?: boolean | null
          name?: string | null
          ranking_points?: number | null
          research_interests?: string[] | null
          seeking_students?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      publication_authors: {
        Row: {
          author_order: number | null
          created_at: string | null
          id: string
          professor_id: string | null
          publication_id: string | null
          student_id: string | null
          updated_at: string | null
        }
        Insert: {
          author_order?: number | null
          created_at?: string | null
          id?: string
          professor_id?: string | null
          publication_id?: string | null
          student_id?: string | null
          updated_at?: string | null
        }
        Update: {
          author_order?: number | null
          created_at?: string | null
          id?: string
          professor_id?: string | null
          publication_id?: string | null
          student_id?: string | null
          updated_at?: string | null
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
          citation_count: number | null
          created_at: string | null
          id: string
          journal: string | null
          professor_id: string | null
          title: string | null
          updated_at: string | null
          url: string | null
          year: number | null
        }
        Insert: {
          authors?: string[] | null
          citation_count?: number | null
          created_at?: string | null
          id?: string
          journal?: string | null
          professor_id?: string | null
          title?: string | null
          updated_at?: string | null
          url?: string | null
          year?: number | null
        }
        Update: {
          authors?: string[] | null
          citation_count?: number | null
          created_at?: string | null
          id?: string
          journal?: string | null
          professor_id?: string | null
          title?: string | null
          updated_at?: string | null
          url?: string | null
          year?: number | null
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
          created_at: string | null
          id: string
          keyword: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          keyword?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          keyword?: string | null
        }
        Relationships: []
      }
      students: {
        Row: {
          badge: string | null
          bio: string | null
          created_at: string | null
          department: string | null
          id: string
          name: string | null
          research_interests: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          badge?: string | null
          bio?: string | null
          created_at?: string | null
          department?: string | null
          id?: string
          name?: string | null
          research_interests?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          badge?: string | null
          bio?: string | null
          created_at?: string | null
          department?: string | null
          id?: string
          name?: string | null
          research_interests?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
