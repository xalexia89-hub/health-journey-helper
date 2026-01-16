-- Create community posts table for the LinkedIn-style feed
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  post_type TEXT NOT NULL DEFAULT 'update' CHECK (post_type IN ('update', 'article', 'case_study', 'event', 'announcement')),
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create post likes table
CREATE TABLE public.community_post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Create post comments table
CREATE TABLE public.community_post_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.community_post_comments(id) ON DELETE CASCADE,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create post saves/bookmarks table
CREATE TABLE public.community_post_saves (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Create stories table
CREATE TABLE public.community_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  view_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create story views table
CREATE TABLE public.community_story_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL REFERENCES public.community_stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(story_id, user_id)
);

-- Create follows table (users following providers)
CREATE TABLE public.community_follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_user_id UUID NOT NULL,
  following_provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(follower_user_id, following_provider_id)
);

-- Enable RLS on all tables
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_story_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_follows ENABLE ROW LEVEL SECURITY;

-- Posts policies
CREATE POLICY "Everyone can view posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Providers can create posts" ON public.community_posts FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM providers WHERE id = provider_id AND user_id = auth.uid())
);
CREATE POLICY "Providers can update own posts" ON public.community_posts FOR UPDATE USING (
  EXISTS (SELECT 1 FROM providers WHERE id = provider_id AND user_id = auth.uid())
);
CREATE POLICY "Providers can delete own posts" ON public.community_posts FOR DELETE USING (
  EXISTS (SELECT 1 FROM providers WHERE id = provider_id AND user_id = auth.uid())
);

-- Likes policies
CREATE POLICY "Everyone can view likes" ON public.community_post_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like" ON public.community_post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON public.community_post_likes FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Everyone can view comments" ON public.community_post_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment" ON public.community_post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.community_post_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.community_post_comments FOR DELETE USING (auth.uid() = user_id);

-- Saves policies
CREATE POLICY "Users can view own saves" ON public.community_post_saves FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can save" ON public.community_post_saves FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsave" ON public.community_post_saves FOR DELETE USING (auth.uid() = user_id);

-- Stories policies
CREATE POLICY "Everyone can view active stories" ON public.community_stories FOR SELECT USING (expires_at > now());
CREATE POLICY "Providers can create stories" ON public.community_stories FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM providers WHERE id = provider_id AND user_id = auth.uid())
);
CREATE POLICY "Providers can delete own stories" ON public.community_stories FOR DELETE USING (
  EXISTS (SELECT 1 FROM providers WHERE id = provider_id AND user_id = auth.uid())
);

-- Story views policies
CREATE POLICY "Users can view own story views" ON public.community_story_views FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can mark stories viewed" ON public.community_story_views FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Users can view own follows" ON public.community_follows FOR SELECT USING (auth.uid() = follower_user_id);
CREATE POLICY "Providers can see their followers" ON public.community_follows FOR SELECT USING (
  EXISTS (SELECT 1 FROM providers WHERE id = following_provider_id AND user_id = auth.uid())
);
CREATE POLICY "Authenticated users can follow" ON public.community_follows FOR INSERT WITH CHECK (auth.uid() = follower_user_id);
CREATE POLICY "Users can unfollow" ON public.community_follows FOR DELETE USING (auth.uid() = follower_user_id);

-- Create function to increment like count
CREATE OR REPLACE FUNCTION public.increment_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create function to decrement like count
CREATE OR REPLACE FUNCTION public.decrement_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_posts SET like_count = GREATEST(0, like_count - 1) WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for like count
CREATE TRIGGER on_post_like_insert
  AFTER INSERT ON public.community_post_likes
  FOR EACH ROW EXECUTE FUNCTION public.increment_post_like_count();

CREATE TRIGGER on_post_like_delete
  AFTER DELETE ON public.community_post_likes
  FOR EACH ROW EXECUTE FUNCTION public.decrement_post_like_count();

-- Create function to increment comment count
CREATE OR REPLACE FUNCTION public.increment_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create function to decrement comment count
CREATE OR REPLACE FUNCTION public.decrement_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_posts SET comment_count = GREATEST(0, comment_count - 1) WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for comment count
CREATE TRIGGER on_post_comment_insert
  AFTER INSERT ON public.community_post_comments
  FOR EACH ROW EXECUTE FUNCTION public.increment_post_comment_count();

CREATE TRIGGER on_post_comment_delete
  AFTER DELETE ON public.community_post_comments
  FOR EACH ROW EXECUTE FUNCTION public.decrement_post_comment_count();

-- Create indexes for performance
CREATE INDEX idx_community_posts_provider ON public.community_posts(provider_id);
CREATE INDEX idx_community_posts_created ON public.community_posts(created_at DESC);
CREATE INDEX idx_community_stories_provider ON public.community_stories(provider_id);
CREATE INDEX idx_community_stories_expires ON public.community_stories(expires_at);
CREATE INDEX idx_community_follows_follower ON public.community_follows(follower_user_id);
CREATE INDEX idx_community_follows_provider ON public.community_follows(following_provider_id);