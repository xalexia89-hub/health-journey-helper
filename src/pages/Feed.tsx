import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, MapPin, Stethoscope, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { StoryViewer } from "@/components/feed/StoryViewer";

interface Provider {
  id: string;
  name: string;
  specialty: string | null;
  description: string | null;
  avatar_url: string | null;
  city: string | null;
  type: string;
  is_verified: boolean;
  gallery: {
    id: string;
    image_url: string;
  }[];
}

interface Story {
  id: string;
  name: string;
  avatarUrl: string;
  hasNewStory: boolean;
  isOwn: boolean;
  type: "doctor" | "clinic";
  specialty?: string;
}

interface Post {
  id: string;
  author: {
    name: string;
    avatarUrl: string;
    type: "doctor" | "clinic";
    specialty?: string;
    isVerified: boolean;
    city?: string;
  };
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  timeAgo: string;
  isLiked: boolean;
  isSaved: boolean;
}

interface StoryItemProps {
  story: Story;
  onClick: () => void;
}

const StoryItem = ({ story, onClick }: StoryItemProps) => {
  return (
    <div 
      className="flex flex-col items-center gap-1.5 cursor-pointer group"
      onClick={onClick}
    >
      <div 
        className={`relative p-0.5 rounded-full ${
          story.hasNewStory 
            ? 'bg-gradient-to-tr from-primary via-accent to-primary' 
            : 'bg-border'
        }`}
      >
        <div className="bg-background p-0.5 rounded-full">
          <Avatar className="h-16 w-16 ring-2 ring-background">
            <AvatarImage src={story.avatarUrl} alt={story.name} />
            <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-medium">
              {story.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <span className="text-xs text-center max-w-[72px] truncate text-foreground/80 group-hover:text-foreground transition-colors">
        {story.name.split(" ").slice(-1)[0]}
      </span>
    </div>
  );
};

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
}

const PostCard = ({ post, onLike, onSave }: PostCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="border-0 border-b border-border rounded-none bg-card shadow-none">
      <CardHeader className="flex flex-row items-center gap-3 p-3 pb-2">
        <Avatar 
          className="h-10 w-10 cursor-pointer ring-2 ring-primary/20"
          onClick={() => navigate(`/providers/${post.id}`)}
        >
          <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            {post.author.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span 
              className="font-semibold text-sm cursor-pointer hover:text-primary transition-colors truncate"
              onClick={() => navigate(`/providers/${post.id}`)}
            >
              {post.author.name}
            </span>
            {post.author.isVerified && (
              <Badge variant="secondary" className="h-4 px-1 text-[10px] bg-primary/10 text-primary border-0">
                ✓
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {post.author.specialty && (
              <span className="flex items-center gap-1">
                <Stethoscope className="h-3 w-3" />
                {post.author.specialty}
              </span>
            )}
            {post.author.city && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {post.author.city}
              </span>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </CardHeader>
      
      {post.imageUrl && (
        <div className="relative aspect-[4/3] bg-muted">
          <img 
            src={post.imageUrl} 
            alt="Post" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardContent className="p-3 pt-2 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-9 w-9 ${post.isLiked ? 'text-destructive' : 'text-foreground'}`}
              onClick={() => onLike(post.id)}
            >
              <Heart className={`h-6 w-6 ${post.isLiked ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-foreground">
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-foreground">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-9 w-9 ${post.isSaved ? 'text-primary' : 'text-foreground'}`}
            onClick={() => onSave(post.id)}
          >
            <Bookmark className={`h-6 w-6 ${post.isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>
        
        <div>
          <p className="text-sm font-semibold">{post.likes.toLocaleString('el-GR')} likes</p>
          <p className="text-sm mt-1">
            <span className="font-semibold">{post.author.name}</span>{" "}
            <span className="text-foreground/90 whitespace-pre-line">{post.content}</span>
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0">
        <Button 
          variant="link" 
          className="p-0 h-auto text-sm text-muted-foreground hover:text-foreground"
          onClick={() => navigate(`/providers/${post.id}`)}
        >
          Προβολή προφίλ
        </Button>
      </CardFooter>
    </Card>
  );
};

const Feed = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    const { data, error } = await supabase
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

    if (data) {
      setProviders(data as unknown as Provider[]);
      
      // Transform providers to stories
      const transformedStories: Story[] = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        avatarUrl: p.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=random`,
        hasNewStory: p.gallery && p.gallery.length > 0,
        isOwn: false,
        type: p.type === 'clinic' || p.type === 'hospital' ? 'clinic' : 'doctor',
        specialty: p.specialty || undefined,
      }));
      setStories(transformedStories);

      // Transform providers to posts
      const transformedPosts: Post[] = data
        .filter((p: any) => p.description || (p.gallery && p.gallery.length > 0))
        .map((p: any) => ({
          id: p.id,
          author: {
            name: p.name,
            avatarUrl: p.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=random`,
            type: p.type === 'clinic' || p.type === 'hospital' ? 'clinic' : 'doctor',
            specialty: p.specialty || undefined,
            isVerified: p.is_verified || false,
            city: p.city || undefined,
          },
          content: p.description || `Καλωσήρθατε στο προφίλ μου! Είμαι ${p.specialty || 'ιατρός'} στην ${p.city || 'περιοχή σας'}.`,
          imageUrl: p.gallery?.[0]?.image_url || undefined,
          likes: Math.floor(Math.random() * 500) + 50,
          comments: Math.floor(Math.random() * 50) + 5,
          timeAgo: 'Πρόσφατα',
          isLiked: false,
          isSaved: false,
        }));
      setPosts(transformedPosts);
    }
    setLoading(false);
  };

  const handleStoryClick = (storyIndex: number) => {
    setActiveStoryIndex(storyIndex);
  };

  const handleCloseStory = () => {
    setActiveStoryIndex(null);
  };

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleSave = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Story Viewer Modal */}
      {activeStoryIndex !== null && (
        <StoryViewer
          stories={stories.map(s => ({
            id: s.id,
            name: s.name,
            avatarUrl: s.avatarUrl,
            type: s.type,
            specialty: s.specialty,
          }))}
          initialStoryIndex={activeStoryIndex}
          onClose={handleCloseStory}
        />
      )}

      {/* Stories Section */}
      {stories.length > 0 && (
        <section className="bg-card border-b border-border">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-4 p-4">
              {stories.map((story, index) => (
                <StoryItem
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
          <div className="py-12 text-center">
            <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Δεν υπάρχουν ακόμα πάροχοι</h3>
            <p className="text-muted-foreground mb-4">
              Οι εγγεγραμμένοι γιατροί και κλινικές θα εμφανίζονται εδώ
            </p>
            <Button onClick={() => navigate('/providers')}>
              Εξερεύνηση Παρόχων
            </Button>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onSave={handleSave}
            />
          ))
        )}

        {/* Load more indicator */}
        {posts.length > 0 && (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Ακολουθήστε περισσότερους γιατρούς και κλινικές για περισσότερα νέα
            </p>
            <Button 
              variant="link" 
              className="mt-2 text-primary"
              onClick={() => navigate('/providers')}
            >
              Ανακαλύψτε παρόχους υγείας
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Feed;