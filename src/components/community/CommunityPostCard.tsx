import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, MapPin, Stethoscope, BadgeCheck, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { formatDistanceToNow } from "date-fns";
import { el } from "date-fns/locale";

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

interface CommunityPostCardProps {
  post: CommunityPost;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onComment?: (postId: string, comment: string) => void;
}

export function CommunityPostCard({ post, onLike, onSave, onComment }: CommunityPostCardProps) {
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'article': return 'Άρθρο';
      case 'case_study': return 'Κλινική Περίπτωση';
      case 'event': return 'Εκδήλωση';
      case 'announcement': return 'Ανακοίνωση';
      default: return null;
    }
  };

  const getProviderTypeLabel = (type: string) => {
    switch (type) {
      case 'doctor': return 'Ιατρός';
      case 'clinic': return 'Κλινική';
      case 'hospital': return 'Νοσοκομείο';
      case 'nurse': return 'Νοσηλευτής';
      case 'lab': return 'Εργαστήριο';
      default: return type;
    }
  };

  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: el });
  const postTypeLabel = getPostTypeLabel(post.post_type);

  const handleSubmitComment = () => {
    if (commentText.trim() && onComment) {
      onComment(post.id, commentText);
      setCommentText("");
    }
  };

  return (
    <Card className="border-0 border-b border-border rounded-none bg-card shadow-none">
      <CardHeader className="flex flex-row items-start gap-2.5 p-3 pb-2">
        <Avatar 
          className="h-10 w-10 cursor-pointer ring-2 ring-primary/20 shrink-0"
          onClick={() => navigate(`/providers/${post.provider.id}`)}
        >
          <AvatarImage src={post.provider.avatar_url || undefined} alt={post.provider.name} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
            {post.provider.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-wrap">
            <span 
              className="font-semibold text-sm cursor-pointer hover:text-primary transition-colors"
              onClick={() => navigate(`/providers/${post.provider.id}`)}
            >
              {post.provider.name}
            </span>
            {post.provider.is_verified && (
              <BadgeCheck className="h-4 w-4 text-primary fill-primary/20" />
            )}
          </div>
          
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground flex-wrap">
            <span>{getProviderTypeLabel(post.provider.type)}</span>
            {post.provider.specialty && (
              <>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <Stethoscope className="h-2.5 w-2.5" />
                  {post.provider.specialty}
                </span>
              </>
            )}
            {post.provider.city && (
              <>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <MapPin className="h-2.5 w-2.5" />
                  {post.provider.city}
                </span>
              </>
            )}
          </div>
          
          <p className="text-[10px] text-muted-foreground mt-0.5">{timeAgo}</p>
        </div>
        
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground shrink-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      {/* Post Type Badge */}
      {postTypeLabel && (
        <div className="px-3 pb-1">
          <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-0">
            {postTypeLabel}
          </Badge>
        </div>
      )}
      
      {/* Content */}
      <CardContent className="p-3 pt-1">
        <p className="text-sm whitespace-pre-line leading-relaxed">{post.content}</p>
      </CardContent>
      
      {/* Image */}
      {post.image_url && (
        <div className="relative aspect-[4/3] bg-muted">
          <img 
            src={post.image_url} 
            alt="Post" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Engagement Stats */}
      <div className="px-3 py-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/50">
        <span>{post.like_count > 0 ? `${post.like_count} likes` : ''}</span>
        <span>{post.comment_count > 0 ? `${post.comment_count} σχόλια` : ''}</span>
      </div>
      
      {/* Actions */}
      <CardFooter className="p-0 border-t border-border/50">
        <div className="flex items-center justify-between w-full px-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex-1 gap-1.5 h-10 text-xs ${post.is_liked ? 'text-destructive' : 'text-muted-foreground'}`}
            onClick={() => onLike(post.id)}
          >
            <Heart className={`h-4 w-4 ${post.is_liked ? 'fill-current' : ''}`} />
            <span className="hidden xs:inline">Like</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 gap-1.5 h-10 text-xs text-muted-foreground"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden xs:inline">Σχόλιο</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 gap-1.5 h-10 text-xs text-muted-foreground"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden xs:inline">Share</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex-1 gap-1.5 h-10 text-xs ${post.is_saved ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => onSave(post.id)}
          >
            <Bookmark className={`h-4 w-4 ${post.is_saved ? 'fill-current' : ''}`} />
            <span className="hidden xs:inline">Αποθ.</span>
          </Button>
        </div>
      </CardFooter>
      
      {/* Comment Input */}
      <Collapsible open={showComments}>
        <CollapsibleContent className="border-t border-border/50 p-3">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Γράψε ένα σχόλιο..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 h-9 text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
            />
            <Button 
              size="icon" 
              className="h-9 w-9 shrink-0"
              onClick={handleSubmitComment}
              disabled={!commentText.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
