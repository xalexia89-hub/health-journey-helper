-- Create enum for content status
CREATE TYPE public.academy_content_status AS ENUM ('draft', 'pending_review', 'published', 'archived');

-- Create enum for content category
CREATE TYPE public.academy_category AS ENUM ('cardiology', 'neurology', 'oncology', 'pediatrics', 'surgery', 'internal_medicine', 'dermatology', 'psychiatry', 'orthopedics', 'other');

-- Academy Videos Table
CREATE TABLE public.academy_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_minutes INTEGER,
  category academy_category NOT NULL DEFAULT 'other',
  tags TEXT[] DEFAULT '{}',
  status academy_content_status NOT NULL DEFAULT 'draft',
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Research Publications Table
CREATE TABLE public.academy_publications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  abstract TEXT,
  content TEXT,
  pdf_url TEXT,
  category academy_category NOT NULL DEFAULT 'other',
  tags TEXT[] DEFAULT '{}',
  status academy_content_status NOT NULL DEFAULT 'draft',
  citation_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  doi TEXT,
  journal_name TEXT,
  co_authors TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Case Studies Table
CREATE TABLE public.academy_case_studies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT,
  patient_background TEXT,
  diagnosis TEXT,
  treatment TEXT,
  outcome TEXT,
  lessons_learned TEXT,
  category academy_category NOT NULL DEFAULT 'other',
  tags TEXT[] DEFAULT '{}',
  status academy_content_status NOT NULL DEFAULT 'draft',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Video Comments Table
CREATE TABLE public.academy_video_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID NOT NULL REFERENCES public.academy_videos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Video Likes Table
CREATE TABLE public.academy_video_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID NOT NULL REFERENCES public.academy_videos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(video_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.academy_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_video_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_video_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Videos
CREATE POLICY "Everyone can view published videos" ON public.academy_videos
  FOR SELECT USING (status = 'published');

CREATE POLICY "Doctors can manage own videos" ON public.academy_videos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.providers
      WHERE providers.id = academy_videos.provider_id
      AND providers.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all videos" ON public.academy_videos
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for Publications
CREATE POLICY "Everyone can view published publications" ON public.academy_publications
  FOR SELECT USING (status = 'published');

CREATE POLICY "Doctors can manage own publications" ON public.academy_publications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.providers
      WHERE providers.id = academy_publications.provider_id
      AND providers.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all publications" ON public.academy_publications
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for Case Studies
CREATE POLICY "Everyone can view published case studies" ON public.academy_case_studies
  FOR SELECT USING (status = 'published');

CREATE POLICY "Doctors can manage own case studies" ON public.academy_case_studies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.providers
      WHERE providers.id = academy_case_studies.provider_id
      AND providers.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all case studies" ON public.academy_case_studies
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for Comments
CREATE POLICY "Everyone can view comments" ON public.academy_video_comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON public.academy_video_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own comments" ON public.academy_video_comments
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for Likes
CREATE POLICY "Everyone can view likes" ON public.academy_video_likes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage own likes" ON public.academy_video_likes
  FOR ALL USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_academy_videos_updated_at
  BEFORE UPDATE ON public.academy_videos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_academy_publications_updated_at
  BEFORE UPDATE ON public.academy_publications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_academy_case_studies_updated_at
  BEFORE UPDATE ON public.academy_case_studies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_academy_video_comments_updated_at
  BEFORE UPDATE ON public.academy_video_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_academy_videos_provider ON public.academy_videos(provider_id);
CREATE INDEX idx_academy_videos_status ON public.academy_videos(status);
CREATE INDEX idx_academy_videos_category ON public.academy_videos(category);
CREATE INDEX idx_academy_publications_provider ON public.academy_publications(provider_id);
CREATE INDEX idx_academy_publications_status ON public.academy_publications(status);
CREATE INDEX idx_academy_case_studies_provider ON public.academy_case_studies(provider_id);
CREATE INDEX idx_academy_case_studies_status ON public.academy_case_studies(status);