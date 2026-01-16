import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Stethoscope, Users } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { StoryViewer } from "@/components/feed/StoryViewer";
import { CommunityHeader } from "@/components/community/CommunityHeader";
import { CommunityStoryItem } from "@/components/community/CommunityStoryItem";
import { CommunityPostCard } from "@/components/community/CommunityPostCard";
import { CreatePostDialog } from "@/components/community/CreatePostDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Provider {
  id: string;
  name: string;
  specialty: string | null;
  description: string | null;
  avatar_url: string | null;
  city: string | null;
  type: string;
  is_verified: boolean;
  user_id: string | null;
}

interface Story {
  id: string;
  name: string;
  avatarUrl: string | null;
  hasNewStory: boolean;
  isOwn: boolean;
  type: "doctor" | "clinic" | "hospital";
  specialty?: string;
}

interface CommunityPost {
  id: string;
  provider_id: string;
  content: string;
  image_url: string | null;
  post_type: string;
  like_count: number;
  comment_count: number;
  created_at: string;
  provider: {
    id: string;
    name: string;
    specialty: string | null;
    avatar_url: string | null;
    city: string | null;
    type: string;
    is_verified: boolean;
  };
  is_liked?: boolean;
  is_saved?: boolean;
}

const Feed = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [userProvider, setUserProvider] = useState<Provider | null>(null);
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [userSaves, setUserSaves] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    await Promise.all([
      fetchProviders(),
      fetchPosts(),
      fetchUserInteractions()
    ]);
    setLoading(false);
  };

  const fetchProviders = async () => {
    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (data) {
      setProviders(data as Provider[]);
      
      // Check if current user is a provider
      if (user) {
        const currentUserProvider = data.find((p: Provider) => p.user_id === user.id);
        setUserProvider(currentUserProvider || null);
      }
      
      // Transform to stories
      const transformedStories: Story[] = data.map((p: Provider) => ({
        id: p.id,
        name: p.name,
        avatarUrl: p.avatar_url,
        hasNewStory: true, // TODO: Check actual stories
        isOwn: p.user_id === user?.id,
        type: (p.type === 'clinic' || p.type === 'hospital' ? p.type : 'doctor') as "doctor" | "clinic" | "hospital",
        specialty: p.specialty || undefined,
      }));
      
      // Move own story to front if exists
      const ownStoryIndex = transformedStories.findIndex(s => s.isOwn);
      if (ownStoryIndex > 0) {
        const ownStory = transformedStories.splice(ownStoryIndex, 1)[0];
        transformedStories.unshift(ownStory);
      }
      
      setStories(transformedStories);
    }
  };

  const fetchPosts = async () => {
    // First try to fetch from community_posts table
    const { data: communityPosts, error } = await supabase
      .from('community_posts')
      .select(`
        id,
        provider_id,
        content,
        image_url,
        post_type,
        like_count,
        comment_count,
        created_at,
        provider:providers (
          id,
          name,
          specialty,
          avatar_url,
          city,
          type,
          is_verified
        )
      `)
      .order('created_at', { ascending: false })
      .limit(20);

    if (communityPosts && communityPosts.length > 0) {
      // Transform the data
      const transformedPosts: CommunityPost[] = communityPosts.map((p: any) => ({
        id: p.id,
        provider_id: p.provider_id,
        content: p.content,
        image_url: p.image_url,
        post_type: p.post_type,
        like_count: p.like_count || 0,
        comment_count: p.comment_count || 0,
        created_at: p.created_at,
        provider: p.provider,
        is_liked: userLikes.has(p.id),
        is_saved: userSaves.has(p.id),
      }));
      setPosts(transformedPosts);
    } else {
      // Fallback: Generate posts from provider data if no community posts exist
      const { data: providerData } = await supabase
        .from('providers')
        .select(`
          id,
          name,
          specialty,
          description,
          avatar_url,
          city,
          type,
          is_verified,
          gallery:provider_gallery (
            id,
            image_url
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (providerData) {
        const fallbackPosts: CommunityPost[] = providerData
          .filter((p: any) => p.description)
          .map((p: any) => ({
            id: p.id,
            provider_id: p.id,
            content: p.description || `Καλωσήρθατε στο προφίλ μας! Είμαστε ${p.specialty || 'πάροχος υγείας'} στην ${p.city || 'περιοχή σας'}.`,
            image_url: p.gallery?.[0]?.image_url || null,
            post_type: 'update',
            like_count: Math.floor(Math.random() * 200) + 20,
            comment_count: Math.floor(Math.random() * 30) + 2,
            created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            provider: {
              id: p.id,
              name: p.name,
              specialty: p.specialty,
              avatar_url: p.avatar_url,
              city: p.city,
              type: p.type,
              is_verified: p.is_verified || false,
            },
            is_liked: false,
            is_saved: false,
          }));
        setPosts(fallbackPosts);
      }
    }
  };

  const fetchUserInteractions = async () => {
    if (!user) return;

    // Fetch user likes
    const { data: likes } = await supabase
      .from('community_post_likes')
      .select('post_id')
      .eq('user_id', user.id);

    if (likes) {
      setUserLikes(new Set(likes.map(l => l.post_id)));
    }

    // Fetch user saves
    const { data: saves } = await supabase
      .from('community_post_saves')
      .select('post_id')
      .eq('user_id', user.id);

    if (saves) {
      setUserSaves(new Set(saves.map(s => s.post_id)));
    }
  };

  const handleStoryClick = (storyIndex: number) => {
    setActiveStoryIndex(storyIndex);
  };

  const handleCloseStory = () => {
    setActiveStoryIndex(null);
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      toast({
        title: "Σύνδεση απαιτείται",
        description: "Συνδεθείτε για να κάνετε like σε δημοσιεύσεις.",
        variant: "destructive",
      });
      return;
    }

    const isLiked = userLikes.has(postId);

    // Optimistic update
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            is_liked: !isLiked,
            like_count: isLiked ? post.like_count - 1 : post.like_count + 1
          }
        : post
    ));

    if (isLiked) {
      setUserLikes(prev => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
      
      await supabase
        .from('community_post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);
    } else {
      setUserLikes(prev => new Set(prev).add(postId));
      
      await supabase
        .from('community_post_likes')
        .insert({ post_id: postId, user_id: user.id });
    }
  };

  const handleSave = async (postId: string) => {
    if (!user) {
      toast({
        title: "Σύνδεση απαιτείται",
        description: "Συνδεθείτε για να αποθηκεύσετε δημοσιεύσεις.",
        variant: "destructive",
      });
      return;
    }

    const isSaved = userSaves.has(postId);

    // Optimistic update
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, is_saved: !isSaved }
        : post
    ));

    if (isSaved) {
      setUserSaves(prev => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
      
      await supabase
        .from('community_post_saves')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);
    } else {
      setUserSaves(prev => new Set(prev).add(postId));
      
      await supabase
        .from('community_post_saves')
        .insert({ post_id: postId, user_id: user.id });
    }
  };

  const handleComment = async (postId: string, comment: string) => {
    if (!user) {
      toast({
        title: "Σύνδεση απαιτείται",
        description: "Συνδεθείτε για να σχολιάσετε.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('community_post_comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        content: comment,
      });

    if (!error) {
      // Update comment count optimistically
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comment_count: post.comment_count + 1 }
          : post
      ));
      
      toast({
        title: "Το σχόλιο δημοσιεύτηκε",
      });
    }
  };

  const handleCreatePost = async (content: string, postType: string, imageUrl?: string) => {
    if (!user || !userProvider) {
      toast({
        title: "Μόνο πάροχοι μπορούν να δημοσιεύσουν",
        description: "Εγγραφείτε ως πάροχος υγείας για να δημοσιεύσετε.",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        provider_id: userProvider.id,
        content,
        post_type: postType,
        image_url: imageUrl || null,
      })
      .select(`
        id,
        provider_id,
        content,
        image_url,
        post_type,
        like_count,
        comment_count,
        created_at
      `)
      .single();

    if (error) {
      toast({
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η δημοσίευση.",
        variant: "destructive",
      });
      return;
    }

    // Add new post to the top
    const newPost: CommunityPost = {
      ...data,
      provider: {
        id: userProvider.id,
        name: userProvider.name,
        specialty: userProvider.specialty,
        avatar_url: userProvider.avatar_url,
        city: userProvider.city,
        type: userProvider.type,
        is_verified: userProvider.is_verified,
      },
      is_liked: false,
      is_saved: false,
    };

    setPosts(prev => [newPost, ...prev]);
    
    toast({
      title: "Δημοσίευση επιτυχής!",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Story Viewer Modal */}
      {activeStoryIndex !== null && (
        <StoryViewer
          stories={stories.map(s => ({
            id: s.id,
            name: s.name,
            avatarUrl: s.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=random`,
            type: s.type === 'hospital' ? 'clinic' : s.type,
            specialty: s.specialty,
          }))}
          initialStoryIndex={activeStoryIndex}
          onClose={handleCloseStory}
        />
      )}

      {/* Create Post Dialog */}
      <CreatePostDialog
        open={showCreatePost}
        onOpenChange={setShowCreatePost}
        provider={userProvider}
        onSubmit={handleCreatePost}
      />

      {/* Header */}
      <CommunityHeader 
        onCreatePost={userProvider ? () => setShowCreatePost(true) : undefined}
      />

      {/* Stories Section */}
      {stories.length > 0 && (
        <section className="bg-card border-b border-border">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-3 p-3">
              {stories.map((story, index) => (
                <CommunityStoryItem
                  key={story.id}
                  story={story}
                  onClick={() => handleStoryClick(index)}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>
        </section>
      )}

      {/* Posts Section */}
      <section className="max-w-lg mx-auto">
        {posts.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-base font-semibold mb-2">Καλωσήρθατε στην Κοινότητα</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Οι δημοσιεύσεις από γιατρούς, κλινικές και νοσοκομεία θα εμφανίζονται εδώ
            </p>
            <Button onClick={() => navigate('/providers')} size="sm">
              <Stethoscope className="h-4 w-4 mr-2" />
              Εξερεύνηση Παρόχων
            </Button>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <CommunityPostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onSave={handleSave}
                onComment={handleComment}
              />
            ))}
            
            {/* Load more indicator */}
            <div className="py-8 text-center">
              <p className="text-xs text-muted-foreground">
                Ακολουθήστε περισσότερους παρόχους για νέο περιεχόμενο
              </p>
              <Button 
                variant="link" 
                className="mt-2 text-primary text-xs"
                onClick={() => navigate('/providers')}
              >
                Ανακαλύψτε παρόχους υγείας
              </Button>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Feed;
