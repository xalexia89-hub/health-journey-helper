import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Building2, 
  Stethoscope,
  Users,
  Grid3X3,
  Bookmark,
  MessageCircle,
  UserPlus,
  Settings
} from "lucide-react";
import { VerificationBadge } from "./VerificationBadge";
import { CredibilityScore } from "./CredibilityScore";
import type { VerifiedProfile } from "./types";

interface ProfileCardProps {
  profile: VerifiedProfile;
  isOwnProfile?: boolean;
  onFollow?: () => void;
  onMessage?: () => void;
  onEditProfile?: () => void;
  className?: string;
}

export function ProfileCard({ 
  profile, 
  isOwnProfile = false,
  onFollow,
  onMessage,
  onEditProfile,
  className 
}: ProfileCardProps) {
  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getTypeLabel = () => {
    switch (profile.type) {
      case 'hospital': return 'Νοσοκομείο';
      case 'clinic': return 'Κλινική';
      case 'nurse': return 'Νοσηλευτής/τρια';
      case 'doctor': return 'Ιατρός';
      default: return 'Healthcare';
    }
  };

  return (
    <div className={cn("bg-card", className)}>
      {/* Cover Image */}
      {profile.cover_url && (
        <div 
          className="h-32 bg-cover bg-center"
          style={{ backgroundImage: `url(${profile.cover_url})` }}
        />
      )}

      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Avatar className={cn(
            "ring-4 ring-background",
            profile.cover_url ? "-mt-12 h-24 w-24" : "h-20 w-20"
          )}>
            <AvatarImage src={profile.avatar_url} alt={profile.name} />
            <AvatarFallback className="bg-secondary text-secondary-foreground text-xl">
              {profile.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 pt-1">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg">{profile.name}</h1>
              <VerificationBadge 
                type={profile.type} 
                status={profile.verification_status}
                size="md"
              />
            </div>
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-around py-3 border-y border-border">
          <div className="text-center">
            <p className="font-bold text-lg">{formatCount(profile.posts_count)}</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">{formatCount(profile.followers_count)}</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">{formatCount(profile.following_count)}</p>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
          <div className="text-center">
            <CredibilityScore score={profile.credibility_score} showLabel={false} />
            <p className="text-xs text-muted-foreground">Score</p>
          </div>
        </div>

        {/* Bio & Info */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              {profile.type === 'hospital' || profile.type === 'clinic' ? (
                <Building2 className="h-4 w-4" />
              ) : (
                <Stethoscope className="h-4 w-4" />
              )}
              {getTypeLabel()}
            </span>
            {profile.specialty && (
              <span className="text-primary">{profile.specialty}</span>
            )}
            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {profile.location}
              </span>
            )}
          </div>

          {profile.bio && (
            <p className="text-sm">{profile.bio}</p>
          )}

          {profile.hospital && profile.type !== 'hospital' && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {profile.hospital}
            </p>
          )}

          {profile.department && (
            <p className="text-sm text-muted-foreground">
              {profile.department}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {isOwnProfile ? (
            <>
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={onEditProfile}
              >
                Edit Profile
              </Button>
              <Button variant="secondary" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant={profile.is_following ? "secondary" : "default"}
                className="flex-1"
                onClick={onFollow}
              >
                {profile.is_following ? (
                  <>
                    <Users className="h-4 w-4 mr-2" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Follow
                  </>
                )}
              </Button>
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={onMessage}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
            </>
          )}
        </div>

        {/* Profile Tabs */}
        <div className="flex border-t border-border">
          <button className="flex-1 py-3 flex items-center justify-center gap-2 border-b-2 border-primary text-primary">
            <Grid3X3 className="h-5 w-5" />
          </button>
          <button className="flex-1 py-3 flex items-center justify-center gap-2 border-b-2 border-transparent text-muted-foreground hover:text-foreground">
            <Bookmark className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
