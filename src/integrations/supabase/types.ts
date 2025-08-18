export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      access: {
        Row: {
          email: string
          id_paid_user: number | null
          id_role: number | null
        }
        Insert: {
          email: string
          id_paid_user?: number | null
          id_role?: number | null
        }
        Update: {
          email?: string
          id_paid_user?: number | null
          id_role?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "access_id_paid_user_fkey"
            columns: ["id_paid_user"]
            isOneToOne: false
            referencedRelation: "paid_user"
            referencedColumns: ["id_paid_user"]
          },
          {
            foreignKeyName: "access_id_role_fkey"
            columns: ["id_role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id_role"]
          },
        ]
      }
      call_history: {
        Row: {
          created_at: string | null
          id_call: number
          phone_number: number | null
          status: boolean | null
          total_call_time: string | null
          transcription: Json | null
        }
        Insert: {
          created_at?: string | null
          id_call?: number
          phone_number?: number | null
          status?: boolean | null
          total_call_time?: string | null
          transcription?: Json | null
        }
        Update: {
          created_at?: string | null
          id_call?: number
          phone_number?: number | null
          status?: boolean | null
          total_call_time?: string | null
          transcription?: Json | null
        }
        Relationships: []
      }
      history_payment: {
        Row: {
          created_at: string | null
          id_paid_user: number | null
          id_payment: number
          nif: number | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          id_paid_user?: number | null
          id_payment?: number
          nif?: number | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          id_paid_user?: number | null
          id_payment?: number
          nif?: number | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_history_payment_paid_user"
            columns: ["id_paid_user"]
            isOneToOne: false
            referencedRelation: "paid_user"
            referencedColumns: ["id_paid_user"]
          },
        ]
      }
      message_history: {
        Row: {
          content: string | null
          created_at: string | null
          id_message: number
          phone_number: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id_message?: number
          phone_number?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id_message?: number
          phone_number?: string | null
        }
        Relationships: []
      }
      modules: {
        Row: {
          description: string | null
          id_module: number
          name: string | null
          permission: string | null
        }
        Insert: {
          description?: string | null
          id_module?: number
          name?: string | null
          permission?: string | null
        }
        Update: {
          description?: string | null
          id_module?: number
          name?: string | null
          permission?: string | null
        }
        Relationships: []
      }
      paid_user: {
        Row: {
          created_at: string | null
          dashboard_link: string | null
          email: string | null
          id_paid_user: number
          id_supabase_credentials: number | null
          nif: number | null
          phone_number: number | null
          plan: string | null
        }
        Insert: {
          created_at?: string | null
          dashboard_link?: string | null
          email?: string | null
          id_paid_user?: number
          id_supabase_credentials?: number | null
          nif?: number | null
          phone_number?: number | null
          plan?: string | null
        }
        Update: {
          created_at?: string | null
          dashboard_link?: string | null
          email?: string | null
          id_paid_user?: number
          id_supabase_credentials?: number | null
          nif?: number | null
          phone_number?: number | null
          plan?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paid_user_id_supabase_credentials_fkey"
            columns: ["id_supabase_credentials"]
            isOneToOne: false
            referencedRelation: "supabase_credentials"
            referencedColumns: ["id_supabase_credentials"]
          },
        ]
      }
      roles: {
        Row: {
          description: string | null
          id_role: number
          name: string | null
          permissions: string | null
        }
        Insert: {
          description?: string | null
          id_role?: number
          name?: string | null
          permissions?: string | null
        }
        Update: {
          description?: string | null
          id_role?: number
          name?: string | null
          permissions?: string | null
        }
        Relationships: []
      }
      supabase_credentials: {
        Row: {
          host: string | null
          id_supabase_credentials: number
          service_secret: string | null
        }
        Insert: {
          host?: string | null
          id_supabase_credentials?: number
          service_secret?: string | null
        }
        Update: {
          host?: string | null
          id_supabase_credentials?: number
          service_secret?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id_task: number
          phone_number: number | null
          status: boolean | null
          title: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id_task?: number
          phone_number?: number | null
          status?: boolean | null
          title?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id_task?: number
          phone_number?: number | null
          status?: boolean | null
          title?: string | null
        }
        Relationships: []
      }
      tickets: {
        Row: {
          category: string | null
          description: string | null
          id_ticket: number
          id_user: number | null
          priority: string | null
          title: string | null
        }
        Insert: {
          category?: string | null
          description?: string | null
          id_ticket?: number
          id_user?: number | null
          priority?: string | null
          title?: string | null
        }
        Update: {
          category?: string | null
          description?: string | null
          id_ticket?: number
          id_user?: number | null
          priority?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_id_user_fkey"
            columns: ["id_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id_user"]
          },
        ]
      }
      tmodules_tpaid_user: {
        Row: {
          id_module: number
          id_paid_user: number
        }
        Insert: {
          id_module: number
          id_paid_user: number
        }
        Update: {
          id_module?: number
          id_paid_user?: number
        }
        Relationships: [
          {
            foreignKeyName: "tmodules_tpaid_user_id_module_fkey"
            columns: ["id_module"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id_module"]
          },
          {
            foreignKeyName: "tmodules_tpaid_user_id_paid_user_fkey"
            columns: ["id_paid_user"]
            isOneToOne: false
            referencedRelation: "paid_user"
            referencedColumns: ["id_paid_user"]
          },
        ]
      }
      twilio_numbers: {
        Row: {
          id_paid_user: number | null
          id_phone_number: number
          phone_number: number | null
        }
        Insert: {
          id_paid_user?: number | null
          id_phone_number?: number
          phone_number?: number | null
        }
        Update: {
          id_paid_user?: number | null
          id_phone_number?: number
          phone_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "twilio_numbers_id_paid_user_fkey"
            columns: ["id_paid_user"]
            isOneToOne: false
            referencedRelation: "paid_user"
            referencedColumns: ["id_paid_user"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id_user: number
          name: string | null
          phone_number: number | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id_user?: number
          name?: string | null
          phone_number?: number | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id_user?: number
          name?: string | null
          phone_number?: number | null
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
    Enums: {},
  },
} as const
