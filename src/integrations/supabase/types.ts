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
      cities: {
        Row: {
          id: number
          name: string
          state_id: number
        }
        Insert: {
          id?: number
          name: string
          state_id: number
        }
        Update: {
          id?: number
          name?: string
          state_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "cities_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          code: string | null
          id: number
          name: string
        }
        Insert: {
          code?: string | null
          id?: number
          name: string
        }
        Update: {
          code?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      global_notifications: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          message: string
          scheduled_for: string | null
          sent_at: string | null
          status: string | null
          title: string
          user_type: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          message: string
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          title: string
          user_type: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          message?: string
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          title?: string
          user_type?: string
        }
        Relationships: []
      }
      hashtags: {
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
      influencer_analytics: {
        Row: {
          avg_comments: number | null
          avg_likes: number | null
          avg_shares: number | null
          avg_views: number | null
          created_at: string | null
          engagement_rate: number | null
          fake_followers_percent: number | null
          id: string
          influencer_id: string
          total_campaigns: number | null
          updated_at: string | null
        }
        Insert: {
          avg_comments?: number | null
          avg_likes?: number | null
          avg_shares?: number | null
          avg_views?: number | null
          created_at?: string | null
          engagement_rate?: number | null
          fake_followers_percent?: number | null
          id?: string
          influencer_id: string
          total_campaigns?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_comments?: number | null
          avg_likes?: number | null
          avg_shares?: number | null
          avg_views?: number | null
          created_at?: string | null
          engagement_rate?: number | null
          fake_followers_percent?: number | null
          id?: string
          influencer_id?: string
          total_campaigns?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      influencer_hashtags: {
        Row: {
          hashtag_id: number
          influencer_id: string
        }
        Insert: {
          hashtag_id: number
          influencer_id: string
        }
        Update: {
          hashtag_id?: number
          influencer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "influencer_hashtags_hashtag_id_fkey"
            columns: ["hashtag_id"]
            isOneToOne: false
            referencedRelation: "hashtags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "influencer_hashtags_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_monthly_analytics: {
        Row: {
          comments: number | null
          created_at: string | null
          earnings: number | null
          engagement_rate: number | null
          id: string
          influencer_id: string
          likes: number | null
          month: number
          orders: number | null
          shares: number | null
          views: number | null
          year: number
        }
        Insert: {
          comments?: number | null
          created_at?: string | null
          earnings?: number | null
          engagement_rate?: number | null
          id?: string
          influencer_id: string
          likes?: number | null
          month: number
          orders?: number | null
          shares?: number | null
          views?: number | null
          year: number
        }
        Update: {
          comments?: number | null
          created_at?: string | null
          earnings?: number | null
          engagement_rate?: number | null
          id?: string
          influencer_id?: string
          likes?: number | null
          month?: number
          orders?: number | null
          shares?: number | null
          views?: number | null
          year?: number
        }
        Relationships: []
      }
      influencer_packages: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          influencer_id: string
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          platforms: string[] | null
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          influencer_id: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          platforms?: string[] | null
          price?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          influencer_id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          platforms?: string[] | null
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      influencer_pricing: {
        Row: {
          created_at: string | null
          id: string
          influencer_id: string
          is_active: boolean | null
          platform: string
          price: number
          service_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          influencer_id: string
          is_active?: boolean | null
          platform: string
          price?: number
          service_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          influencer_id?: string
          is_active?: boolean | null
          platform?: string
          price?: number
          service_type?: string
          updated_at?: string | null
        }
        Relationships: []
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
      influencers: {
        Row: {
          bio: string | null
          city_id: number | null
          country_id: number | null
          created_at: string | null
          engagement_rate: number | null
          followers_facebook: number | null
          followers_instagram: number | null
          followers_twitter: number | null
          followers_youtube: number | null
          id: string
          image_url: string | null
          name: string
          niche_id: number | null
          state_id: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          bio?: string | null
          city_id?: number | null
          country_id?: number | null
          created_at?: string | null
          engagement_rate?: number | null
          followers_facebook?: number | null
          followers_instagram?: number | null
          followers_twitter?: number | null
          followers_youtube?: number | null
          id?: string
          image_url?: string | null
          name: string
          niche_id?: number | null
          state_id?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          bio?: string | null
          city_id?: number | null
          country_id?: number | null
          created_at?: string | null
          engagement_rate?: number | null
          followers_facebook?: number | null
          followers_instagram?: number | null
          followers_twitter?: number | null
          followers_youtube?: number | null
          id?: string
          image_url?: string | null
          name?: string
          niche_id?: number | null
          state_id?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "influencers_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "influencers_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "influencers_niche_id_fkey"
            columns: ["niche_id"]
            isOneToOne: false
            referencedRelation: "niches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "influencers_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
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
      maintenance_settings: {
        Row: {
          id: string
          is_enabled: boolean | null
          last_modified_at: string | null
          last_modified_by: string | null
          message: string | null
          whitelisted_ips: string[] | null
        }
        Insert: {
          id?: string
          is_enabled?: boolean | null
          last_modified_at?: string | null
          last_modified_by?: string | null
          message?: string | null
          whitelisted_ips?: string[] | null
        }
        Update: {
          id?: string
          is_enabled?: boolean | null
          last_modified_at?: string | null
          last_modified_by?: string | null
          message?: string | null
          whitelisted_ips?: string[] | null
        }
        Relationships: []
      }
      niches: {
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
      onboarding_users: {
        Row: {
          category: string | null
          company: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          social_followers: Json | null
          status: string
          updated_at: string | null
          user_type: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          category?: string | null
          company?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          social_followers?: Json | null
          status?: string
          updated_at?: string | null
          user_type: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          category?: string | null
          company?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          social_followers?: Json | null
          status?: string
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
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
      service_content: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          influencer_id: string
          media_type: string
          media_url: string
          title: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          influencer_id: string
          media_type: string
          media_url: string
          title?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          influencer_id?: string
          media_type?: string
          media_url?: string
          title?: string | null
        }
        Relationships: []
      }
      service_content_metrics: {
        Row: {
          bookmarks: number | null
          comments: number | null
          content_id: string
          id: string
          likes: number | null
          shares: number | null
          updated_at: string | null
          views: number | null
        }
        Insert: {
          bookmarks?: number | null
          comments?: number | null
          content_id: string
          id?: string
          likes?: number | null
          shares?: number | null
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          bookmarks?: number | null
          comments?: number | null
          content_id?: string
          id?: string
          likes?: number | null
          shares?: number | null
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_service_content"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "service_content"
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
      states: {
        Row: {
          country_id: number
          id: number
          name: string
        }
        Insert: {
          country_id: number
          id?: number
          name: string
        }
        Update: {
          country_id?: number
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "states_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
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
      wallet_settings: {
        Row: {
          created_at: string
          id: string
          immediate_withdrawal_charge: number
          is_enabled: boolean
          last_modified_at: string
          last_modified_by: string | null
          max_withdrawal_amount: number
          min_withdrawal_amount: number
          one_day_withdrawal_charge: number
          payment_gateway_settings: Json
          three_day_withdrawal_charge: number
        }
        Insert: {
          created_at?: string
          id?: string
          immediate_withdrawal_charge?: number
          is_enabled?: boolean
          last_modified_at?: string
          last_modified_by?: string | null
          max_withdrawal_amount?: number
          min_withdrawal_amount?: number
          one_day_withdrawal_charge?: number
          payment_gateway_settings?: Json
          three_day_withdrawal_charge?: number
        }
        Update: {
          created_at?: string
          id?: string
          immediate_withdrawal_charge?: number
          is_enabled?: boolean
          last_modified_at?: string
          last_modified_by?: string | null
          max_withdrawal_amount?: number
          min_withdrawal_amount?: number
          one_day_withdrawal_charge?: number
          payment_gateway_settings?: Json
          three_day_withdrawal_charge?: number
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          description: string
          id: string
          metadata: Json
          reference_id: string | null
          transaction_type: Database["public"]["Enums"]["wallet_transaction_type"]
          user_id: string
          wallet_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          description: string
          id?: string
          metadata?: Json
          reference_id?: string | null
          transaction_type: Database["public"]["Enums"]["wallet_transaction_type"]
          user_id: string
          wallet_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string
          id?: string
          metadata?: Json
          reference_id?: string | null
          transaction_type?: Database["public"]["Enums"]["wallet_transaction_type"]
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_withdrawals: {
        Row: {
          amount: number
          amount_after_charge: number
          created_at: string
          expected_arrival: string
          id: string
          payment_details: Json
          payment_method: string
          processed_at: string | null
          service_charge: number
          status: Database["public"]["Enums"]["wallet_withdrawal_status"]
          updated_at: string
          user_id: string
          wallet_id: string
          withdrawal_speed: Database["public"]["Enums"]["withdrawal_speed"]
        }
        Insert: {
          amount: number
          amount_after_charge: number
          created_at?: string
          expected_arrival: string
          id?: string
          payment_details?: Json
          payment_method: string
          processed_at?: string | null
          service_charge: number
          status?: Database["public"]["Enums"]["wallet_withdrawal_status"]
          updated_at?: string
          user_id: string
          wallet_id: string
          withdrawal_speed: Database["public"]["Enums"]["withdrawal_speed"]
        }
        Update: {
          amount?: number
          amount_after_charge?: number
          created_at?: string
          expected_arrival?: string
          id?: string
          payment_details?: Json
          payment_method?: string
          processed_at?: string | null
          service_charge?: number
          status?: Database["public"]["Enums"]["wallet_withdrawal_status"]
          updated_at?: string
          user_id?: string
          wallet_id?: string
          withdrawal_speed?: Database["public"]["Enums"]["withdrawal_speed"]
        }
        Relationships: [
          {
            foreignKeyName: "wallet_withdrawals_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          created_at: string
          currency: Database["public"]["Enums"]["currency"]
          current_balance: number
          id: string
          is_active: boolean
          total_earned: number
          total_withdrawn: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: Database["public"]["Enums"]["currency"]
          current_balance?: number
          id?: string
          is_active?: boolean
          total_earned?: number
          total_withdrawn?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: Database["public"]["Enums"]["currency"]
          current_balance?: number
          id?: string
          is_active?: boolean
          total_earned?: number
          total_withdrawn?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      process_wallet_transaction: {
        Args: {
          p_user_id: string
          p_amount: number
          p_transaction_type: Database["public"]["Enums"]["wallet_transaction_type"]
          p_reference_id: string
          p_description: string
          p_metadata?: Json
        }
        Returns: string
      }
      request_wallet_withdrawal: {
        Args: {
          p_user_id: string
          p_amount: number
          p_withdrawal_speed: Database["public"]["Enums"]["withdrawal_speed"]
          p_payment_method: string
          p_payment_details: Json
        }
        Returns: string
      }
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
      wallet_transaction_type:
        | "deposit"
        | "withdrawal"
        | "order_payment"
        | "order_earning"
        | "refund"
        | "adjustment"
      wallet_withdrawal_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "cancelled"
      withdrawal_speed: "immediate" | "one_day" | "three_days"
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
    Enums: {
      currency: ["INR", "USD", "EUR", "GBP"],
      payment_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "refunded",
      ],
      post_status: ["scheduled", "published", "failed"],
      request_status: ["pending", "approved", "rejected", "completed", "paid"],
      service_type: ["post", "story", "reel", "video", "short"],
      social_platform: [
        "instagram",
        "facebook",
        "twitter",
        "youtube",
        "tiktok",
      ],
      user_role: ["admin", "business", "influencer"],
      wallet_transaction_type: [
        "deposit",
        "withdrawal",
        "order_payment",
        "order_earning",
        "refund",
        "adjustment",
      ],
      wallet_withdrawal_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "cancelled",
      ],
      withdrawal_speed: ["immediate", "one_day", "three_days"],
    },
  },
} as const
