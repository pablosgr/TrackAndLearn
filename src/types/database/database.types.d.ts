export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      adaptation: {
        Row: {
          code: string
          description: string | null
          id: number
          name: string
        }
        Insert: {
          code: string
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          code?: string
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      classroom: {
        Row: {
          created_at: string | null
          id: number
          name: string
          teacher_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          teacher_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          teacher_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "classroom_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      option: {
        Row: {
          id: number
          index_order: number
          is_correct: boolean | null
          option_text: string
          question_id: number | null
        }
        Insert: {
          id?: number
          index_order: number
          is_correct?: boolean | null
          option_text: string
          question_id?: number | null
        }
        Update: {
          id?: number
          index_order?: number
          is_correct?: boolean | null
          option_text?: string
          question_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "option_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question"
            referencedColumns: ["id"]
          },
        ]
      }
      question: {
        Row: {
          id: number
          index_order: number
          options_number: number
          question_text: string
          test_id: number | null
        }
        Insert: {
          id?: number
          index_order: number
          options_number: number
          question_text: string
          test_id?: number | null
        }
        Update: {
          id?: number
          index_order?: number
          options_number?: number
          question_text?: string
          test_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "question_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "test"
            referencedColumns: ["id"]
          },
        ]
      }
      student_classroom: {
        Row: {
          classroom_id: number
          student_id: number
        }
        Insert: {
          classroom_id: number
          student_id: number
        }
        Update: {
          classroom_id?: number
          student_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "student_classroom_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classroom"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_classroom_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      test: {
        Row: {
          adaptation_id: number | null
          created_at: string | null
          id: number
          level: string | null
          name: string
          template_id: number | null
          time_limit: number | null
        }
        Insert: {
          adaptation_id?: number | null
          created_at?: string | null
          id?: number
          level?: string | null
          name: string
          template_id?: number | null
          time_limit?: number | null
        }
        Update: {
          adaptation_id?: number | null
          created_at?: string | null
          id?: number
          level?: string | null
          name?: string
          template_id?: number | null
          time_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_adaptation_id_fkey"
            columns: ["adaptation_id"]
            isOneToOne: false
            referencedRelation: "adaptation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "test_template"
            referencedColumns: ["id"]
          },
        ]
      }
      test_assignment: {
        Row: {
          assigned_at: string | null
          classroom_id: number | null
          due_date: string | null
          id: number
          test_id: number | null
        }
        Insert: {
          assigned_at?: string | null
          classroom_id?: number | null
          due_date?: string | null
          id?: number
          test_id?: number | null
        }
        Update: {
          assigned_at?: string | null
          classroom_id?: number | null
          due_date?: string | null
          id?: number
          test_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_assignment_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classroom"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_assignment_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "test"
            referencedColumns: ["id"]
          },
        ]
      }
      test_response: {
        Row: {
          id: number
          is_correct: boolean | null
          question_id: number | null
          selected_option_id: number | null
          test_result_id: number | null
        }
        Insert: {
          id?: number
          is_correct?: boolean | null
          question_id?: number | null
          selected_option_id?: number | null
          test_result_id?: number | null
        }
        Update: {
          id?: number
          is_correct?: boolean | null
          question_id?: number | null
          selected_option_id?: number | null
          test_result_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_response_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_response_selected_option_id_fkey"
            columns: ["selected_option_id"]
            isOneToOne: false
            referencedRelation: "option"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_response_test_result_id_fkey"
            columns: ["test_result_id"]
            isOneToOne: false
            referencedRelation: "test_result"
            referencedColumns: ["id"]
          },
        ]
      }
      test_result: {
        Row: {
          classroom_id: number | null
          correct_answers: number | null
          ended_at: string | null
          id: number
          is_visible: boolean | null
          score: number | null
          started_at: string | null
          status: string | null
          student_id: number | null
          test_id: number | null
          total_questions: number | null
        }
        Insert: {
          classroom_id?: number | null
          correct_answers?: number | null
          ended_at?: string | null
          id?: number
          is_visible?: boolean | null
          score?: number | null
          started_at?: string | null
          status?: string | null
          student_id?: number | null
          test_id?: number | null
          total_questions?: number | null
        }
        Update: {
          classroom_id?: number | null
          correct_answers?: number | null
          ended_at?: string | null
          id?: number
          is_visible?: boolean | null
          score?: number | null
          started_at?: string | null
          status?: string | null
          student_id?: number | null
          test_id?: number | null
          total_questions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_result_classroom_id_fkey"
            columns: ["classroom_id"]
            isOneToOne: false
            referencedRelation: "classroom"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_result_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_result_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "test"
            referencedColumns: ["id"]
          },
        ]
      }
      test_template: {
        Row: {
          created_at: string | null
          id: number
          name: string
          teacher_id: number | null
          topic_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          teacher_id?: number | null
          topic_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          teacher_id?: number | null
          topic_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_template_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_template_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topic"
            referencedColumns: ["id"]
          },
        ]
      }
      topic: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          adaptation_id: number | null
          auth_id: string | null
          created_at: string | null
          email: string
          id: number
          name: string
          password_hash: string
          role: Database["public"]["Enums"]["role"]
          username: string
        }
        Insert: {
          adaptation_id?: number | null
          auth_id?: string | null
          created_at?: string | null
          email: string
          id?: number
          name: string
          password_hash: string
          role: Database["public"]["Enums"]["role"]
          username: string
        }
        Update: {
          adaptation_id?: number | null
          auth_id?: string | null
          created_at?: string | null
          email?: string
          id?: number
          name?: string
          password_hash?: string
          role?: Database["public"]["Enums"]["role"]
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_adaptation_id_fkey"
            columns: ["adaptation_id"]
            isOneToOne: false
            referencedRelation: "adaptation"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      role: "teacher" | "student" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      role: ["teacher", "student", "admin"],
    },
  },
} as const
