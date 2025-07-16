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
      calls: {
        Row: {
          caller_number: string
          created_at: string
          duration: number | null
          ended_at: string | null
          handled_by: string | null
          id: string
          notes: string | null
          receiver_number: string
          recording_url: string | null
          started_at: string
          status: Database["public"]["Enums"]["call_status"]
        }
        Insert: {
          caller_number: string
          created_at?: string
          duration?: number | null
          ended_at?: string | null
          handled_by?: string | null
          id?: string
          notes?: string | null
          receiver_number: string
          recording_url?: string | null
          started_at?: string
          status?: Database["public"]["Enums"]["call_status"]
        }
        Update: {
          caller_number?: string
          created_at?: string
          duration?: number | null
          ended_at?: string | null
          handled_by?: string | null
          id?: string
          notes?: string | null
          receiver_number?: string
          recording_url?: string | null
          started_at?: string
          status?: Database["public"]["Enums"]["call_status"]
        }
        Relationships: [
          {
            foreignKeyName: "calls_handled_by_fkey"
            columns: ["handled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          delivered_at: string | null
          id: string
          media_url: string | null
          message_type: string
          processed_by: string | null
          read_at: string | null
          receiver_number: string
          sender_number: string
          sent_at: string
          status: Database["public"]["Enums"]["message_status"]
        }
        Insert: {
          content: string
          created_at?: string
          delivered_at?: string | null
          id?: string
          media_url?: string | null
          message_type?: string
          processed_by?: string | null
          read_at?: string | null
          receiver_number: string
          sender_number: string
          sent_at?: string
          status?: Database["public"]["Enums"]["message_status"]
        }
        Update: {
          content?: string
          created_at?: string
          delivered_at?: string | null
          id?: string
          media_url?: string | null
          message_type?: string
          processed_by?: string | null
          read_at?: string | null
          receiver_number?: string
          sender_number?: string
          sent_at?: string
          status?: Database["public"]["Enums"]["message_status"]
        }
        Relationships: [
          {
            foreignKeyName: "messages_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          team: Database["public"]["Enums"]["team_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          team?: Database["public"]["Enums"]["team_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          team?: Database["public"]["Enums"]["team_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          archived: boolean
          assignee_id: string | null
          category: string
          created_at: string
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          priority: Database["public"]["Enums"]["task_priority"]
          status: Database["public"]["Enums"]["task_status"]
          team: Database["public"]["Enums"]["team_type"]
          title: string
          updated_at: string
        }
        Insert: {
          archived?: boolean
          assignee_id?: string | null
          category: string
          created_at?: string
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          team: Database["public"]["Enums"]["team_type"]
          title: string
          updated_at?: string
        }
        Update: {
          archived?: boolean
          assignee_id?: string | null
          category?: string
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          team?: Database["public"]["Enums"]["team_type"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      tickets: {
        Row: {
          assignee_id: string | null
          created_at: string
          description: string | null
          id: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          reporter_id: string
          resolution: string | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          team: Database["public"]["Enums"]["team_type"]
          title: string
          type: Database["public"]["Enums"]["ticket_type"]
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          reporter_id: string
          resolution?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          team: Database["public"]["Enums"]["team_type"]
          title: string
          type?: Database["public"]["Enums"]["ticket_type"]
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          reporter_id?: string
          resolution?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          team?: Database["public"]["Enums"]["team_type"]
          title?: string
          type?: Database["public"]["Enums"]["ticket_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tickets_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      insert_demo_data_for_user: {
        Args: { new_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      call_status: "active" | "completed" | "missed" | "failed"
      message_status: "sent" | "delivered" | "read" | "failed"
      task_priority: "low" | "medium" | "high"
      task_status: "pending" | "in_progress" | "completed"
      team_type: "technical" | "support" | "sales" | "management"
      ticket_priority: "low" | "medium" | "high"
      ticket_status: "open" | "in_progress" | "proposed_solution" | "closed"
      ticket_type:
        | "bug"
        | "feature_request"
        | "support"
        | "integration"
        | "configuration"
      user_role: "developer" | "manager" | "user"
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
      call_status: ["active", "completed", "missed", "failed"],
      message_status: ["sent", "delivered", "read", "failed"],
      task_priority: ["low", "medium", "high"],
      task_status: ["pending", "in_progress", "completed"],
      team_type: ["technical", "support", "sales", "management"],
      ticket_priority: ["low", "medium", "high"],
      ticket_status: ["open", "in_progress", "proposed_solution", "closed"],
      ticket_type: [
        "bug",
        "feature_request",
        "support",
        "integration",
        "configuration",
      ],
      user_role: ["developer", "manager", "user"],
    },
  },
} as const
