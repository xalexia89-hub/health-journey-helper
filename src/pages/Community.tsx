import { useState } from "react";
import { 
  CommunityNav, 
  HumanStoryCard, 
  KnowledgeCard, 
  MissionReelCard, 
  PulseMomentCard,
  CreatePulseButton,
  PostCategory,
  HumanStory,
  KnowledgePost,
  MissionReel,
  PulseMoment
} from "@/components/community-future";

// Demo data - in production this would come from Supabase
const mockStories: HumanStory[] = [
  {
    id: '1',
    author: {
      id: 'a1',
      user_id: 'u1',
      display_name: 'Δρ. Μαρία Παπαδοπούλου',
      role: 'doctor',
      specialty: 'Καρδιολογία',
      hospital: 'Ευαγγελισμός',
      pulse_state: 'present',
      years_of_service: 12,
      is_verified: true,
      created_at: new Date().toISOString()
    },
    content: 'Σήμερα ένας ασθενής μου είπε "ευχαριστώ που με ακούσατε". Δεν του έδωσα κανένα φάρμακο. Απλά κάθισα δίπλα του για 10 λεπτά. Μερικές φορές η θεραπεία είναι η παρουσία.',
    emotion: 'reflection',
    timestamp: 'Πριν 2 ώρες',
    acknowledgments: 47,
    is_anonymous: false
  },
  {
    id: '2',
    author: {
      id: 'a2',
      user_id: 'u2',
      display_name: 'Ανώνυμος',
      role: 'nurse',
      pulse_state: 'reflecting',
      years_of_service: 8,
      is_verified: true,
      created_at: new Date().toISOString()
    },
    content: 'Μετά από 12ωρη βάρδια, βρήκα ένα σημείωμα στην τσέπη μου από την οικογένεια ενός ασθενούς. "Δεν θα σας ξεχάσουμε ποτέ." Αυτές οι στιγμές με κρατάνε.',
    emotion: 'gratitude',
    timestamp: 'Πριν 5 ώρες',
    acknowledgments: 89,
    is_anonymous: true
  }
];

const mockKnowledge: KnowledgePost[] = [
  {
    id: 'k1',
    author: {
      id: 'a3',
      user_id: 'u3',
      display_name: 'Δρ. Νίκος Αντωνίου',
      role: 'physician',
      specialty: 'Νευρολογία',
      hospital: 'ΑΧΕΠΑ',
      pulse_state: 'focused',
      years_of_service: 15,
      is_verified: true,
      created_at: new Date().toISOString()
    },
    title: 'Η δύναμη της ενσυναίσθησης στη διάγνωση',
    insight: 'Ένας ασθενής με "αόριστους πονοκεφάλους" αποκάλυψε ότι έχασε τη μητέρα του πρόσφατα. Η σωματοποίηση του πένθους είναι πραγματική. Πριν ζητήσουμε MRI, ας ρωτήσουμε "πώς είστε;"',
    category: 'patient-care',
    learned_from: 'Σήμερα στο ιατρείο...',
    timestamp: 'Πριν 3 ώρες',
    resonances: 156
  },
  {
    id: 'k2',
    author: {
      id: 'a4',
      user_id: 'u4',
      display_name: 'Ελένη Σταματίου',
      role: 'nurse',
      specialty: 'ΜΕΘ',
      hospital: 'Παπαγεωργίου',
      pulse_state: 'supporting',
      years_of_service: 10,
      is_verified: true,
      created_at: new Date().toISOString()
    },
    title: 'Burnout δεν σημαίνει αποτυχία',
    insight: 'Μετά από 3 χρόνια πανδημίας, έμαθα ότι το να ζητάς βοήθεια δεν είναι αδυναμία. Ζήτησα άδεια. Μίλησα σε ψυχολόγο. Επέστρεψα πιο δυνατή. Φροντίστε τον εαυτό σας, συνάδελφοι.',
    category: 'self-care',
    learned_from: 'Από προσωπική εμπειρία...',
    timestamp: 'Χθες',
    resonances: 312
  }
];

const mockReels: MissionReel[] = [
  {
    id: 'r1',
    author: {
      id: 'a5',
      user_id: 'u5',
      display_name: 'Δρ. Γιώργος Δημητρίου',
      role: 'doctor',
      specialty: 'Παιδιατρική',
      hospital: 'Παίδων Αγλαΐα Κυριακού',
      avatar_url: undefined,
      pulse_state: 'present',
      years_of_service: 20,
      is_verified: true,
      created_at: new Date().toISOString()
    },
    transcript: 'Διάλεξα την παιδιατρική γιατί τα παιδιά δεν ξέρουν να κρύβουν τον πόνο τους. Και όταν θεραπεύονται, η χαρά τους είναι η πιο αληθινή που θα δεις ποτέ...',
    duration_seconds: 28,
    theme: 'why-medicine',
    timestamp: 'Πριν 1 ημέρα',
    witnessed_by: 234
  }
];

const mockPulseMoments: PulseMoment[] = [
  {
    id: 'p1',
    author: {
      id: 'a6',
      user_id: 'u6',
      display_name: 'Αναστασία Κ.',
      role: 'nurse',
      specialty: 'Ογκολογία',
      pulse_state: 'present',
      years_of_service: 7,
      is_verified: true,
      created_at: new Date().toISOString()
    },
    pulse_type: 'breathing',
    message: 'Μεταξύ δύο δύσκολων διαγνώσεων',
    duration_minutes: 5,
    supporters: 23,
    timestamp: 'Τώρα'
  },
  {
    id: 'p2',
    author: {
      id: 'a7',
      user_id: 'u7',
      display_name: 'Δρ. Κώστας Π.',
      role: 'doctor',
      specialty: 'Χειρουργική',
      pulse_state: 'present',
      years_of_service: 18,
      is_verified: true,
      created_at: new Date().toISOString()
    },
    pulse_type: 'grateful',
    message: 'Επιτυχής επέμβαση μετά από 6 ώρες',
    duration_minutes: 10,
    supporters: 67,
    timestamp: 'Πριν 30 λεπτά'
  }
];

export default function Community() {
  const [activeCategory, setActiveCategory] = useState<PostCategory | 'all'>('all');

  const handleCategoryChange = (category: PostCategory | 'all') => {
    setActiveCategory(category);
  };

  const handleCreatePulse = () => {
    // TODO: Open create pulse dialog
    console.log('Create new pulse');
  };

  // Filter content based on active category
  const showStories = activeCategory === 'all' || activeCategory === 'human-story';
  const showKnowledge = activeCategory === 'all' || activeCategory === 'knowledge';
  const showReels = activeCategory === 'all' || activeCategory === 'mission-reel';
  const showPulse = activeCategory === 'all' || activeCategory === 'pulse-moment';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Navigation */}
      <CommunityNav 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange}
      />
      
      {/* Content */}
      <main className="px-4 py-6 pb-32 max-w-2xl mx-auto">
        <div className="space-y-6">
          {/* Pulse Moments - Always at top when shown */}
          {showPulse && mockPulseMoments.map((moment) => (
            <PulseMomentCard 
              key={moment.id} 
              moment={moment}
              onSupport={() => console.log('Support', moment.id)}
            />
          ))}
          
          {/* Human Stories */}
          {showStories && mockStories.map((story) => (
            <HumanStoryCard 
              key={story.id} 
              story={story}
              onAcknowledge={() => console.log('Acknowledge', story.id)}
            />
          ))}
          
          {/* Knowledge Posts */}
          {showKnowledge && mockKnowledge.map((post) => (
            <KnowledgeCard 
              key={post.id} 
              post={post}
              onResonate={() => console.log('Resonate', post.id)}
            />
          ))}
          
          {/* Mission Reels */}
          {showReels && mockReels.map((reel) => (
            <MissionReelCard 
              key={reel.id} 
              reel={reel}
              onWitness={() => console.log('Witness', reel.id)}
            />
          ))}
        </div>
      </main>
      
      {/* Create button */}
      <CreatePulseButton onClick={handleCreatePulse} />
    </div>
  );
}
