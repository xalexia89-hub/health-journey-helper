// Future Community Types - A new species of social platform

export type PulseState = 'present' | 'focused' | 'reflecting' | 'supporting' | 'resting';

export type PostCategory = 'human-story' | 'knowledge' | 'mission-reel' | 'pulse-moment';

export interface PulseProfile {
  id: string;
  user_id: string;
  display_name: string;
  role: 'doctor' | 'nurse' | 'physician' | 'specialist' | 'resident';
  specialty?: string;
  hospital?: string;
  avatar_url?: string;
  pulse_state: PulseState;
  years_of_service: number;
  is_verified: boolean;
  mission_statement?: string;
  created_at: string;
}

export interface HumanStory {
  id: string;
  author: PulseProfile;
  content: string;
  emotion?: 'hope' | 'gratitude' | 'reflection' | 'strength' | 'compassion';
  timestamp: string;
  acknowledgments: number; // Not likes - acknowledgments of presence
  is_anonymous: boolean;
}

export interface KnowledgePost {
  id: string;
  author: PulseProfile;
  title: string;
  insight: string;
  category: 'clinical' | 'patient-care' | 'self-care' | 'teamwork' | 'ethics';
  learned_from: string; // "Today on shift...", "A patient taught me..."
  timestamp: string;
  resonances: number; // How many people this resonated with
}

export interface MissionReel {
  id: string;
  author: PulseProfile;
  video_url?: string;
  audio_url?: string;
  transcript: string;
  duration_seconds: number;
  theme: 'why-medicine' | 'carrying-lives' | 'moments-that-matter' | 'the-calling';
  timestamp: string;
  witnessed_by: number; // People who witnessed this mission
}

export interface PulseMoment {
  id: string;
  author: PulseProfile;
  pulse_type: 'breathing' | 'present' | 'grateful' | 'holding-space';
  message?: string;
  duration_minutes: number;
  supporters: number;
  timestamp: string;
}

export type CommunityPost = 
  | { type: 'human-story'; data: HumanStory }
  | { type: 'knowledge'; data: KnowledgePost }
  | { type: 'mission-reel'; data: MissionReel }
  | { type: 'pulse-moment'; data: PulseMoment };
