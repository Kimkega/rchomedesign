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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_type: Database["public"]["Enums"]["appointment_type"]
          assigned_to: string | null
          created_at: string
          email: string
          end_at: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          slot_id: string | null
          start_at: string
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          appointment_type?: Database["public"]["Enums"]["appointment_type"]
          assigned_to?: string | null
          created_at?: string
          email: string
          end_at: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          slot_id?: string | null
          start_at: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          appointment_type?: Database["public"]["Enums"]["appointment_type"]
          assigned_to?: string | null
          created_at?: string
          email?: string
          end_at?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          slot_id?: string | null
          start_at?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "availability_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      availability_slots: {
        Row: {
          capacity: number
          created_at: string
          end_at: string
          id: string
          notes: string | null
          start_at: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          end_at: string
          id?: string
          notes?: string | null
          start_at: string
        }
        Update: {
          capacity?: number
          created_at?: string
          end_at?: string
          id?: string
          notes?: string | null
          start_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          body: string | null
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          images: Json
          published: boolean
          published_at: string | null
          scheduled_publish_at: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          images?: Json
          published?: boolean
          published_at?: string | null
          scheduled_publish_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          images?: Json
          published?: boolean
          published_at?: string | null
          scheduled_publish_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      faq_items: {
        Row: {
          answer: string
          created_at: string
          id: string
          published: boolean
          question: string
          scheduled_publish_at: string | null
          sort_order: number
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          published?: boolean
          question: string
          scheduled_publish_at?: string | null
          sort_order?: number
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          published?: boolean
          question?: string
          scheduled_publish_at?: string | null
          sort_order?: number
        }
        Relationships: []
      }
      floor_plans: {
        Row: {
          baths: number | null
          beds: number | null
          category: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          external_url: string | null
          id: string
          images: Json
          name: string
          pdf_url: string | null
          price: number | null
          published: boolean
          scheduled_publish_at: string | null
          slug: string
          sort_order: number
          sqft: number | null
          tagline: string | null
          updated_at: string
        }
        Insert: {
          baths?: number | null
          beds?: number | null
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          external_url?: string | null
          id?: string
          images?: Json
          name: string
          pdf_url?: string | null
          price?: number | null
          published?: boolean
          scheduled_publish_at?: string | null
          slug: string
          sort_order?: number
          sqft?: number | null
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          baths?: number | null
          beds?: number | null
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          external_url?: string | null
          id?: string
          images?: Json
          name?: string
          pdf_url?: string | null
          price?: number | null
          published?: boolean
          scheduled_publish_at?: string | null
          slug?: string
          sort_order?: number
          sqft?: number | null
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gallery_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          alt_text: string | null
          caption: string | null
          category_id: string | null
          created_at: string
          featured: boolean
          id: string
          image_url: string
          sort_order: number
          source_url: string | null
          title: string | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          category_id?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          image_url: string
          sort_order?: number
          source_url?: string | null
          title?: string | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          category_id?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          image_url?: string
          sort_order?: number
          source_url?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_images_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "gallery_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiries: {
        Row: {
          assigned_to: string | null
          budget: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          project_type: string | null
          status: Database["public"]["Enums"]["inquiry_status"]
          timeline: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          budget?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          project_type?: string | null
          status?: Database["public"]["Enums"]["inquiry_status"]
          timeline?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          budget?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          project_type?: string | null
          status?: Database["public"]["Enums"]["inquiry_status"]
          timeline?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      inquiry_messages: {
        Row: {
          body: string
          created_at: string
          id: string
          inquiry_id: string
          internal: boolean
          sender_id: string | null
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          inquiry_id: string
          internal?: boolean
          sender_id?: string | null
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          inquiry_id?: string
          internal?: boolean
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inquiry_messages_inquiry_id_fkey"
            columns: ["inquiry_id"]
            isOneToOne: false
            referencedRelation: "inquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author: string
          created_at: string
          featured: boolean
          id: string
          photo_url: string | null
          quote: string
          rating: number | null
          role: string | null
          sort_order: number
        }
        Insert: {
          author: string
          created_at?: string
          featured?: boolean
          id?: string
          photo_url?: string | null
          quote: string
          rating?: number | null
          role?: string | null
          sort_order?: number
        }
        Update: {
          author?: string
          created_at?: string
          featured?: boolean
          id?: string
          photo_url?: string | null
          quote?: string
          rating?: number | null
          role?: string | null
          sort_order?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_designer: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "designer" | "client"
      appointment_status:
        | "pending"
        | "confirmed"
        | "completed"
        | "cancelled"
        | "no_show"
      appointment_type: "discovery_call" | "consultation" | "walkthrough"
      inquiry_status: "new" | "in_review" | "quoted" | "won" | "lost"
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
      app_role: ["admin", "designer", "client"],
      appointment_status: [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
        "no_show",
      ],
      appointment_type: ["discovery_call", "consultation", "walkthrough"],
      inquiry_status: ["new", "in_review", "quoted", "won", "lost"],
    },
  },
} as const
