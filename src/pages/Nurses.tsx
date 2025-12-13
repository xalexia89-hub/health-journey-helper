import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Search, Loader2, Heart, MapPin, Clock, Home } from "lucide-react";

interface Nurse {
  id: string;
  name: string;
  type: 'nurse';
  specialty: string | null;
  rating: number | null;
  review_count: number | null;
  price_min: number | null;
  price_max: number | null;
  city: string | null;
  avatar_url: string | null;
  is_verified: boolean | null;
  services: string[] | null;
}

const nursingServices = [
  { id: 'all', label: 'Όλες', icon: Heart },
  { id: 'wound_care', label: 'Περιποίηση τραυμάτων', icon: Heart },
  { id: 'injections', label: 'Ενέσεις', icon: Heart },
  { id: 'iv_therapy', label: 'Ορο-θεραπεία', icon: Heart },
  { id: 'elderly_care', label: 'Φροντίδα ηλικιωμένων', icon: Heart },
  { id: 'post_op', label: 'Μετεγχειρητική', icon: Heart },
];

export default function Nurses() {
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState('all');

  useEffect(() => {
    fetchNurses();
  }, []);

  const fetchNurses = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('providers')
      .select('*')
      .eq('is_active', true)
      .eq('type', 'nurse')
      .order('rating', { ascending: false, nullsFirst: false });
    
    if (data) setNurses(data as unknown as Nurse[]);
    setLoading(false);
  };

  const filteredNurses = nurses.filter(n => 
    n.name.toLowerCase().includes(search.toLowerCase()) ||
    n.specialty?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Κατ' Οίκον Νοσηλεία" />

      {/* Hero Section */}
      <div className="px-4 py-6 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary/20 rounded-2xl">
            <Home className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Νοσηλεία στο Σπίτι</h2>
            <p className="text-sm text-muted-foreground">Εξειδικευμένοι νοσηλευτές κοντά σας</p>
          </div>
        </div>
        
        {/* Services Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {nursingServices.map((service) => (
            <Badge
              key={service.id}
              variant={selectedService === service.id ? "default" : "secondary"}
              className="cursor-pointer whitespace-nowrap py-2 px-4 text-sm"
              onClick={() => setSelectedService(service.id)}
            >
              {service.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-4 sticky top-[57px] bg-background/80 backdrop-blur-lg z-30">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Αναζήτηση νοσηλευτή..." 
            className="pl-10 h-12 rounded-xl" 
          />
        </div>
      </div>

      {/* Info Cards */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-4 border border-border">
            <Clock className="h-5 w-5 text-primary mb-2" />
            <p className="text-sm font-medium">24/7 Διαθεσιμότητα</p>
            <p className="text-xs text-muted-foreground">Άμεση ανταπόκριση</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <MapPin className="h-5 w-5 text-primary mb-2" />
            <p className="text-sm font-medium">Σε Όλη την Ελλάδα</p>
            <p className="text-xs text-muted-foreground">Πιστοποιημένοι νοσηλευτές</p>
          </div>
        </div>
      </div>

      {/* Nurses List */}
      <main className="px-4 pb-6">
        <h3 className="text-lg font-semibold mb-3">Διαθέσιμοι Νοσηλευτές</h3>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredNurses.length > 0 ? (
          <div className="space-y-3">
            {filteredNurses.map((nurse) => (
              <Link key={nurse.id} to={`/providers/${nurse.id}`}>
                <ProviderCard
                  id={nurse.id}
                  name={nurse.name}
                  type={nurse.type}
                  specialty={nurse.specialty || "Γενική Νοσηλεία"}
                  rating={nurse.rating || 0}
                  reviewCount={nurse.review_count || 0}
                  priceMin={nurse.price_min || undefined}
                  priceMax={nurse.price_max || undefined}
                  city={nurse.city || undefined}
                  avatarUrl={nurse.avatar_url || undefined}
                  isVerified={nurse.is_verified || false}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <Heart className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">Δεν βρέθηκαν νοσηλευτές</p>
            <p className="text-sm text-muted-foreground mt-1">Σύντομα θα υπάρχουν διαθέσιμοι</p>
          </div>
        )}
      </main>
    </div>
  );
}