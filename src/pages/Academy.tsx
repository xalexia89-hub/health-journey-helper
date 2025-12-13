import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Play, 
  FileText, 
  BookOpen, 
  Search, 
  Eye, 
  Heart, 
  Download,
  Clock,
  User,
  Globe,
  Sparkles,
  GraduationCap
} from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  duration_minutes: number | null;
  category: string;
  view_count: number | null;
  like_count: number | null;
  created_at: string | null;
  providers: {
    name: string;
    avatar_url: string | null;
    specialty: string | null;
  } | null;
}

interface Publication {
  id: string;
  title: string;
  abstract: string | null;
  category: string;
  citation_count: number | null;
  download_count: number | null;
  journal_name: string | null;
  created_at: string | null;
  providers: {
    name: string;
    avatar_url: string | null;
    specialty: string | null;
  } | null;
}

interface CaseStudy {
  id: string;
  title: string;
  summary: string | null;
  category: string;
  view_count: number | null;
  created_at: string | null;
  providers: {
    name: string;
    avatar_url: string | null;
    specialty: string | null;
  } | null;
}

const categoryLabels: Record<string, string> = {
  cardiology: 'Καρδιολογία',
  neurology: 'Νευρολογία',
  oncology: 'Ογκολογία',
  pediatrics: 'Παιδιατρική',
  surgery: 'Χειρουργική',
  internal_medicine: 'Παθολογία',
  dermatology: 'Δερματολογία',
  psychiatry: 'Ψυχιατρική',
  orthopedics: 'Ορθοπεδική',
  other: 'Άλλο'
};

export default function Academy() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('videos');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    
    const [videosRes, pubsRes, casesRes] = await Promise.all([
      supabase
        .from('academy_videos')
        .select('*, providers(name, avatar_url, specialty)')
        .eq('status', 'published')
        .order('created_at', { ascending: false }),
      supabase
        .from('academy_publications')
        .select('*, providers(name, avatar_url, specialty)')
        .eq('status', 'published')
        .order('created_at', { ascending: false }),
      supabase
        .from('academy_case_studies')
        .select('*, providers(name, avatar_url, specialty)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
    ]);

    if (videosRes.data) setVideos(videosRes.data);
    if (pubsRes.data) setPublications(pubsRes.data);
    if (casesRes.data) setCaseStudies(casesRes.data);
    
    setLoading(false);
  };

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPublications = publications.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.abstract?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCaseStudies = caseStudies.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Futuristic Background */}
      <div className="fixed inset-0 bg-mesh-futuristic opacity-30 pointer-events-none" />
      <div className="fixed inset-0 bg-grid-futuristic opacity-20 pointer-events-none" />
      
      {/* Floating Orbs */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-soft pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-futuristic mb-6 shadow-futuristic">
            <Sparkles className="w-5 h-5 text-accent animate-pulse" />
            <span className="text-sm font-medium gradient-text">Medical Academy</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Ιατρική</span>{' '}
            <span className="text-foreground">Ακαδημία</span>
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Ανακαλύψτε γνώσεις από κορυφαίους ιατρούς παγκοσμίως μέσα από βίντεο, 
            έρευνες και κλινικές μελέτες περιπτώσεων.
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="glass-futuristic px-6 py-4 rounded-2xl shadow-futuristic">
              <div className="text-3xl font-bold gradient-text">{videos.length}</div>
              <div className="text-sm text-muted-foreground">Βίντεο</div>
            </div>
            <div className="glass-futuristic px-6 py-4 rounded-2xl shadow-futuristic">
              <div className="text-3xl font-bold gradient-text">{publications.length}</div>
              <div className="text-sm text-muted-foreground">Έρευνες</div>
            </div>
            <div className="glass-futuristic px-6 py-4 rounded-2xl shadow-futuristic">
              <div className="text-3xl font-bold gradient-text">{caseStudies.length}</div>
              <div className="text-sm text-muted-foreground">Περιπτώσεις</div>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Αναζήτηση περιεχομένου..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 glass-futuristic border-primary/20 focus:border-primary/50 text-lg rounded-2xl"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-md mx-auto glass-futuristic h-14 p-1 rounded-2xl mb-8">
            <TabsTrigger 
              value="videos" 
              className="flex-1 h-12 rounded-xl data-[state=active]:gradient-futuristic data-[state=active]:text-white gap-2"
            >
              <Play className="w-4 h-4" />
              Βίντεο
            </TabsTrigger>
            <TabsTrigger 
              value="publications"
              className="flex-1 h-12 rounded-xl data-[state=active]:gradient-futuristic data-[state=active]:text-white gap-2"
            >
              <FileText className="w-4 h-4" />
              Έρευνες
            </TabsTrigger>
            <TabsTrigger 
              value="cases"
              className="flex-1 h-12 rounded-xl data-[state=active]:gradient-futuristic data-[state=active]:text-white gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Περιπτώσεις
            </TabsTrigger>
          </TabsList>

          {/* Videos Tab */}
          <TabsContent value="videos" className="animate-fade-in">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="glass-futuristic animate-pulse">
                    <div className="aspect-video bg-muted rounded-t-xl" />
                    <CardContent className="p-4">
                      <div className="h-6 bg-muted rounded mb-2" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                  <Card key={video.id} className="glass-futuristic overflow-hidden group hover:shadow-glow-accent transition-all duration-300 cursor-pointer">
                    <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20">
                      {video.thumbnail_url ? (
                        <img 
                          src={video.thumbnail_url} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <GraduationCap className="w-16 h-16 text-primary/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full gradient-futuristic flex items-center justify-center shadow-futuristic">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                      {video.duration_minutes && (
                        <Badge className="absolute bottom-2 right-2 bg-background/80 text-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          {video.duration_minutes} λεπ.
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <Badge variant="outline" className="mb-2 text-xs">
                        {categoryLabels[video.category] || video.category}
                      </Badge>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {video.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{video.providers?.name || 'Ανώνυμος'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {video.view_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {video.like_count || 0}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={<Play className="w-16 h-16" />}
                title="Δεν υπάρχουν βίντεο"
                description="Τα εκπαιδευτικά βίντεο θα εμφανιστούν εδώ μόλις δημοσιευτούν."
              />
            )}
          </TabsContent>

          {/* Publications Tab */}
          <TabsContent value="publications" className="animate-fade-in">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <Card key={i} className="glass-futuristic animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 bg-muted rounded mb-4" />
                      <div className="h-4 bg-muted rounded mb-2" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredPublications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPublications.map((pub) => (
                  <Card key={pub.id} className="glass-futuristic hover:shadow-glow-accent transition-all duration-300 cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Badge variant="outline" className="text-xs">
                          {categoryLabels[pub.category] || pub.category}
                        </Badge>
                        {pub.journal_name && (
                          <Badge className="bg-accent/20 text-accent text-xs">
                            {pub.journal_name}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {pub.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {pub.abstract && (
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {pub.abstract}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>{pub.providers?.name || 'Ανώνυμος'}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {pub.citation_count || 0} αναφορές
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            {pub.download_count || 0}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={<FileText className="w-16 h-16" />}
                title="Δεν υπάρχουν έρευνες"
                description="Οι επιστημονικές έρευνες θα εμφανιστούν εδώ μόλις δημοσιευτούν."
              />
            )}
          </TabsContent>

          {/* Case Studies Tab */}
          <TabsContent value="cases" className="animate-fade-in">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="glass-futuristic animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 bg-muted rounded mb-4" />
                      <div className="h-4 bg-muted rounded mb-2" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredCaseStudies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCaseStudies.map((cs) => (
                  <Card key={cs.id} className="glass-futuristic hover:shadow-glow-accent transition-all duration-300 cursor-pointer group">
                    <CardHeader>
                      <Badge variant="outline" className="w-fit text-xs">
                        {categoryLabels[cs.category] || cs.category}
                      </Badge>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {cs.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {cs.summary && (
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                          {cs.summary}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{cs.providers?.name || 'Ανώνυμος'}</span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {cs.view_count || 0} προβολές
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={<BookOpen className="w-16 h-16" />}
                title="Δεν υπάρχουν περιπτώσεις"
                description="Οι κλινικές περιπτώσεις θα εμφανιστούν εδώ μόλις δημοσιευτούν."
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function EmptyState({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-32 h-32 rounded-full glass-futuristic flex items-center justify-center mb-6 text-muted-foreground">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md">{description}</p>
    </div>
  );
}
