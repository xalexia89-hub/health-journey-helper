import { useState } from "react";
import { 
  FeedHeader, 
  StoriesBar, 
  PostCard, 
  StoryViewer,
  CreatePostSheet,
  BottomNav,
  type StoryGroup,
  type MedicalPost,
  type VerifiedProfile
} from "@/components/instagram";
import { CommunityChat } from "@/components/community/CommunityChat";
import { toast } from "sonner";

// Mock Data - Replace with Supabase queries
const mockCurrentUser: VerifiedProfile = {
  id: '1',
  user_id: 'user-1',
  type: 'doctor',
  name: 'Δρ. Μαρία Παπαδοπούλου',
  username: 'dr.maria.papad',
  avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
  specialty: 'Καρδιολογία',
  hospital: 'Ευαγγελισμός',
  location: 'Αθήνα',
  verification_status: 'verified',
  credibility_score: 87,
  followers_count: 2340,
  following_count: 156,
  posts_count: 48,
  created_at: new Date().toISOString(),
};

const mockStoryGroups: StoryGroup[] = [
  {
    profile: {
      id: '2',
      user_id: 'user-2',
      type: 'hospital',
      name: 'Ευαγγελισμός Hospital',
      username: 'evangelismos',
      avatar_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300&h=300&fit=crop&crop=center&q=90',
      verification_status: 'verified',
      credibility_score: 95,
      followers_count: 15600,
      following_count: 42,
      posts_count: 312,
      created_at: new Date().toISOString(),
    },
    stories: [
      {
        id: 's1',
        author: {} as VerifiedProfile,
        media_type: 'image',
        media_url: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800',
        caption: 'New cardiac surgery wing opens today! 🏥',
        location: 'Athens',
        views_count: 1245,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
      },
    ],
    has_unseen: true,
    is_live: false,
  },
  {
    profile: {
      id: '3',
      user_id: 'user-3',
      type: 'doctor',
      name: 'Δρ. Νίκος Αντωνίου',
      username: 'dr.nikos.ant',
      avatar_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face&q=90',
      specialty: 'Νευροχειρουργική',
      verification_status: 'verified',
      credibility_score: 92,
      followers_count: 8750,
      following_count: 234,
      posts_count: 156,
      created_at: new Date().toISOString(),
    },
    stories: [
      {
        id: 's3',
        author: {} as VerifiedProfile,
        media_type: 'image',
        media_url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800',
        caption: 'Successful 8-hour surgery! The team did amazing 🙏',
        location: 'ΑΧΕΠΑ Hospital',
        views_count: 2156,
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
      },
    ],
    has_unseen: true,
    is_live: false,
  },
  {
    profile: {
      id: '4',
      user_id: 'user-4',
      type: 'nurse',
      name: 'Ελένη Κωνσταντίνου',
      username: 'eleni.nurse',
      avatar_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop&crop=face&q=90',
      verification_status: 'verified',
      credibility_score: 78,
      followers_count: 1250,
      following_count: 456,
      posts_count: 89,
      created_at: new Date().toISOString(),
    },
    stories: [
      {
        id: 's4',
        author: {} as VerifiedProfile,
        media_type: 'image',
        media_url: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1b89?w=800',
        caption: 'Night shift vibes ✨ Taking care of our patients',
        views_count: 456,
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
      },
    ],
    has_unseen: false,
    is_live: false,
  },
  {
    profile: {
      id: '5',
      user_id: 'user-5',
      type: 'clinic',
      name: 'Ιατρικό Κέντρο Αθηνών',
      username: 'iatriko.athens',
      avatar_url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=300&h=300&fit=crop&crop=center&q=90',
      verification_status: 'verified',
      credibility_score: 88,
      followers_count: 5670,
      following_count: 89,
      posts_count: 203,
      created_at: new Date().toISOString(),
    },
    stories: [
      {
        id: 's5',
        author: {} as VerifiedProfile,
        media_type: 'image',
        media_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
        caption: 'New MRI equipment installation complete! 🎉',
        location: 'Athens Medical Center',
        views_count: 1890,
        created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(Date.now() + 21 * 60 * 60 * 1000).toISOString(),
      },
    ],
    has_unseen: true,
    is_live: true,
  },
  {
    profile: {
      id: '7',
      user_id: 'user-7',
      type: 'doctor',
      name: 'Δρ. Γιώργος Παπαγεωργίου',
      username: 'dr.papageorgiou',
      avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face&q=90',
      specialty: 'Ορθοπεδική',
      verification_status: 'verified',
      credibility_score: 90,
      followers_count: 6200,
      following_count: 180,
      posts_count: 134,
      created_at: new Date().toISOString(),
    },
    stories: [
      {
        id: 's6',
        author: {} as VerifiedProfile,
        media_type: 'image',
        media_url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800',
        caption: 'Αρθροσκόπηση γόνατος — minimal invasive πλέον! 🦴',
        location: 'Metropolitan Hospital',
        views_count: 980,
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(Date.now() + 19 * 60 * 60 * 1000).toISOString(),
      },
    ],
    has_unseen: true,
    is_live: false,
  },
  {
    profile: {
      id: '8',
      user_id: 'user-8',
      type: 'hospital',
      name: 'ΑΧΕΠΑ Θεσσαλονίκη',
      username: 'axepa.thess',
      avatar_url: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=300&h=300&fit=crop&crop=center&q=90',
      verification_status: 'verified',
      credibility_score: 93,
      followers_count: 12300,
      following_count: 55,
      posts_count: 278,
      created_at: new Date().toISOString(),
    },
    stories: [
      {
        id: 's7',
        author: {} as VerifiedProfile,
        media_type: 'image',
        media_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800',
        caption: 'Νέο ρομποτικό σύστημα Da Vinci στη χειρουργική μας 🤖',
        location: 'Θεσσαλονίκη',
        views_count: 3200,
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
      },
    ],
    has_unseen: true,
    is_live: false,
  },
  {
    profile: {
      id: '9',
      user_id: 'user-9',
      type: 'doctor',
      name: 'Δρ. Αναστασία Βλάχου',
      username: 'dr.vlachou',
      avatar_url: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=300&h=300&fit=crop&crop=face&q=90',
      specialty: 'Δερματολογία',
      verification_status: 'verified',
      credibility_score: 86,
      followers_count: 9100,
      following_count: 290,
      posts_count: 201,
      created_at: new Date().toISOString(),
    },
    stories: [
      {
        id: 's8',
        author: {} as VerifiedProfile,
        media_type: 'image',
        media_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
        caption: 'Προστασία από τον ήλιο — μην ξεχνάτε το αντηλιακό! ☀️',
        views_count: 4500,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
      },
    ],
    has_unseen: false,
    is_live: false,
  },
  {
    profile: {
      id: '10',
      user_id: 'user-10',
      type: 'nurse',
      name: 'Κατερίνα Δημητρίου',
      username: 'katerina.nurse',
      avatar_url: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=300&h=300&fit=crop&crop=face&q=90',
      verification_status: 'verified',
      credibility_score: 75,
      followers_count: 2100,
      following_count: 520,
      posts_count: 67,
      created_at: new Date().toISOString(),
    },
    stories: [
      {
        id: 's9',
        author: {} as VerifiedProfile,
        media_type: 'image',
        media_url: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800',
        caption: 'Εκπαίδευση νέων νοσηλευτών σήμερα! 📚',
        location: 'ΓΝΑ Λαϊκό',
        views_count: 670,
        created_at: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(Date.now() + 17 * 60 * 60 * 1000).toISOString(),
      },
    ],
    has_unseen: true,
    is_live: false,
  },
];

const mockPosts: MedicalPost[] = [
  {
    id: 'p1',
    author: {
      id: '3',
      user_id: 'user-3',
      type: 'doctor',
      name: 'Δρ. Νίκος Αντωνίου',
      username: 'dr.nikos.ant',
      avatar_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150',
      specialty: 'Νευροχειρουργική',
      verification_status: 'verified',
      credibility_score: 92,
      followers_count: 8750,
      following_count: 234,
      posts_count: 156,
      created_at: new Date().toISOString(),
    },
    content_type: 'image',
    media_urls: ['https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800'],
    caption: 'Σήμερα ολοκληρώσαμε μια πολύ απαιτητική επέμβαση εγκεφάλου διάρκειας 12 ωρών. Η ομάδα μας έδωσε τον καλύτερό της εαυτό και ο ασθενής είναι σε σταθερή κατάσταση. Αυτές οι στιγμές μας θυμίζουν γιατί επιλέξαμε αυτό το επάγγελμα. 🙏 #neurosurgery #teamwork',
    tags: ['neurosurgery', 'teamwork', 'success'],
    specialty_tags: ['Νευροχειρουργική', 'Επέμβαση'],
    likes_count: 1245,
    comments_count: 89,
    saves_count: 234,
    shares_count: 45,
    is_liked: false,
    is_saved: false,
    is_educational: false,
    credibility_boost: 0,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    location: 'ΑΧΕΠΑ Hospital, Θεσσαλονίκη',
  },
  {
    id: 'p2',
    author: {
      id: '2',
      user_id: 'user-2',
      type: 'hospital',
      name: 'Ευαγγελισμός Hospital',
      username: 'evangelismos',
      avatar_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=150',
      verification_status: 'verified',
      credibility_score: 95,
      followers_count: 15600,
      following_count: 42,
      posts_count: 312,
      created_at: new Date().toISOString(),
    },
    content_type: 'carousel',
    media_urls: [
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800',
    ],
    caption: '📢 ΑΝΑΚΟΙΝΩΣΗ: Εγκαινιάστηκε σήμερα η νέα πτέρυγα Καρδιοχειρουργικής του νοσοκομείου μας. Με τον πιο σύγχρονο εξοπλισμό και 20 νέες κλίνες ΜΕΘ, είμαστε έτοιμοι να προσφέρουμε ακόμα καλύτερη φροντίδα στους ασθενείς μας.',
    tags: ['cardiology', 'hospital', 'announcement'],
    specialty_tags: ['Καρδιοχειρουργική', 'Νέες Εγκαταστάσεις'],
    likes_count: 3456,
    comments_count: 234,
    saves_count: 89,
    shares_count: 156,
    is_liked: true,
    is_saved: false,
    is_educational: false,
    credibility_boost: 0,
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    location: 'Αθήνα',
  },
  {
    id: 'p3',
    author: {
      id: '6',
      user_id: 'user-6',
      type: 'doctor',
      name: 'Δρ. Σοφία Αλεξίου',
      username: 'dr.sofia.alexiou',
      avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
      specialty: 'Παθολογία',
      verification_status: 'verified',
      credibility_score: 85,
      followers_count: 4560,
      following_count: 312,
      posts_count: 78,
      created_at: new Date().toISOString(),
    },
    content_type: 'image',
    media_urls: ['https://images.unsplash.com/photo-1576671081837-49000212a370?w=800'],
    caption: '🎓 ΕΚΠΑΙΔΕΥΤΙΚΟ: 5 σημαντικά σημάδια που δεν πρέπει να αγνοείτε:\n\n1. Ανεξήγητη απώλεια βάρους\n2. Επίμονη κόπωση\n3. Αλλαγές στο δέρμα\n4. Δυσκολία στην κατάποση\n5. Αλλαγή στις συνήθειες του εντέρου\n\nΑν παρατηρήσετε οτιδήποτε ασυνήθιστο, μιλήστε με τον γιατρό σας. Η πρόληψη σώζει ζωές! ❤️',
    tags: ['education', 'prevention', 'health'],
    specialty_tags: ['Παθολογία', 'Πρόληψη', 'Υγεία'],
    likes_count: 5678,
    comments_count: 345,
    saves_count: 890,
    shares_count: 234,
    is_liked: false,
    is_saved: true,
    is_educational: true,
    credibility_boost: 15,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'p4',
    author: mockStoryGroups[2].profile,
    content_type: 'image',
    media_urls: ['https://images.unsplash.com/photo-1631815588090-d4bfec5b1b89?w=800'],
    caption: 'Νυχτερινή βάρδια... Όταν οι υπόλοιποι κοιμούνται, εμείς είμαστε εδώ. Για τους ασθενείς μας, για τις οικογένειές τους. Δεν είναι απλά δουλειά, είναι αποστολή. 💙 #nursing #nightshift #healthcare',
    tags: ['nursing', 'nightshift', 'healthcare'],
    specialty_tags: ['Νοσηλευτική'],
    likes_count: 2345,
    comments_count: 156,
    saves_count: 67,
    shares_count: 89,
    is_liked: false,
    is_saved: false,
    is_educational: false,
    credibility_boost: 0,
    created_at: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
    location: 'ΓΝΑ Λαϊκό',
  },
];

export default function Community() {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'create' | 'messages' | 'profile'>('home');
  const [storyViewerOpen, setStoryViewerOpen] = useState(false);
  const [initialStoryIndex, setInitialStoryIndex] = useState(0);
  const [createSheetOpen, setCreateSheetOpen] = useState(false);

  const handleStoryClick = (index: number) => {
    setInitialStoryIndex(index);
    setStoryViewerOpen(true);
  };

  const handleAddStory = () => {
    setCreateSheetOpen(true);
  };

  const handlePostLike = (postId: string) => {
    toast.success("Post liked");
  };

  const handlePostComment = (postId: string) => {
    toast.info("Comments coming soon");
  };

  const handlePostShare = (postId: string) => {
    toast.info("Sharing coming soon");
  };

  const handlePostSave = (postId: string) => {
    toast.success("Post saved");
  };

  const handleProfileClick = (profileId: string) => {
    toast.info("Profile view coming soon");
  };

  const handleCreateSubmit = async (data: any) => {
    console.log("Creating post:", data);
    toast.success("Post created successfully!");
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (tab === 'create') {
      setCreateSheetOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {activeTab === 'messages' ? (
        <>
          {/* Header */}
          <FeedHeader
            notificationCount={5}
            onNotificationsClick={() => toast.info("Notifications coming soon")}
            onMessagesClick={() => setActiveTab('messages')}
            onCreateClick={() => setCreateSheetOpen(true)}
            onSearchClick={() => toast.info("Search coming soon")}
            onExploreClick={() => toast.info("Explore coming soon")}
          />
          <CommunityChat />
        </>
      ) : (
        <>
          {/* Header */}
          <FeedHeader
            notificationCount={5}
            onNotificationsClick={() => toast.info("Notifications coming soon")}
            onMessagesClick={() => setActiveTab('messages')}
            onCreateClick={() => setCreateSheetOpen(true)}
            onSearchClick={() => toast.info("Search coming soon")}
            onExploreClick={() => toast.info("Explore coming soon")}
          />

          {/* Stories Bar */}
          <div className="border-b border-border/50">
            <StoriesBar
              stories={mockStoryGroups}
              currentUserAvatar={mockCurrentUser.avatar_url}
              onStoryClick={handleStoryClick}
              onAddStory={handleAddStory}
            />
          </div>

          {/* Posts Feed */}
          <div className="divide-y divide-border">
            {mockPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handlePostLike}
                onComment={handlePostComment}
                onShare={handlePostShare}
                onSave={handlePostSave}
                onProfileClick={handleProfileClick}
              />
            ))}
          </div>
        </>
      )}

      {/* Story Viewer */}
      {storyViewerOpen && (
        <StoryViewer
          storyGroups={mockStoryGroups}
          initialGroupIndex={initialStoryIndex}
          onClose={() => setStoryViewerOpen(false)}
          onReply={(storyId, message) => {
            toast.success("Reply sent!");
          }}
          onReact={(storyId) => {
            toast.success("Reaction sent!");
          }}
        />
      )}

      {/* Create Post Sheet */}
      <CreatePostSheet
        open={createSheetOpen}
        onOpenChange={setCreateSheetOpen}
        profile={mockCurrentUser}
        onSubmit={handleCreateSubmit}
      />

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userAvatar={mockCurrentUser.avatar_url}
        userName={mockCurrentUser.name}
      />
    </div>
  );
}
