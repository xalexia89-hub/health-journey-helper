// Instagram for Healthcare - Type Definitions

export type ProfileType = 'doctor' | 'hospital' | 'nurse' | 'clinic';
export type ContentType = 'post' | 'reel' | 'story';
export type VerificationStatus = 'verified' | 'pending' | 'unverified';

export interface VerifiedProfile {
  id: string;
  user_id: string;
  type: ProfileType;
  name: string;
  username: string;
  avatar_url?: string;
  cover_url?: string;
  bio?: string;
  specialty?: string;
  hospital?: string;
  department?: string;
  location?: string;
  verification_status: VerificationStatus;
  medical_license?: string;
  credibility_score: number; // 0-100
  followers_count: number;
  following_count: number;
  posts_count: number;
  is_following?: boolean;
  created_at: string;
}

export interface MedicalPost {
  id: string;
  author: VerifiedProfile;
  content_type: 'image' | 'carousel' | 'video';
  media_urls: string[];
  caption: string;
  tags: string[];
  specialty_tags: string[];
  likes_count: number;
  comments_count: number;
  saves_count: number;
  shares_count: number;
  is_liked?: boolean;
  is_saved?: boolean;
  is_educational: boolean;
  credibility_boost: number; // Points added from this post
  created_at: string;
  location?: string;
}

export interface MedicalReel {
  id: string;
  author: VerifiedProfile;
  video_url: string;
  thumbnail_url: string;
  duration_seconds: number;
  caption: string;
  audio_name?: string;
  tags: string[];
  views_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_liked?: boolean;
  is_saved?: boolean;
  category: 'explainer' | 'day-on-shift' | 'equipment' | 'team-culture' | 'procedure';
  created_at: string;
}

export interface MedicalStory {
  id: string;
  author: VerifiedProfile;
  media_type: 'image' | 'video';
  media_url: string;
  duration_seconds?: number;
  caption?: string;
  location?: string;
  views_count: number;
  created_at: string;
  expires_at: string;
  is_live?: boolean;
}

export interface StoryGroup {
  profile: VerifiedProfile;
  stories: MedicalStory[];
  has_unseen: boolean;
  is_live?: boolean;
}

export interface Comment {
  id: string;
  author: VerifiedProfile;
  content: string;
  likes_count: number;
  is_liked?: boolean;
  replies_count: number;
  created_at: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'verification';
  actor: VerifiedProfile;
  target_type?: 'post' | 'reel' | 'story' | 'comment';
  target_id?: string;
  preview_url?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// Credibility System
export interface CredibilityMetrics {
  total_score: number;
  educational_posts: number;
  verified_engagement: number;
  peer_endorsements: number;
  accuracy_rating: number;
  community_contribution: number;
}
