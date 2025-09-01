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
      budgets: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id_budget: number
          id_organization: number | null
          phone_number: string | null
          requester_email: string | null
          requester_name: string | null
          response_deadline: string | null
          status: string | null
          total_value: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id_budget?: number
          id_organization?: number | null
          phone_number?: string | null
          requester_email?: string | null
          requester_name?: string | null
          response_deadline?: string | null
          status?: string | null
          total_value?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id_budget?: number
          id_organization?: number | null
          phone_number?: string | null
          requester_email?: string | null
          requester_name?: string | null
          response_deadline?: string | null
          status?: string | null
          total_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "budgets_id_organization_fkey"
            columns: ["id_organization"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id_organization"]
          },
          {
            foreignKeyName: "fk_budgets_callers"
            columns: ["phone_number"]
            isOneToOne: false
            referencedRelation: "callers"
            referencedColumns: ["phone_number"]
          },
        ]
      }
      calendar_events: {
        Row: {
          created_at: string | null
          description: string | null
          end_time: string | null
          id_event: number
          id_organization: number | null
          id_user: number | null
          is_all_day: boolean | null
          location: string | null
          meeting_link: string | null
          start_time: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          id_event?: number
          id_organization?: number | null
          id_user?: number | null
          is_all_day?: boolean | null
          location?: string | null
          meeting_link?: string | null
          start_time?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          id_event?: number
          id_organization?: number | null
          id_user?: number | null
          is_all_day?: boolean | null
          location?: string | null
          meeting_link?: string | null
          start_time?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_id_organization_fkey"
            columns: ["id_organization"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id_organization"]
          },
          {
            foreignKeyName: "fk_calendar_users"
            columns: ["id_user"]
            isOneToOne: false
            referencedRelation: "supabase_users"
            referencedColumns: ["id_user"]
          },
        ]
      }
      call_archive: {
        Row: {
          archive_reason: string | null
          archived_at: string | null
          id_archive: number
          id_organization: number | null
          original_call_id: number | null
          phone_number: string | null
          status: boolean | null
          total_call_time: string | null
          transcription: Json | null
        }
        Insert: {
          archive_reason?: string | null
          archived_at?: string | null
          id_archive?: number
          id_organization?: number | null
          original_call_id?: number | null
          phone_number?: string | null
          status?: boolean | null
          total_call_time?: string | null
          transcription?: Json | null
        }
        Update: {
          archive_reason?: string | null
          archived_at?: string | null
          id_archive?: number
          id_organization?: number | null
          original_call_id?: number | null
          phone_number?: string | null
          status?: boolean | null
          total_call_time?: string | null
          transcription?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "call_archive_id_organization_fkey"
            columns: ["id_organization"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id_organization"]
          },
        ]
      }
      call_history: {
        Row: {
          created_at: string | null
          id_call: number
          id_organization: number | null
          phone_number: string | null
          status: boolean | null
          total_call_time: string | null
          transcription: Json | null
          twilio_number: number | null
        }
        Insert: {
          created_at?: string | null
          id_call?: number
          id_organization?: number | null
          phone_number?: string | null
          status?: boolean | null
          total_call_time?: string | null
          transcription?: Json | null
          twilio_number?: number | null
        }
        Update: {
          created_at?: string | null
          id_call?: number
          id_organization?: number | null
          phone_number?: string | null
          status?: boolean | null
          total_call_time?: string | null
          transcription?: Json | null
          twilio_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "call_history_id_organization_fkey"
            columns: ["id_organization"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id_organization"]
          },
          {
            foreignKeyName: "fk_call_callers"
            columns: ["phone_number"]
            isOneToOne: false
            referencedRelation: "callers"
            referencedColumns: ["phone_number"]
          },
          {
            foreignKeyName: "fk_call_history_twilio"
            columns: ["twilio_number"]
            isOneToOne: false
            referencedRelation: "twilio_numbers"
            referencedColumns: ["id_phone_number"]
          },
        ]
      }
      callers: {
        Row: {
          created_at: string | null
          email: string | null
          id_caller: number
          id_organization: number | null
          id_phone_number: number | null
          name: string | null
          phone_number: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id_caller?: number
          id_organization?: number | null
          id_phone_number?: number | null
          name?: string | null
          phone_number?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id_caller?: number
          id_organization?: number | null
          id_phone_number?: number | null
          name?: string | null
          phone_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_callers_twilio"
            columns: ["id_phone_number"]
            isOneToOne: false
            referencedRelation: "twilio_numbers"
            referencedColumns: ["id_phone_number"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string | null
          id_document: number
          id_organization: number | null
          name: string | null
          size: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          id_document: number
          id_organization?: number | null
          name?: string | null
          size?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          id_document?: number
          id_organization?: number | null
          name?: string | null
          size?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_id_organization_fkey"
            columns: ["id_organization"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id_organization"]
          },
        ]
      }
      documents_agent: {
        Row: {
          created_at: string | null
          format: string | null
          id_document: number
          id_organization: number | null
          name: string | null
          size: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          format?: string | null
          id_document: number
          id_organization?: number | null
          name?: string | null
          size?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          format?: string | null
          id_document?: number
          id_organization?: number | null
          name?: string | null
          size?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_agent_id_organization_fkey"
            columns: ["id_organization"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id_organization"]
          },
        ]
      }
      elevenlabs_agent: {
        Row: {
          code: string | null
          id_document: number | null
          id_elevenlabs_agent: number
          id_organization: number | null
          id_phone_number: number | null
        }
        Insert: {
          code?: string | null
          id_document?: number | null
          id_elevenlabs_agent: number
          id_organization?: number | null
          id_phone_number?: number | null
        }
        Update: {
          code?: string | null
          id_document?: number | null
          id_elevenlabs_agent?: number
          id_organization?: number | null
          id_phone_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_elevenlabs_document"
            columns: ["id_document"]
            isOneToOne: false
            referencedRelation: "documents_agent"
            referencedColumns: ["id_document"]
          },
          {
            foreignKeyName: "fk_elevenlabs_twilio"
            columns: ["id_phone_number"]
            isOneToOne: false
            referencedRelation: "twilio_numbers"
            referencedColumns: ["id_phone_number"]
          },
        ]
      }
      history_payment: {
        Row: {
          created_at: string | null
          id_organization: number | null
          id_payment: number
          nif: number | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          id_organization?: number | null
          id_payment?: number
          nif?: number | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          id_organization?: number | null
          id_payment?: number
          nif?: number | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_payment_org"
            columns: ["id_organization"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id_organization"]
          },
        ]
      }
      history_remaining_min_mesg: {
        Row: {
          id_history_remaining: number
          id_organization: number | null
          remaining_messages: number | null
          remaining_minutes: number | null
          yearmonth: string
        }
        Insert: {
          id_history_remaining?: number
          id_organization?: number | null
          remaining_messages?: number | null
          remaining_minutes?: number | null
          yearmonth: string
        }
        Update: {
          id_history_remaining?: number
          id_organization?: number | null
          remaining_messages?: number | null
          remaining_minutes?: number | null
          yearmonth?: string
        }
        Relationships: [
          {
            foreignKeyName: "history_remaining_min_mesg_id_organization_fkey"
            columns: ["id_organization"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id_organization"]
          },
        ]
      }
      message_archive: {
        Row: {
          archive_reason: string | null
          archived_at: string | null
          content: string | null
          id_archive: number
          id_organization: number | null
          original_message_id: number | null
          phone_number: string | null
        }
        Insert: {
          archive_reason?: string | null
          archived_at?: string | null
          content?: string | null
          id_archive?: number
          id_organization?: number | null
          original_message_id?: number | null
          phone_number?: string | null
        }
        Update: {
          archive_reason?: string | null
          archived_at?: string | null
          content?: string | null
          id_archive?: number
          id_organization?: number | null
          original_message_id?: number | null
          phone_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_archive_id_organization_fkey"
            columns: ["id_organization"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id_organization"]
          },
        ]
      }
      message_history: {
        Row: {
          content: string | null
          created_at: string | null
          id_message: number
          id_organization: number | null
          phone_number: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id_message?: number
          id_organization?: number | null
          phone_number?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id_message?: number
          id_organization?: number | null
          phone_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_message_twilio"
            columns: ["phone_number"]
            isOneToOne: false
            referencedRelation: "twilio_numbers"
            referencedColumns: ["phone_number"]
          },
          {
            foreignKeyName: "message_history_id_organization_fkey"
            columns: ["id_organization"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id_organization"]
          },
        ]
      }
      modules: {
        Row: {
          code: string | null
          description: string | null
          id_module: number
          name: string | null
          permission: string | null
        }
        Insert: {
          code?: string | null
          description?: string | null
          id_module?: number
          name?: string | null
          permission?: string | null
        }
        Update: {
          code?: string | null
          description?: string | null
          id_module?: number
          name?: string | null
          permission?: string | null
        }
        Relationships: []
      }
      organization: {
        Row: {
          created_at: string | null
          dashboard_link: string | null
          email: string | null
          id_organization: number
          id_supabase_credentials: number | null
          name: string | null
          nif: number | null
          phone_number: string | null
          plan: string | null
          remaining_messages: number | null
          remaining_minutes: number | null
          status: boolean | null
        }
        Insert: {
          created_at?: string | null
          dashboard_link?: string | null
          email?: string | null
          id_organization?: number
          id_supabase_credentials?: number | null
          name?: string | null
          nif?: number | null
          phone_number?: string | null
          plan?: string | null
          remaining_messages?: number | null
          remaining_minutes?: number | null
          status?: boolean | null
        }
        Update: {
          created_at?: string | null
          dashboard_link?: string | null
          email?: string | null
          id_organization?: number
          id_supabase_credentials?: number | null
          name?: string | null
          nif?: number | null
          phone_number?: string | null
          plan?: string | null
          remaining_messages?: number | null
          remaining_minutes?: number | null
          status?: boolean | null
        }
        Relationships: []
      }
      supabase_roles: {
        Row: {
          description: string | null
          id_organization: number | null
          id_role: number
          name: string | null
          permissions: string | null
        }
        Insert: {
          description?: string | null
          id_organization?: number | null
          id_role?: number
          name?: string | null
          permissions?: string | null
        }
        Update: {
          description?: string | null
          id_organization?: number | null
          id_role?: number
          name?: string | null
          permissions?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_roles_org"
            columns: ["id_organization"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id_organization"]
          },
        ]
      }
      supabase_users: {
        Row: {
          email: string | null
          id_caller: number | null
          id_organization: number | null
          id_role: number | null
          id_user: number
          user_id: string | null
        }
        Insert: {
          email?: string | null
          id_caller?: number | null
          id_organization?: number | null
          id_role?: number | null
          id_user?: number
          user_id?: string | null
        }
        Update: {
          email?: string | null
          id_caller?: number | null
          id_organization?: number | null
          id_role?: number | null
          id_user?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_supabase_users_organization"
            columns: ["id_organization"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id_organization"]
          },
          {
            foreignKeyName: "fk_supabase_users_role"
            columns: ["id_role"]
            isOneToOne: false
            referencedRelation: "supabase_roles"
            referencedColumns: ["id_role"]
          },
          {
            foreignKeyName: "fk_users_caller"
            columns: ["id_caller"]
            isOneToOne: false
            referencedRelation: "callers"
            referencedColumns: ["id_caller"]
          },
          {
            foreignKeyName: "fk_users_org"
            columns: ["id_organization"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id_organization"]
          },
          {
            foreignKeyName: "fk_users_roles"
            columns: ["id_role"]
            isOneToOne: false
            referencedRelation: "supabase_roles"
            referencedColumns: ["id_role"]
          },
        ]
      }
      tables: {
        Row: {
          code: string | null
          id_table: number
        }
        Insert: {
          code?: string | null
          id_table?: number
        }
        Update: {
          code?: string | null
          id_table?: number
        }
        Relationships: []
      }
      task_archive: {
        Row: {
          archive_reason: string | null
          archived_at: string | null
          category: string | null
          description: string | null
          id_archive: number
          id_organization: number | null
          original_task_id: number | null
          phone_number: string | null
          status: boolean | null
          title: string | null
        }
        Insert: {
          archive_reason?: string | null
          archived_at?: string | null
          category?: string | null
          description?: string | null
          id_archive?: number
          id_organization?: number | null
          original_task_id?: number | null
          phone_number?: string | null
          status?: boolean | null
          title?: string | null
        }
        Update: {
          archive_reason?: string | null
          archived_at?: string | null
          category?: string | null
          description?: string | null
          id_archive?: number
          id_organization?: number | null
          original_task_id?: number | null
          phone_number?: string | null
          status?: boolean | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_archive_id_organization_fkey"
            columns: ["id_organization"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id_organization"]
          },
        ]
      }
      tasks: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id_organization: number | null
          id_task: number
          phone_number: string | null
          status: boolean | null
          title: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id_organization?: number | null
          id_task?: number
          phone_number?: string | null
          status?: boolean | null
          title?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id_organization?: number | null
          id_task?: number
          phone_number?: string | null
          status?: boolean | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_id_organization_fkey"
            columns: ["id_organization"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id_organization"]
          },
        ]
      }
      ticket_archive: {
        Row: {
          archive_reason: string | null
          archived_at: string | null
          category: string | null
          description: string | null
          id_archive: number
          id_organization: number | null
          id_user: number | null
          original_ticket_id: number | null
          priority: string | null
          title: string | null
        }
        Insert: {
          archive_reason?: string | null
          archived_at?: string | null
          category?: string | null
          description?: string | null
          id_archive?: number
          id_organization?: number | null
          id_user?: number | null
          original_ticket_id?: number | null
          priority?: string | null
          title?: string | null
        }
        Update: {
          archive_reason?: string | null
          archived_at?: string | null
          category?: string | null
          description?: string | null
          id_archive?: number
          id_organization?: number | null
          id_user?: number | null
          original_ticket_id?: number | null
          priority?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_archive_id_organization_fkey"
            columns: ["id_organization"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id_organization"]
          },
        ]
      }
      tickets: {
        Row: {
          category: string | null
          description: string | null
          id_organization: number | null
          id_ticket: number
          id_user: number | null
          priority: string | null
          title: string | null
        }
        Insert: {
          category?: string | null
          description?: string | null
          id_organization?: number | null
          id_ticket?: number
          id_user?: number | null
          priority?: string | null
          title?: string | null
        }
        Update: {
          category?: string | null
          description?: string | null
          id_organization?: number | null
          id_ticket?: number
          id_user?: number | null
          priority?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_id_organization_fkey"
            columns: ["id_organization"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id_organization"]
          },
        ]
      }
      tmodules_torganization: {
        Row: {
          id_module: number
          id_organization: number | null
        }
        Insert: {
          id_module?: number
          id_organization?: number | null
        }
        Update: {
          id_module?: number
          id_organization?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_tmodules_module"
            columns: ["id_module"]
            isOneToOne: true
            referencedRelation: "modules"
            referencedColumns: ["id_module"]
          },
          {
            foreignKeyName: "fk_tmodules_org"
            columns: ["id_organization"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id_organization"]
          },
        ]
      }
      tmodules_ttables: {
        Row: {
          id_module: number
          id_table: number
        }
        Insert: {
          id_module: number
          id_table: number
        }
        Update: {
          id_module?: number
          id_table?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_tmodules_tables_module"
            columns: ["id_module"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id_module"]
          },
          {
            foreignKeyName: "fk_tmodules_tables_table"
            columns: ["id_table"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id_table"]
          },
        ]
      }
      twilio_numbers: {
        Row: {
          id_organization: number | null
          id_phone_number: number
          phone_number: string | null
        }
        Insert: {
          id_organization?: number | null
          id_phone_number?: number
          phone_number?: string | null
        }
        Update: {
          id_organization?: number | null
          id_phone_number?: number
          phone_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_twilio_org"
            columns: ["id_organization"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id_organization"]
          },
        ]
      }
      workflows: {
        Row: {
          code: string | null
          id_module: number | null
          id_workflow: number
          name: string | null
        }
        Insert: {
          code?: string | null
          id_module?: number | null
          id_workflow?: number
          name?: string | null
        }
        Update: {
          code?: string | null
          id_module?: number | null
          id_workflow?: number
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_workflows_module"
            columns: ["id_module"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id_module"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: { _role: string; _user_id: string }
        Returns: boolean
      }
      user_organization_ids: {
        Args: { _user_id: string }
        Returns: number[]
      }
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
