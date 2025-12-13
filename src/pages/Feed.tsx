import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { StoryViewer } from "@/components/feed/StoryViewer";

// Mock data for stories
const mockStories = [
  {
    id: "1",
    name: "Δρ. Παπαδόπουλος",
    avatarUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop",
    hasNewStory: true,
    isOwn: false,
    type: "doctor" as const,
    specialty: "Καρδιολόγος",
  },
  {
    id: "2",
    name: "Κλινική Υγεία",
    avatarUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=150&h=150&fit=crop",
    hasNewStory: true,
    isOwn: false,
    type: "clinic" as const,
  },
  {
    id: "3",
    name: "Δρ. Αντωνίου",
    avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop",
    hasNewStory: true,
    isOwn: false,
    type: "doctor" as const,
    specialty: "Δερματολόγος",
  },
  {
    id: "4",
    name: "MedCenter",
    avatarUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=150&h=150&fit=crop",
    hasNewStory: false,
    isOwn: false,
    type: "clinic" as const,
  },
  {
    id: "5",
    name: "Δρ. Γεωργίου",
    avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop",
    hasNewStory: true,
    isOwn: false,
    type: "doctor" as const,
    specialty: "Ορθοπεδικός",
  },
  {
    id: "6",
    name: "HealthCare Plus",
    avatarUrl: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=150&h=150&fit=crop",
    hasNewStory: true,
    isOwn: false,
    type: "clinic" as const,
  },
];

// Mock data for posts
const mockPosts = [
  {
    id: "1",
    author: {
      name: "Δρ. Παπαδόπουλος",
      avatarUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop",
      type: "doctor" as const,
      specialty: "Καρδιολόγος",
      isVerified: true,
    },
    content: "Σήμερα γιορτάζουμε την Παγκόσμια Ημέρα Καρδιάς! 🫀 Μην ξεχνάτε τον τακτικό καρδιολογικό έλεγχο. Η πρόληψη σώζει ζωές!",
    imageUrl: "https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=800&h=600&fit=crop",
    likes: 234,
    comments: 45,
    timeAgo: "2 ώρες",
    isLiked: false,
    isSaved: false,
  },
  {
    id: "2",
    author: {
      name: "Κλινική Υγεία",
      avatarUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=150&h=150&fit=crop",
      type: "clinic" as const,
      isVerified: true,
    },
    content: "📢 Νέα υπηρεσία! Τώρα προσφέρουμε τηλεϊατρική για όλες τις ειδικότητες. Κλείστε ραντεβού online και συνδεθείτε με τους γιατρούς μας από το σπίτι σας.",
    imageUrl: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=600&fit=crop",
    likes: 567,
    comments: 89,
    timeAgo: "5 ώρες",
    isLiked: true,
    isSaved: true,
  },
  {
    id: "3",
    author: {
      name: "Δρ. Αντωνίου",
      avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop",
      type: "doctor" as const,
      specialty: "Δερματολόγος",
      isVerified: true,
    },
    content: "🌞 Συμβουλές για την προστασία του δέρματος το καλοκαίρι:\n\n1. Χρησιμοποιείτε αντηλιακό SPF 50+\n2. Αποφύγετε τον ήλιο 12:00-16:00\n3. Φοράτε καπέλο και γυαλιά ηλίου\n\nΓια περισσότερες πληροφορίες, κλείστε ραντεβού!",
    likes: 892,
    comments: 156,
    timeAgo: "1 ημέρα",
    isLiked: false,
    isSaved: false,
  },
  {
    id: "4",
    author: {
      name: "MedCenter",
      avatarUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=150&h=150&fit=crop",
      type: "clinic" as const,
      isVerified: false,
    },
    content: "🏥 Νέο τμήμα αθλητιατρικής! Εξειδικευμένη φροντίδα για αθλητές όλων των επιπέδων. Προγράμματα αποκατάστασης και πρόληψης τραυματισμών.",
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop",
    likes: 123,
    comments: 23,
    timeAgo: "2 ημέρες",
    isLiked: false,
    isSaved: false,
  },
];

interface StoryItemProps {
  story: (typeof mockStories)[0];
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
  post: (typeof mockPosts)[0];
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
              <span>{post.author.specialty}</span>
            )}
            {post.author.type === "clinic" && (
              <span>Κλινική</span>
            )}
            <span>•</span>
            <span>{post.timeAgo}</span>
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
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Δείτε όλα τα {post.comments} σχόλια
        </button>
      </CardFooter>
    </Card>
  );
};

const Feed = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(mockPosts);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Story Viewer Modal */}
      {activeStoryIndex !== null && (
        <StoryViewer
          stories={mockStories.map(s => ({
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
      <section className="bg-card border-b border-border">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4 p-4">
            {mockStories.map((story, index) => (
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

      {/* Posts Section */}
      <section className="max-w-lg mx-auto">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onSave={handleSave}
          />
        ))}

        {/* Load more indicator */}
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Ακολουθήστε περισσότερους γιατρούς και κλινικές για να δείτε περισσότερα νέα
          </p>
          <Button 
            variant="link" 
            className="mt-2 text-primary"
            onClick={() => navigate('/providers')}
          >
            Ανακαλύψτε παρόχους υγείας
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Feed;
