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
      business_profiles: {
        Row: {
          billing_address: Json | null
          company_name: string
          company_size: string | null
          created_at: string | null
          description: string | null
          id: string
          industry: string[] | null
          logo_url: string | null
          payment_methods: Json | null
          social_links: Json | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          billing_address?: Json | null
          company_name: string
          company_size?: string | null
          created_at?: string | null
          description?: string | null
          id: string
          industry?: string[] | null
          logo_url?: string | null
          payment_methods?: Json | null
          social_links?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          billing_address?: Json | null
          company_name?: string
          company_size?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          industry?: string[] | null
          logo_url?: string | null
          payment_methods?: Json | null
          social_links?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_profiles: {
        Row: {
          availability: Json | null
          bio: string | null
          created_at: string | null
          currency: Database["public"]["Enums"]["currency"] | null
          engagement_rate: Json | null
          followers_count: Json | null
          hourly_rate: number | null
          id: string
          is_verified: boolean | null
          location: string | null
          portfolio_urls: string[] | null
          social_links: Json | null
          specialization: string[] | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          availability?: Json | null
          bio?: string | null
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency"] | null
          engagement_rate?: Json | null
          followers_count?: Json | null
          hourly_rate?: number | null
          id: string
          is_verified?: boolean | null
          location?: string | null
          portfolio_urls?: string[] | null
          social_links?: Json | null
          specialization?: string[] | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          availability?: Json | null
          bio?: string | null
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency"] | null
          engagement_rate?: Json | null
          followers_count?: Json | null
          hourly_rate?: number | null
          id?: string
          is_verified?: boolean | null
          location?: string | null
          portfolio_urls?: string[] | null
          social_links?: Json | null
          specialization?: string[] | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "influencer_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      login_details: {
        Row: {
          id: string
          ip_address: string | null
          login_method: string
          login_timestamp: string | null
          login_type: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          id?: string
          ip_address?: string | null
          login_method?: string
          login_timestamp?: string | null
          login_type: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          id?: string
          ip_address?: string | null
          login_method?: string
          login_timestamp?: string | null
          login_type?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_requests: {
        Row: {
          attachments: Json | null
          business_id: string
          created_at: string | null
          currency: Database["public"]["Enums"]["currency"] | null
          delivery_date: string | null
          description: string
          id: string
          influencer_id: string
          messages: Json | null
          platform: Database["public"]["Enums"]["social_platform"]
          price: number
          requirements: string | null
          service_id: string | null
          service_type: Database["public"]["Enums"]["service_type"]
          status: Database["public"]["Enums"]["request_status"] | null
          updated_at: string | null
        }
        Insert: {
          attachments?: Json | null
          business_id: string
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency"] | null
          delivery_date?: string | null
          description: string
          id?: string
          influencer_id: string
          messages?: Json | null
          platform: Database["public"]["Enums"]["social_platform"]
          price: number
          requirements?: string | null
          service_id?: string | null
          service_type: Database["public"]["Enums"]["service_type"]
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string | null
        }
        Update: {
          attachments?: Json | null
          business_id?: string
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency"] | null
          delivery_date?: string | null
          description?: string
          id?: string
          influencer_id?: string
          messages?: Json | null
          platform?: Database["public"]["Enums"]["social_platform"]
          price?: number
          requirements?: string | null
          service_id?: string | null
          service_type?: Database["public"]["Enums"]["service_type"]
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_requests_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_requests_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_requests_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          business_id: string
          created_at: string | null
          currency: Database["public"]["Enums"]["currency"] | null
          id: string
          influencer_id: string
          metadata: Json | null
          order_id: string
          payment_date: string | null
          payment_method: string | null
          platform_fee: number
          receipt_url: string | null
          refund_amount: number | null
          refund_reason: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          tax: number | null
          total_amount: number
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          business_id: string
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency"] | null
          id?: string
          influencer_id: string
          metadata?: Json | null
          order_id: string
          payment_date?: string | null
          payment_method?: string | null
          platform_fee: number
          receipt_url?: string | null
          refund_amount?: number | null
          refund_reason?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          tax?: number | null
          total_amount: number
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          business_id?: string
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency"] | null
          id?: string
          influencer_id?: string
          metadata?: Json | null
          order_id?: string
          payment_date?: string | null
          payment_method?: string | null
          platform_fee?: number
          receipt_url?: string | null
          refund_amount?: number | null
          refund_reason?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          tax?: number | null
          total_amount?: number
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      post_metrics: {
        Row: {
          click_through_rate: number | null
          comments: number | null
          conversions: number | null
          created_at: string | null
          demographics: Json | null
          engagement_rate: number | null
          id: string
          impressions: number | null
          last_updated: string | null
          likes: number | null
          platform_metrics: Json | null
          post_id: string
          reach: number | null
          revenue: number | null
          saves: number | null
          shares: number | null
          updated_at: string | null
        }
        Insert: {
          click_through_rate?: number | null
          comments?: number | null
          conversions?: number | null
          created_at?: string | null
          demographics?: Json | null
          engagement_rate?: number | null
          id?: string
          impressions?: number | null
          last_updated?: string | null
          likes?: number | null
          platform_metrics?: Json | null
          post_id: string
          reach?: number | null
          revenue?: number | null
          saves?: number | null
          shares?: number | null
          updated_at?: string | null
        }
        Update: {
          click_through_rate?: number | null
          comments?: number | null
          conversions?: number | null
          created_at?: string | null
          demographics?: Json | null
          engagement_rate?: number | null
          id?: string
          impressions?: number | null
          last_updated?: string | null
          likes?: number | null
          platform_metrics?: Json | null
          post_id?: string
          reach?: number | null
          revenue?: number | null
          saves?: number | null
          shares?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_metrics_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          business_id: string
          content: string | null
          created_at: string | null
          error_message: string | null
          hashtags: string[] | null
          id: string
          influencer_id: string
          is_approved: boolean | null
          media_urls: string[] | null
          mentions: string[] | null
          order_id: string
          platform: Database["public"]["Enums"]["social_platform"]
          platform_post_id: string | null
          platform_post_url: string | null
          post_type: Database["public"]["Enums"]["service_type"]
          published_time: string | null
          scheduled_time: string | null
          status: Database["public"]["Enums"]["post_status"] | null
          updated_at: string | null
        }
        Insert: {
          business_id: string
          content?: string | null
          created_at?: string | null
          error_message?: string | null
          hashtags?: string[] | null
          id?: string
          influencer_id: string
          is_approved?: boolean | null
          media_urls?: string[] | null
          mentions?: string[] | null
          order_id: string
          platform: Database["public"]["Enums"]["social_platform"]
          platform_post_id?: string | null
          platform_post_url?: string | null
          post_type: Database["public"]["Enums"]["service_type"]
          published_time?: string | null
          scheduled_time?: string | null
          status?: Database["public"]["Enums"]["post_status"] | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          content?: string | null
          created_at?: string | null
          error_message?: string | null
          hashtags?: string[] | null
          id?: string
          influencer_id?: string
          is_approved?: boolean | null
          media_urls?: string[] | null
          mentions?: string[] | null
          order_id?: string
          platform?: Database["public"]["Enums"]["social_platform"]
          platform_post_id?: string | null
          platform_post_url?: string | null
          post_type?: Database["public"]["Enums"]["service_type"]
          published_time?: string | null
          scheduled_time?: string | null
          status?: Database["public"]["Enums"]["post_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          charts: Json | null
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          metrics: Json
          start_date: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          charts?: Json | null
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          metrics: Json
          start_date: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          charts?: Json | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          metrics?: Json
          start_date?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          add_ons: Json | null
          created_at: string | null
          currency: Database["public"]["Enums"]["currency"] | null
          delivery_time_days: number | null
          description: string | null
          id: string
          influencer_id: string
          is_active: boolean | null
          platform: Database["public"]["Enums"]["social_platform"]
          price: number
          requirements: string | null
          revisions: number | null
          service_type: Database["public"]["Enums"]["service_type"]
          title: string
          updated_at: string | null
        }
        Insert: {
          add_ons?: Json | null
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency"] | null
          delivery_time_days?: number | null
          description?: string | null
          id?: string
          influencer_id: string
          is_active?: boolean | null
          platform: Database["public"]["Enums"]["social_platform"]
          price: number
          requirements?: string | null
          revisions?: number | null
          service_type: Database["public"]["Enums"]["service_type"]
          title: string
          updated_at?: string | null
        }
        Update: {
          add_ons?: Json | null
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency"] | null
          delivery_time_days?: number | null
          description?: string | null
          id?: string
          influencer_id?: string
          is_active?: boolean | null
          platform?: Database["public"]["Enums"]["social_platform"]
          price?: number
          requirements?: string | null
          revisions?: number | null
          service_type?: Database["public"]["Enums"]["service_type"]
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      social_accounts: {
        Row: {
          access_token: string | null
          created_at: string | null
          id: string
          is_connected: boolean | null
          metadata: Json | null
          platform: Database["public"]["Enums"]["social_platform"]
          platform_user_id: string | null
          refresh_token: string | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string
          username: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          id?: string
          is_connected?: boolean | null
          metadata?: Json | null
          platform: Database["public"]["Enums"]["social_platform"]
          platform_user_id?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id: string
          username: string
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          id?: string
          is_connected?: boolean | null
          metadata?: Json | null
          platform?: Database["public"]["Enums"]["social_platform"]
          platform_user_id?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          profile_image_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          phone?: string | null
          profile_image_url?: string | null
          role: Database["public"]["Enums"]["user_role"]
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          profile_image_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          settings?: Json | null
          updated_at?: string | null
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
      currency: "INR" | "USD" | "EUR" | "GBP"
      payment_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "refunded"
      post_status: "scheduled" | "published" | "failed"
      request_status: "pending" | "approved" | "rejected" | "completed" | "paid"
      service_type: "post" | "story" | "reel" | "video" | "short"
      social_platform:
        | "instagram"
        | "facebook"
        | "twitter"
        | "youtube"
        | "tiktok"
      user_role: "admin" | "business" | "influencer"
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
