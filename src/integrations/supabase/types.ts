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
      admins: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      appreciations: {
        Row: {
          donation_id: string
          id: string
          message: string
          read_at: string | null
          recipient_id: string
          sender_id: string
          sent_at: string
        }
        Insert: {
          donation_id: string
          id?: string
          message: string
          read_at?: string | null
          recipient_id: string
          sender_id: string
          sent_at?: string
        }
        Update: {
          donation_id?: string
          id?: string
          message?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appreciations_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          details: Json | null
          id: string
          target: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          details?: Json | null
          id?: string
          target?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          details?: Json | null
          id?: string
          target?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: string
          id: string
          published_at: string | null
          title: string
        }
        Insert: {
          author_id?: string | null
          content: string
          id?: string
          published_at?: string | null
          title: string
        }
        Update: {
          author_id?: string | null
          content?: string
          id?: string
          published_at?: string | null
          title?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          email: string
          id: string
          message: string
          name: string
          subject: string | null
          submitted_at: string | null
        }
        Insert: {
          email: string
          id?: string
          message: string
          name: string
          subject?: string | null
          submitted_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          message?: string
          name?: string
          subject?: string | null
          submitted_at?: string | null
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          created_at: string
          donation_type: string | null
          id: string
          notes: string | null
          payment_method: string | null
          transaction_reference: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          donation_type?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          transaction_reference?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          donation_type?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          transaction_reference?: string | null
          user_id?: string
        }
        Relationships: []
      }
      donor_thank_yous: {
        Row: {
          id: string
          message: string
          name: string
          org: string | null
          submitted_at: string | null
        }
        Insert: {
          id?: string
          message: string
          name: string
          org?: string | null
          submitted_at?: string | null
        }
        Update: {
          id?: string
          message?: string
          name?: string
          org?: string | null
          submitted_at?: string | null
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          email: string
          event_id: string | null
          id: string
          name: string
          registered_at: string | null
        }
        Insert: {
          email: string
          event_id?: string | null
          id?: string
          name: string
          registered_at?: string | null
        }
        Update: {
          email?: string
          event_id?: string | null
          id?: string
          name?: string
          registered_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          event_date: string
          id: string
          location: string
          organizer: string | null
          registration_required: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          event_date: string
          id?: string
          location: string
          organizer?: string | null
          registration_required?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          event_date?: string
          id?: string
          location?: string
          organizer?: string | null
          registration_required?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      media_photos: {
        Row: {
          caption: string | null
          id: string
          uploaded_at: string | null
          url: string
        }
        Insert: {
          caption?: string | null
          id?: string
          uploaded_at?: string | null
          url: string
        }
        Update: {
          caption?: string | null
          id?: string
          uploaded_at?: string | null
          url?: string
        }
        Relationships: []
      }
      media_videos: {
        Row: {
          id: string
          title: string | null
          uploaded_at: string | null
          url: string
        }
        Insert: {
          id?: string
          title?: string | null
          uploaded_at?: string | null
          url: string
        }
        Update: {
          id?: string
          title?: string | null
          uploaded_at?: string | null
          url?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          subscribed_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          subscribed_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          subscribed_at?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action: string
          attempts: number
          created_at: string
          id: string
          identifier: string
          window_start: string
        }
        Insert: {
          action: string
          attempts?: number
          created_at?: string
          id?: string
          identifier: string
          window_start?: string
        }
        Update: {
          action?: string
          attempts?: number
          created_at?: string
          id?: string
          identifier?: string
          window_start?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content: string
          id: string
          section: string
          updated_at: string | null
        }
        Insert: {
          content: string
          id?: string
          section: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          id?: string
          section?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          role: string
          user_id: string
        }
        Insert: {
          role: string
          user_id: string
        }
        Update: {
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_audit_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_user_email: {
        Args: { user_uuid: string }
        Returns: string
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
