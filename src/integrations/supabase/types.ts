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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      academy_case_studies: {
        Row: {
          category: Database["public"]["Enums"]["academy_category"]
          created_at: string
          diagnosis: string | null
          id: string
          lessons_learned: string | null
          outcome: string | null
          patient_background: string | null
          provider_id: string
          published_at: string | null
          status: Database["public"]["Enums"]["academy_content_status"]
          summary: string | null
          tags: string[] | null
          title: string
          treatment: string | null
          updated_at: string
          view_count: number | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["academy_category"]
          created_at?: string
          diagnosis?: string | null
          id?: string
          lessons_learned?: string | null
          outcome?: string | null
          patient_background?: string | null
          provider_id: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["academy_content_status"]
          summary?: string | null
          tags?: string[] | null
          title: string
          treatment?: string | null
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          category?: Database["public"]["Enums"]["academy_category"]
          created_at?: string
          diagnosis?: string | null
          id?: string
          lessons_learned?: string | null
          outcome?: string | null
          patient_background?: string | null
          provider_id?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["academy_content_status"]
          summary?: string | null
          tags?: string[] | null
          title?: string
          treatment?: string | null
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "academy_case_studies_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      academy_publications: {
        Row: {
          abstract: string | null
          category: Database["public"]["Enums"]["academy_category"]
          citation_count: number | null
          co_authors: string[] | null
          content: string | null
          created_at: string
          doi: string | null
          download_count: number | null
          id: string
          journal_name: string | null
          pdf_url: string | null
          provider_id: string
          published_at: string | null
          status: Database["public"]["Enums"]["academy_content_status"]
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          abstract?: string | null
          category?: Database["public"]["Enums"]["academy_category"]
          citation_count?: number | null
          co_authors?: string[] | null
          content?: string | null
          created_at?: string
          doi?: string | null
          download_count?: number | null
          id?: string
          journal_name?: string | null
          pdf_url?: string | null
          provider_id: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["academy_content_status"]
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          abstract?: string | null
          category?: Database["public"]["Enums"]["academy_category"]
          citation_count?: number | null
          co_authors?: string[] | null
          content?: string | null
          created_at?: string
          doi?: string | null
          download_count?: number | null
          id?: string
          journal_name?: string | null
          pdf_url?: string | null
          provider_id?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["academy_content_status"]
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "academy_publications_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      academy_video_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
          video_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          video_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "academy_video_comments_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "academy_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      academy_video_likes: {
        Row: {
          created_at: string
          id: string
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "academy_video_likes_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "academy_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      academy_videos: {
        Row: {
          category: Database["public"]["Enums"]["academy_category"]
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          like_count: number | null
          provider_id: string
          published_at: string | null
          status: Database["public"]["Enums"]["academy_content_status"]
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string
          view_count: number | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["academy_category"]
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          like_count?: number | null
          provider_id: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["academy_content_status"]
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url: string
          view_count?: number | null
        }
        Update: {
          category?: Database["public"]["Enums"]["academy_category"]
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          like_count?: number | null
          provider_id?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["academy_content_status"]
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "academy_videos_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_logs: {
        Row: {
          activity_type: string
          calories_burned: number | null
          created_at: string
          duration_minutes: number | null
          heart_rate_avg: number | null
          id: string
          intensity: string | null
          logged_at: string
          notes: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          calories_burned?: number | null
          created_at?: string
          duration_minutes?: number | null
          heart_rate_avg?: number | null
          id?: string
          intensity?: string | null
          logged_at?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          calories_burned?: number | null
          created_at?: string
          duration_minutes?: number | null
          heart_rate_avg?: number | null
          id?: string
          intensity?: string | null
          logged_at?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string | null
          doctor_notes_internal: string | null
          id: string
          lab_results_url: string | null
          notes: string | null
          outcome_summary: string | null
          patient_id: string
          provider_id: string
          status: Database["public"]["Enums"]["appointment_status"] | null
          symptom_intake_id: string | null
          updated_at: string | null
          visit_type: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string | null
          doctor_notes_internal?: string | null
          id?: string
          lab_results_url?: string | null
          notes?: string | null
          outcome_summary?: string | null
          patient_id: string
          provider_id: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          symptom_intake_id?: string | null
          updated_at?: string | null
          visit_type?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string | null
          doctor_notes_internal?: string | null
          id?: string
          lab_results_url?: string | null
          notes?: string | null
          outcome_summary?: string | null
          patient_id?: string
          provider_id?: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          symptom_intake_id?: string | null
          updated_at?: string | null
          visit_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_symptom_intake_id_fkey"
            columns: ["symptom_intake_id"]
            isOneToOne: false
            referencedRelation: "symptom_intakes"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      availability_slots: {
        Row: {
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean | null
          provider_id: string
          slot_duration_minutes: number | null
          start_time: string
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean | null
          provider_id: string
          slot_duration_minutes?: number | null
          start_time: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean | null
          provider_id?: string
          slot_duration_minutes?: number | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_slots_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      community_follows: {
        Row: {
          created_at: string | null
          follower_user_id: string
          following_provider_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_user_id: string
          following_provider_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_user_id?: string
          following_provider_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_follows_following_provider_id_fkey"
            columns: ["following_provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          like_count: number | null
          parent_comment_id: string | null
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          like_count?: number | null
          parent_comment_id?: string | null
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          like_count?: number | null
          parent_comment_id?: string | null
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "community_post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_saves: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_saves_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          comment_count: number | null
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          is_pinned: boolean | null
          like_count: number | null
          post_type: string
          provider_id: string
          share_count: number | null
          updated_at: string | null
        }
        Insert: {
          comment_count?: number | null
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_pinned?: boolean | null
          like_count?: number | null
          post_type?: string
          provider_id: string
          share_count?: number | null
          updated_at?: string | null
        }
        Update: {
          comment_count?: number | null
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_pinned?: boolean | null
          like_count?: number | null
          post_type?: string
          provider_id?: string
          share_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      community_stories: {
        Row: {
          caption: string | null
          created_at: string | null
          expires_at: string
          id: string
          image_url: string
          provider_id: string
          view_count: number | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          expires_at?: string
          id?: string
          image_url: string
          provider_id: string
          view_count?: number | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          expires_at?: string
          id?: string
          image_url?: string
          provider_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "community_stories_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      community_story_views: {
        Row: {
          id: string
          story_id: string
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          id?: string
          story_id: string
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          id?: string
          story_id?: string
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_story_views_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "community_stories"
            referencedColumns: ["id"]
          },
        ]
      }
      consents: {
        Row: {
          case_id: string | null
          created_at: string | null
          expires_at: string | null
          granted_at: string | null
          id: string
          is_active: boolean | null
          patient_id: string
          provider_id: string
          revoked_at: string | null
          scope: string
          updated_at: string | null
        }
        Insert: {
          case_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          granted_at?: string | null
          id?: string
          is_active?: boolean | null
          patient_id: string
          provider_id: string
          revoked_at?: string | null
          scope: string
          updated_at?: string | null
        }
        Update: {
          case_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          granted_at?: string | null
          id?: string
          is_active?: boolean | null
          patient_id?: string
          provider_id?: string
          revoked_at?: string | null
          scope?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consents_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_access_logs: {
        Row: {
          access_type: string
          accessed_at: string
          doctor_user_id: string
          id: string
          ip_address: string | null
          patient_user_id: string
          resource_id: string | null
          resource_type: string
        }
        Insert: {
          access_type: string
          accessed_at?: string
          doctor_user_id: string
          id?: string
          ip_address?: string | null
          patient_user_id: string
          resource_id?: string | null
          resource_type: string
        }
        Update: {
          access_type?: string
          accessed_at?: string
          doctor_user_id?: string
          id?: string
          ip_address?: string | null
          patient_user_id?: string
          resource_id?: string | null
          resource_type?: string
        }
        Relationships: []
      }
      doctor_advisor_agreements: {
        Row: {
          availability_notes: string | null
          bio: string | null
          created_at: string
          id: string
          languages: string[] | null
          navigation_only_acknowledged: boolean
          no_patient_relationship_acknowledged: boolean
          provider_id: string
          public_listing_opted_in: boolean
          terms_accepted: boolean
          terms_accepted_at: string | null
          unpaid_volunteer_acknowledged: boolean
          updated_at: string
        }
        Insert: {
          availability_notes?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          languages?: string[] | null
          navigation_only_acknowledged?: boolean
          no_patient_relationship_acknowledged?: boolean
          provider_id: string
          public_listing_opted_in?: boolean
          terms_accepted?: boolean
          terms_accepted_at?: string | null
          unpaid_volunteer_acknowledged?: boolean
          updated_at?: string
        }
        Update: {
          availability_notes?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          languages?: string[] | null
          navigation_only_acknowledged?: boolean
          no_patient_relationship_acknowledged?: boolean
          provider_id?: string
          public_listing_opted_in?: boolean
          terms_accepted?: boolean
          terms_accepted_at?: string | null
          unpaid_volunteer_acknowledged?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctor_advisor_agreements_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: true
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      examary_reports: {
        Row: {
          created_at: string | null
          generated_at: string | null
          id: string
          is_shared: boolean | null
          pdf_url: string | null
          questions_for_doctor: string[] | null
          relevant_history: Json | null
          risk_flags: string[] | null
          share_expires_at: string | null
          share_token: string | null
          suggested_exams: string[] | null
          summary: string | null
          symptom_timeline: Json | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          generated_at?: string | null
          id?: string
          is_shared?: boolean | null
          pdf_url?: string | null
          questions_for_doctor?: string[] | null
          relevant_history?: Json | null
          risk_flags?: string[] | null
          share_expires_at?: string | null
          share_token?: string | null
          suggested_exams?: string[] | null
          summary?: string | null
          symptom_timeline?: Json | null
          title?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          generated_at?: string | null
          id?: string
          is_shared?: boolean | null
          pdf_url?: string | null
          questions_for_doctor?: string[] | null
          relevant_history?: Json | null
          risk_flags?: string[] | null
          share_expires_at?: string | null
          share_token?: string | null
          suggested_exams?: string[] | null
          summary?: string | null
          symptom_timeline?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      health_files: {
        Row: {
          activity_level: string | null
          alcohol_consumption: string | null
          blood_pressure_diastolic: number | null
          blood_pressure_systolic: number | null
          created_at: string | null
          date_of_birth: string | null
          height_cm: number | null
          id: string
          onboarding_completed: boolean | null
          onboarding_step: number | null
          sex: string | null
          smoking_status: string | null
          updated_at: string | null
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          activity_level?: string | null
          alcohol_consumption?: string | null
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          created_at?: string | null
          date_of_birth?: string | null
          height_cm?: number | null
          id?: string
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          sex?: string | null
          smoking_status?: string | null
          updated_at?: string | null
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          activity_level?: string | null
          alcohol_consumption?: string | null
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          created_at?: string | null
          date_of_birth?: string | null
          height_cm?: number | null
          id?: string
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          sex?: string | null
          smoking_status?: string | null
          updated_at?: string | null
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      insurance_behavioral_logs: {
        Row: {
          compliance_delta: number | null
          created_at: string | null
          id: string
          log_type: string
          logged_at: string | null
          member_id: string
          notes: string | null
        }
        Insert: {
          compliance_delta?: number | null
          created_at?: string | null
          id?: string
          log_type: string
          logged_at?: string | null
          member_id: string
          notes?: string | null
        }
        Update: {
          compliance_delta?: number | null
          created_at?: string | null
          id?: string
          log_type?: string
          logged_at?: string | null
          member_id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_behavioral_logs_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "insurance_members"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_claims: {
        Row: {
          amount: number
          claim_code: string
          claim_type: string
          created_at: string | null
          diagnosis_code: string | null
          diagnosis_description: string | null
          id: string
          member_id: string
          notes: string | null
          org_id: string
          resolved_at: string | null
          status: string | null
          submitted_at: string | null
        }
        Insert: {
          amount: number
          claim_code: string
          claim_type: string
          created_at?: string | null
          diagnosis_code?: string | null
          diagnosis_description?: string | null
          id?: string
          member_id: string
          notes?: string | null
          org_id: string
          resolved_at?: string | null
          status?: string | null
          submitted_at?: string | null
        }
        Update: {
          amount?: number
          claim_code?: string
          claim_type?: string
          created_at?: string | null
          diagnosis_code?: string | null
          diagnosis_description?: string | null
          id?: string
          member_id?: string
          notes?: string | null
          org_id?: string
          resolved_at?: string | null
          status?: string | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_claims_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "insurance_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_claims_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "insurance_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_cost_metrics: {
        Row: {
          chronic_stabilization_rate: number | null
          claims_reduction_pct: number | null
          created_at: string | null
          er_cost_saved: number | null
          er_visits_avoided: number | null
          high_risk_count: number | null
          id: string
          member_count: number | null
          org_id: string
          period_month: string
          predicted_claims_cost: number | null
          total_claims_cost: number | null
        }
        Insert: {
          chronic_stabilization_rate?: number | null
          claims_reduction_pct?: number | null
          created_at?: string | null
          er_cost_saved?: number | null
          er_visits_avoided?: number | null
          high_risk_count?: number | null
          id?: string
          member_count?: number | null
          org_id: string
          period_month: string
          predicted_claims_cost?: number | null
          total_claims_cost?: number | null
        }
        Update: {
          chronic_stabilization_rate?: number | null
          claims_reduction_pct?: number | null
          created_at?: string | null
          er_cost_saved?: number | null
          er_visits_avoided?: number | null
          high_risk_count?: number | null
          id?: string
          member_count?: number | null
          org_id?: string
          period_month?: string
          predicted_claims_cost?: number | null
          total_claims_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_cost_metrics_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "insurance_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_data_consents: {
        Row: {
          consent_chronic_conditions: boolean
          consent_claims_summary: boolean
          consent_risk_scores: boolean
          consent_wearable_trends: boolean
          consented_at: string
          created_at: string
          id: string
          is_active: boolean
          org_id: string
          revoked_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          consent_chronic_conditions?: boolean
          consent_claims_summary?: boolean
          consent_risk_scores?: boolean
          consent_wearable_trends?: boolean
          consented_at?: string
          created_at?: string
          id?: string
          is_active?: boolean
          org_id: string
          revoked_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          consent_chronic_conditions?: boolean
          consent_claims_summary?: boolean
          consent_risk_scores?: boolean
          consent_wearable_trends?: boolean
          consented_at?: string
          created_at?: string
          id?: string
          is_active?: boolean
          org_id?: string
          revoked_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_data_consents_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "insurance_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_members: {
        Row: {
          chronic_conditions: string[] | null
          compliance_score: number | null
          created_at: string | null
          date_of_birth: string | null
          er_visits_ytd: number | null
          full_name: string
          gender: string | null
          id: string
          is_active: boolean | null
          last_claim_date: string | null
          member_code: string
          org_id: string
          policy_end: string | null
          policy_start: string | null
          policy_type: string | null
          risk_category: string | null
          risk_score: number | null
          stability_score: number | null
          total_claims_amount: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          chronic_conditions?: string[] | null
          compliance_score?: number | null
          created_at?: string | null
          date_of_birth?: string | null
          er_visits_ytd?: number | null
          full_name: string
          gender?: string | null
          id?: string
          is_active?: boolean | null
          last_claim_date?: string | null
          member_code: string
          org_id: string
          policy_end?: string | null
          policy_start?: string | null
          policy_type?: string | null
          risk_category?: string | null
          risk_score?: number | null
          stability_score?: number | null
          total_claims_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          chronic_conditions?: string[] | null
          compliance_score?: number | null
          created_at?: string | null
          date_of_birth?: string | null
          er_visits_ytd?: number | null
          full_name?: string
          gender?: string | null
          id?: string
          is_active?: boolean | null
          last_claim_date?: string | null
          member_code?: string
          org_id?: string
          policy_end?: string | null
          policy_start?: string | null
          policy_type?: string | null
          risk_category?: string | null
          risk_score?: number | null
          stability_score?: number | null
          total_claims_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "insurance_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_org_members: {
        Row: {
          created_at: string | null
          id: string
          org_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          org_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          org_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_org_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "insurance_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_organizations: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      insurance_risk_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          description: string | null
          id: string
          is_resolved: boolean | null
          member_id: string
          org_id: string
          resolved_at: string | null
          resolved_by: string | null
          severity: string | null
          title: string
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_resolved?: boolean | null
          member_id: string
          org_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          title: string
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_resolved?: boolean | null
          member_id?: string
          org_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_risk_alerts_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "insurance_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_risk_alerts_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "insurance_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      interest_expressions: {
        Row: {
          city: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_verified: boolean | null
          organization_name: string | null
          phone: string | null
          provider_type: string
          reason: string | null
          signature_date: string
          specialty: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          is_verified?: boolean | null
          organization_name?: string | null
          phone?: string | null
          provider_type: string
          reason?: string | null
          signature_date?: string
          specialty?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_verified?: boolean | null
          organization_name?: string | null
          phone?: string | null
          provider_type?: string
          reason?: string | null
          signature_date?: string
          specialty?: string | null
        }
        Relationships: []
      }
      medical_access_grants: {
        Row: {
          created_at: string
          doctor_user_id: string
          expires_at: string | null
          grant_type: string
          granted_at: string
          id: string
          is_active: boolean
          notes: string | null
          patient_user_id: string
        }
        Insert: {
          created_at?: string
          doctor_user_id: string
          expires_at?: string | null
          grant_type?: string
          granted_at?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          patient_user_id: string
        }
        Update: {
          created_at?: string
          doctor_user_id?: string
          expires_at?: string | null
          grant_type?: string
          granted_at?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          patient_user_id?: string
        }
        Relationships: []
      }
      medical_audit_logs: {
        Row: {
          action_type: string
          created_at: string
          id: string
          ip_address: string | null
          metadata: Json | null
          patient_user_id: string
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          patient_user_id: string
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          patient_user_id?: string
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      medical_documents: {
        Row: {
          description: string | null
          document_category: string | null
          file_name: string
          file_type: string | null
          file_url: string
          id: string
          uploaded_at: string | null
          user_id: string
        }
        Insert: {
          description?: string | null
          document_category?: string | null
          file_name: string
          file_type?: string | null
          file_url: string
          id?: string
          uploaded_at?: string | null
          user_id: string
        }
        Update: {
          description?: string | null
          document_category?: string | null
          file_name?: string
          file_type?: string | null
          file_url?: string
          id?: string
          uploaded_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      medical_entries: {
        Row: {
          created_at: string
          description: string | null
          entry_date: string
          entry_type: Database["public"]["Enums"]["medical_entry_type"]
          id: string
          metadata: Json | null
          provider_id: string | null
          provider_name: string | null
          symptom_session_id: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          entry_date?: string
          entry_type: Database["public"]["Enums"]["medical_entry_type"]
          id?: string
          metadata?: Json | null
          provider_id?: string | null
          provider_name?: string | null
          symptom_session_id?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          entry_date?: string
          entry_type?: Database["public"]["Enums"]["medical_entry_type"]
          id?: string
          metadata?: Json | null
          provider_id?: string | null
          provider_name?: string | null
          symptom_session_id?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_entries_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_entries_symptom_session_id_fkey"
            columns: ["symptom_session_id"]
            isOneToOne: false
            referencedRelation: "symptom_intakes"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_entry_attachments: {
        Row: {
          created_at: string
          entry_id: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          entry_id: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          entry_id?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_entry_attachments_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "medical_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_record_shares: {
        Row: {
          expires_at: string | null
          id: string
          is_active: boolean | null
          patient_id: string
          provider_id: string
          shared_at: string | null
        }
        Insert: {
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          patient_id: string
          provider_id: string
          shared_at?: string | null
        }
        Update: {
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          patient_id?: string
          provider_id?: string
          shared_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_record_shares_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_records: {
        Row: {
          allergies: string[] | null
          chronic_conditions: string[] | null
          created_at: string | null
          current_medications: string[] | null
          family_history: Json | null
          id: string
          notes: string | null
          past_surgeries: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          allergies?: string[] | null
          chronic_conditions?: string[] | null
          created_at?: string | null
          current_medications?: string[] | null
          family_history?: Json | null
          id?: string
          notes?: string | null
          past_surgeries?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          allergies?: string[] | null
          chronic_conditions?: string[] | null
          created_at?: string | null
          current_medications?: string[] | null
          family_history?: Json | null
          id?: string
          notes?: string | null
          past_surgeries?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      medication_logs: {
        Row: {
          created_at: string | null
          id: string
          reminder_id: string
          scheduled_time: string
          status: string
          taken_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          reminder_id: string
          scheduled_time: string
          status?: string
          taken_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          reminder_id?: string
          scheduled_time?: string
          status?: string
          taken_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_logs_reminder_id_fkey"
            columns: ["reminder_id"]
            isOneToOne: false
            referencedRelation: "medication_reminders"
            referencedColumns: ["id"]
          },
        ]
      }
      medication_reminders: {
        Row: {
          created_at: string | null
          days_of_week: number[] | null
          dosage: string | null
          end_date: string | null
          frequency: string
          id: string
          is_active: boolean | null
          medication_name: string
          notes: string | null
          reminder_times: string[]
          start_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          days_of_week?: number[] | null
          dosage?: string | null
          end_date?: string | null
          frequency?: string
          id?: string
          is_active?: boolean | null
          medication_name: string
          notes?: string | null
          reminder_times?: string[]
          start_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          days_of_week?: number[] | null
          dosage?: string | null
          end_date?: string | null
          frequency?: string
          id?: string
          is_active?: boolean | null
          medication_name?: string
          notes?: string | null
          reminder_times?: string[]
          start_date?: string | null
          updated_at?: string | null
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
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      nutrition_logs: {
        Row: {
          calories: number | null
          carbs_g: number | null
          created_at: string
          fat_g: number | null
          fiber_g: number | null
          id: string
          logged_at: string
          meal_description: string | null
          meal_type: string
          notes: string | null
          protein_g: number | null
          user_id: string
          water_ml: number | null
        }
        Insert: {
          calories?: number | null
          carbs_g?: number | null
          created_at?: string
          fat_g?: number | null
          fiber_g?: number | null
          id?: string
          logged_at?: string
          meal_description?: string | null
          meal_type?: string
          notes?: string | null
          protein_g?: number | null
          user_id: string
          water_ml?: number | null
        }
        Update: {
          calories?: number | null
          carbs_g?: number | null
          created_at?: string
          fat_g?: number | null
          fiber_g?: number | null
          id?: string
          logged_at?: string
          meal_description?: string | null
          meal_type?: string
          notes?: string | null
          protein_g?: number | null
          user_id?: string
          water_ml?: number | null
        }
        Relationships: []
      }
      nutrition_profiles: {
        Row: {
          created_at: string
          daily_calorie_target: number | null
          daily_water_target_ml: number | null
          dietary_pattern: string | null
          food_allergies: string[] | null
          food_intolerances: string[] | null
          goals: string[] | null
          id: string
          notes: string | null
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          created_at?: string
          daily_calorie_target?: number | null
          daily_water_target_ml?: number | null
          dietary_pattern?: string | null
          food_allergies?: string[] | null
          food_intolerances?: string[] | null
          goals?: string[] | null
          id?: string
          notes?: string | null
          updated_at?: string
          user_id: string
          version?: number
        }
        Update: {
          created_at?: string
          daily_calorie_target?: number | null
          daily_water_target_ml?: number | null
          dietary_pattern?: string | null
          food_allergies?: string[] | null
          food_intolerances?: string[] | null
          goals?: string[] | null
          id?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          appointment_id: string
          created_at: string | null
          currency: string | null
          id: string
          paid_at: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id: string | null
          stripe_receipt_url: string | null
          user_id: string
        }
        Insert: {
          amount: number
          appointment_id: string
          created_at?: string | null
          currency?: string | null
          id?: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id?: string | null
          stripe_receipt_url?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          appointment_id?: string
          created_at?: string | null
          currency?: string | null
          id?: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id?: string | null
          stripe_receipt_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments_sandbox: {
        Row: {
          amount: number
          appointment_id: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          fake_card_last4: string | null
          id: string
          invoice_number: string | null
          paid_at: string | null
          receipt_url: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          amount: number
          appointment_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          fake_card_last4?: string | null
          id?: string
          invoice_number?: string | null
          paid_at?: string | null
          receipt_url?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          appointment_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          fake_card_last4?: string | null
          id?: string
          invoice_number?: string | null
          paid_at?: string | null
          receipt_url?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_sandbox_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      pilot_enrollments: {
        Row: {
          age_confirmed: boolean
          consent_accepted: boolean
          consent_accepted_at: string | null
          created_at: string
          enrolled_at: string
          id: string
          invite_code: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          age_confirmed?: boolean
          consent_accepted?: boolean
          consent_accepted_at?: string | null
          created_at?: string
          enrolled_at?: string
          id?: string
          invite_code?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          age_confirmed?: boolean
          consent_accepted?: boolean
          consent_accepted_at?: string | null
          created_at?: string
          enrolled_at?: string
          id?: string
          invite_code?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pilot_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: string
          updated_at: string
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      pilot_waitlist: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          reason: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          phone?: string | null
          reason?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          reason?: string | null
        }
        Relationships: []
      }
      prevention_plans: {
        Row: {
          based_on_age: boolean | null
          based_on_conditions: boolean | null
          based_on_family_history: boolean | null
          based_on_sex: boolean | null
          created_at: string | null
          id: string
          last_generated_at: string | null
          recommendations: Json | null
          screening_schedule: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          based_on_age?: boolean | null
          based_on_conditions?: boolean | null
          based_on_family_history?: boolean | null
          based_on_sex?: boolean | null
          created_at?: string | null
          id?: string
          last_generated_at?: string | null
          recommendations?: Json | null
          screening_schedule?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          based_on_age?: boolean | null
          based_on_conditions?: boolean | null
          based_on_family_history?: boolean | null
          based_on_sex?: boolean | null
          created_at?: string | null
          id?: string
          last_generated_at?: string | null
          recommendations?: Json | null
          screening_schedule?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      preventive_chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      preventive_insights: {
        Row: {
          created_at: string
          data_sources: string[] | null
          description: string | null
          id: string
          insight_type: string
          is_dismissed: boolean | null
          recommendations: string[] | null
          severity: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_sources?: string[] | null
          description?: string | null
          id?: string
          insight_type: string
          is_dismissed?: boolean | null
          recommendations?: string[] | null
          severity?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_sources?: string[] | null
          description?: string | null
          id?: string
          insight_type?: string
          is_dismissed?: boolean | null
          recommendations?: string[] | null
          severity?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      preventive_screenings: {
        Row: {
          ai_recommended: boolean | null
          completed_date: string | null
          created_at: string
          id: string
          next_due: string | null
          notes: string | null
          provider_name: string | null
          recommended_date: string | null
          result: string | null
          risk_level: string | null
          screening_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_recommended?: boolean | null
          completed_date?: string | null
          created_at?: string
          id?: string
          next_due?: string | null
          notes?: string | null
          provider_name?: string | null
          recommended_date?: string | null
          result?: string | null
          risk_level?: string | null
          screening_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_recommended?: boolean | null
          completed_date?: string | null
          created_at?: string
          id?: string
          next_due?: string | null
          notes?: string | null
          provider_name?: string | null
          recommended_date?: string | null
          result?: string | null
          risk_level?: string | null
          screening_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          blood_type: string | null
          city: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          full_name: string | null
          gdpr_consent: boolean | null
          id: string
          phone: string | null
          terms_accepted: boolean | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          blood_type?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          full_name?: string | null
          gdpr_consent?: boolean | null
          id: string
          phone?: string | null
          terms_accepted?: boolean | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          blood_type?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          full_name?: string | null
          gdpr_consent?: boolean | null
          id?: string
          phone?: string | null
          terms_accepted?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      provider_documents: {
        Row: {
          document_type: string
          file_name: string
          file_url: string
          id: string
          provider_id: string
          status: string | null
          uploaded_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          document_type: string
          file_name: string
          file_url: string
          id?: string
          provider_id: string
          status?: string | null
          uploaded_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          document_type?: string
          file_name?: string
          file_url?: string
          id?: string
          provider_id?: string
          status?: string | null
          uploaded_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_documents_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_gallery: {
        Row: {
          caption: string | null
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string
          provider_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          provider_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          provider_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_gallery_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      providers: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          latitude: number | null
          license_number: string | null
          longitude: number | null
          name: string
          phone: string | null
          price_max: number | null
          price_min: number | null
          qualifications: string[] | null
          rating: number | null
          registration_status: string | null
          review_count: number | null
          services: string[] | null
          specialty: string | null
          type: Database["public"]["Enums"]["provider_type"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          license_number?: string | null
          longitude?: number | null
          name: string
          phone?: string | null
          price_max?: number | null
          price_min?: number | null
          qualifications?: string[] | null
          rating?: number | null
          registration_status?: string | null
          review_count?: number | null
          services?: string[] | null
          specialty?: string | null
          type: Database["public"]["Enums"]["provider_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          license_number?: string | null
          longitude?: number | null
          name?: string
          phone?: string | null
          price_max?: number | null
          price_min?: number | null
          qualifications?: string[] | null
          rating?: number | null
          registration_status?: string | null
          review_count?: number | null
          services?: string[] | null
          specialty?: string | null
          type?: Database["public"]["Enums"]["provider_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          appointment_id: string | null
          comment: string | null
          created_at: string | null
          id: string
          provider_id: string
          rating: number
          user_id: string
        }
        Insert: {
          appointment_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          provider_id: string
          rating: number
          user_id: string
        }
        Update: {
          appointment_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          provider_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      sleep_logs: {
        Row: {
          created_at: string
          id: string
          interruptions: number | null
          logged_at: string
          notes: string | null
          quality_rating: number | null
          sleep_end: string | null
          sleep_start: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interruptions?: number | null
          logged_at?: string
          notes?: string | null
          quality_rating?: number | null
          sleep_end?: string | null
          sleep_start?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interruptions?: number | null
          logged_at?: string
          notes?: string | null
          quality_rating?: number | null
          sleep_end?: string | null
          sleep_start?: string | null
          user_id?: string
        }
        Relationships: []
      }
      stress_logs: {
        Row: {
          coping_methods: string[] | null
          created_at: string
          id: string
          logged_at: string
          notes: string | null
          physical_symptoms: string[] | null
          stress_level: number | null
          triggers: string[] | null
          user_id: string
        }
        Insert: {
          coping_methods?: string[] | null
          created_at?: string
          id?: string
          logged_at?: string
          notes?: string | null
          physical_symptoms?: string[] | null
          stress_level?: number | null
          triggers?: string[] | null
          user_id: string
        }
        Update: {
          coping_methods?: string[] | null
          created_at?: string
          id?: string
          logged_at?: string
          notes?: string | null
          physical_symptoms?: string[] | null
          stress_level?: number | null
          triggers?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      symptom_entries: {
        Row: {
          ai_summary: string | null
          body_areas: string[] | null
          created_at: string | null
          duration: string | null
          id: string
          intensity: number | null
          onset_date: string | null
          raw_user_input: string | null
          recommended_actions: string[] | null
          risk_flags: string[] | null
          status: string | null
          structured_data: Json | null
          triggers: string[] | null
          updated_at: string | null
          urgency_level: string | null
          user_id: string
        }
        Insert: {
          ai_summary?: string | null
          body_areas?: string[] | null
          created_at?: string | null
          duration?: string | null
          id?: string
          intensity?: number | null
          onset_date?: string | null
          raw_user_input?: string | null
          recommended_actions?: string[] | null
          risk_flags?: string[] | null
          status?: string | null
          structured_data?: Json | null
          triggers?: string[] | null
          updated_at?: string | null
          urgency_level?: string | null
          user_id: string
        }
        Update: {
          ai_summary?: string | null
          body_areas?: string[] | null
          created_at?: string | null
          duration?: string | null
          id?: string
          intensity?: number | null
          onset_date?: string | null
          raw_user_input?: string | null
          recommended_actions?: string[] | null
          risk_flags?: string[] | null
          status?: string | null
          structured_data?: Json | null
          triggers?: string[] | null
          updated_at?: string | null
          urgency_level?: string | null
          user_id?: string
        }
        Relationships: []
      }
      symptom_intakes: {
        Row: {
          additional_notes: string | null
          body_areas: Database["public"]["Enums"]["body_area"][]
          created_at: string | null
          duration: string | null
          id: string
          pain_level: number | null
          suggested_specialty: string | null
          symptoms: string[] | null
          urgency_level: Database["public"]["Enums"]["urgency_level"] | null
          user_id: string
          visit_type: string | null
        }
        Insert: {
          additional_notes?: string | null
          body_areas: Database["public"]["Enums"]["body_area"][]
          created_at?: string | null
          duration?: string | null
          id?: string
          pain_level?: number | null
          suggested_specialty?: string | null
          symptoms?: string[] | null
          urgency_level?: Database["public"]["Enums"]["urgency_level"] | null
          user_id: string
          visit_type?: string | null
        }
        Update: {
          additional_notes?: string | null
          body_areas?: Database["public"]["Enums"]["body_area"][]
          created_at?: string | null
          duration?: string | null
          id?: string
          pain_level?: number | null
          suggested_specialty?: string | null
          symptoms?: string[] | null
          urgency_level?: Database["public"]["Enums"]["urgency_level"] | null
          user_id?: string
          visit_type?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wearable_blood_pressure: {
        Row: {
          created_at: string
          diastolic: number
          id: string
          measured_at: string
          notes: string | null
          pulse: number | null
          source: string
          systolic: number
          user_id: string
        }
        Insert: {
          created_at?: string
          diastolic: number
          id?: string
          measured_at?: string
          notes?: string | null
          pulse?: number | null
          source?: string
          systolic: number
          user_id: string
        }
        Update: {
          created_at?: string
          diastolic?: number
          id?: string
          measured_at?: string
          notes?: string | null
          pulse?: number | null
          source?: string
          systolic?: number
          user_id?: string
        }
        Relationships: []
      }
      wearable_connections: {
        Row: {
          access_token: string | null
          created_at: string
          external_user_id: string | null
          id: string
          is_active: boolean
          last_sync_at: string | null
          provider: string
          refresh_token: string | null
          scopes: string[] | null
          sync_error: string | null
          sync_status: string | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          external_user_id?: string | null
          id?: string
          is_active?: boolean
          last_sync_at?: string | null
          provider: string
          refresh_token?: string | null
          scopes?: string[] | null
          sync_error?: string | null
          sync_status?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string
          external_user_id?: string | null
          id?: string
          is_active?: boolean
          last_sync_at?: string | null
          provider?: string
          refresh_token?: string | null
          scopes?: string[] | null
          sync_error?: string | null
          sync_status?: string | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wearable_heart_rate: {
        Row: {
          bpm: number
          created_at: string
          heart_rate_type: string | null
          id: string
          measured_at: string
          source: string
          user_id: string
        }
        Insert: {
          bpm: number
          created_at?: string
          heart_rate_type?: string | null
          id?: string
          measured_at: string
          source: string
          user_id: string
        }
        Update: {
          bpm?: number
          created_at?: string
          heart_rate_type?: string | null
          id?: string
          measured_at?: string
          source?: string
          user_id?: string
        }
        Relationships: []
      }
      wearable_spo2: {
        Row: {
          created_at: string
          id: string
          measured_at: string
          source: string
          spo2_value: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          measured_at: string
          source: string
          spo2_value: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          measured_at?: string
          source?: string
          spo2_value?: number
          user_id?: string
        }
        Relationships: []
      }
      wearable_steps: {
        Row: {
          calories_burned: number | null
          created_at: string
          date: string
          distance_meters: number | null
          id: string
          source: string
          step_count: number
          user_id: string
        }
        Insert: {
          calories_burned?: number | null
          created_at?: string
          date: string
          distance_meters?: number | null
          id?: string
          source: string
          step_count: number
          user_id: string
        }
        Update: {
          calories_burned?: number | null
          created_at?: string
          date?: string
          distance_meters?: number | null
          id?: string
          source?: string
          step_count?: number
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_patient_medical_data: {
        Args: { _accessor_id: string; _patient_id: string }
        Returns: boolean
      }
      get_insurance_member_aggregate: {
        Args: { _member_id: string }
        Returns: Json
      }
      get_pilot_enrollment_count: { Args: never; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_pilot_full: { Args: never; Returns: boolean }
      patient_cancel_appointment: {
        Args: { p_appointment_id: string }
        Returns: undefined
      }
    }
    Enums: {
      academy_category:
        | "cardiology"
        | "neurology"
        | "oncology"
        | "pediatrics"
        | "surgery"
        | "internal_medicine"
        | "dermatology"
        | "psychiatry"
        | "orthopedics"
        | "other"
      academy_content_status:
        | "draft"
        | "pending_review"
        | "published"
        | "archived"
      app_role: "patient" | "doctor" | "admin" | "lab"
      appointment_status: "pending" | "confirmed" | "completed" | "cancelled"
      body_area:
        | "head"
        | "face"
        | "neck"
        | "chest"
        | "upper_back"
        | "lower_back"
        | "left_shoulder"
        | "right_shoulder"
        | "left_arm"
        | "right_arm"
        | "left_hand"
        | "right_hand"
        | "abdomen"
        | "pelvis"
        | "left_leg"
        | "right_leg"
        | "left_foot"
        | "right_foot"
      medical_entry_type: "blood_test" | "imaging" | "diagnosis"
      payment_status: "pending" | "paid" | "refunded" | "failed"
      provider_type: "doctor" | "clinic" | "hospital" | "nurse" | "lab"
      urgency_level: "low" | "medium" | "high" | "emergency"
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
      academy_category: [
        "cardiology",
        "neurology",
        "oncology",
        "pediatrics",
        "surgery",
        "internal_medicine",
        "dermatology",
        "psychiatry",
        "orthopedics",
        "other",
      ],
      academy_content_status: [
        "draft",
        "pending_review",
        "published",
        "archived",
      ],
      app_role: ["patient", "doctor", "admin", "lab"],
      appointment_status: ["pending", "confirmed", "completed", "cancelled"],
      body_area: [
        "head",
        "face",
        "neck",
        "chest",
        "upper_back",
        "lower_back",
        "left_shoulder",
        "right_shoulder",
        "left_arm",
        "right_arm",
        "left_hand",
        "right_hand",
        "abdomen",
        "pelvis",
        "left_leg",
        "right_leg",
        "left_foot",
        "right_foot",
      ],
      medical_entry_type: ["blood_test", "imaging", "diagnosis"],
      payment_status: ["pending", "paid", "refunded", "failed"],
      provider_type: ["doctor", "clinic", "hospital", "nurse", "lab"],
      urgency_level: ["low", "medium", "high", "emergency"],
    },
  },
} as const
