// Temporary types until Supabase types are generated properly
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id_user: number;
          name: string | null;
          email: string | null;
          phone_number: number | null;
          created_at: string | null;
        };
        Insert: {
          id_user?: number;
          name?: string | null;
          email?: string | null;
          phone_number?: number | null;
          created_at?: string | null;
        };
        Update: {
          id_user?: number;
          name?: string | null;
          email?: string | null;
          phone_number?: number | null;
          created_at?: string | null;
        };
      };
      paid_user: {
        Row: {
          id_paid_user: number;
          nif: number | null;
          id_supabase_credentials: number | null;
          created_at: string | null;
          phone_number: number | null;
          email: string | null;
          dashboard_link: string | null;
          plan: string | null;
        };
        Insert: {
          id_paid_user?: number;
          nif?: number | null;
          id_supabase_credentials?: number | null;
          created_at?: string | null;
          phone_number?: number | null;
          email?: string | null;
          dashboard_link?: string | null;
          plan?: string | null;
        };
        Update: {
          id_paid_user?: number;
          nif?: number | null;
          id_supabase_credentials?: number | null;
          created_at?: string | null;
          phone_number?: number | null;
          email?: string | null;
          dashboard_link?: string | null;
          plan?: string | null;
        };
      };
      modules: {
        Row: {
          id_module: number;
          name: string | null;
          description: string | null;
          permission: string | null;
        };
        Insert: {
          id_module?: number;
          name?: string | null;
          description?: string | null;
          permission?: string | null;
        };
        Update: {
          id_module?: number;
          name?: string | null;
          description?: string | null;
          permission?: string | null;
        };
      };
      tmodules_tpaid_user: {
        Row: {
          id_paid_user: number;
          id_module: number;
        };
        Insert: {
          id_paid_user: number;
          id_module: number;
        };
        Update: {
          id_paid_user?: number;
          id_module?: number;
        };
      };
      tasks: {
        Row: {
          id_task: number;
          title: string | null;
          description: string | null;
          category: string | null;
          phone_number: number | null;
          status: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id_task?: number;
          title?: string | null;
          description?: string | null;
          category?: string | null;
          phone_number?: number | null;
          status?: boolean | null;
          created_at?: string | null;
        };
        Update: {
          id_task?: number;
          title?: string | null;
          description?: string | null;
          category?: string | null;
          phone_number?: number | null;
          status?: boolean | null;
          created_at?: string | null;
        };
      };
      call_history: {
        Row: {
          id_call: number;
          phone_number: number | null;
          status: boolean | null;
          created_at: string | null;
          transcription: any | null;
          total_call_time: string | null;
        };
        Insert: {
          id_call?: number;
          phone_number?: number | null;
          status?: boolean | null;
          created_at?: string | null;
          transcription?: any | null;
          total_call_time?: string | null;
        };
        Update: {
          id_call?: number;
          phone_number?: number | null;
          status?: boolean | null;
          created_at?: string | null;
          transcription?: any | null;
          total_call_time?: string | null;
        };
      };
      message_history: {
        Row: {
          id_message: number;
          phone_number: string | null;
          content: string | null;
          created_at: string | null;
        };
        Insert: {
          id_message?: number;
          phone_number?: string | null;
          content?: string | null;
          created_at?: string | null;
        };
        Update: {
          id_message?: number;
          phone_number?: string | null;
          content?: string | null;
          created_at?: string | null;
        };
      };
    };
  };
}