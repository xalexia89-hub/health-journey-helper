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
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string | null
          id: string
          notes: string | null
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
          id?: string
          notes?: string | null
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
          id?: string
          notes?: string | null
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
      medical_documents: {
        Row: {
          description: string | null
          file_name: string
          file_type: string | null
          file_url: string
          id: string
          uploaded_at: string | null
          user_id: string
        }
        Insert: {
          description?: string | null
          file_name: string
          file_type?: string | null
          file_url: string
          id?: string
          uploaded_at?: string | null
          user_id: string
        }
        Update: {
          description?: string | null
          file_name?: string
          file_type?: string | null
          file_url?: string
          id?: string
          uploaded_at?: string | null
          user_id?: string
        }
        Relationships: []
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
      app_role: "patient" | "doctor" | "admin"
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
      payment_status: "pending" | "paid" | "refunded" | "failed"
      provider_type: "doctor" | "clinic" | "hospital" | "nurse"
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
      app_role: ["patient", "doctor", "admin"],
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
      payment_status: ["pending", "paid", "refunded", "failed"],
      provider_type: ["doctor", "clinic", "hospital", "nurse"],
      urgency_level: ["low", "medium", "high", "emergency"],
    },
  },
} as const
