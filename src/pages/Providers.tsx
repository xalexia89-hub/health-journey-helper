import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Search, Loader2, Star, MapPin, Clock } from "lucide-react";

interface Provider {
  id: string;
  name: string;
  type: 'doctor' | 'clinic' | 'hospital' | 'nurse';
  specialty: string | null;
  rating: number | null;
  review_count: number | null;
  price_min: number | null;
  price_max: number | null;
  city: string | null;
  avatar_url: string | null;
  is_verified: boolean | null;
}

const typeLabels: Record<string, string> = {
  doctor: 'Γιατροί',
  clinic: 'Κλινικές',
  hospital: 'Νοσοκομεία',
  nurse: 'Νοσηλευτές'
};

export default function Providers() {
  const [searchParams] = useSearchParams();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const typeFilter = searchParams.get('type');
  const specialtyFilter = searchParams.get('specialty');
  const sortBy = searchParams.get('sort') || 'rating';

  useEffect(() => {
    fetchProviders();
  }, [typeFilter, specialtyFilter, sortBy]);

  const fetchProviders = async () => {
    setLoading(true);
    let query = supabase.from('providers').select('*').eq('is_active', true);
    
    if (typeFilter && ['doctor', 'clinic', 'hospital', 'nurse'].includes(typeFilter)) {
      query = query.eq('type', typeFilter as 'doctor' | 'clinic' | 'hospital' | 'nurse');
    }
    
    // Filter by specialty if provided
    if (specialtyFilter) {
      query = query.ilike('specialty', `%${specialtyFilter}%`);
    }
    
    // Sort based on parameter
    if (sortBy === 'rating') {
      query = query.order('rating', { ascending: false, nullsFirst: false });
    } else {
      query = query.order('rating', { ascending: false, nullsFirst: false });
    }
    
    const { data } = await query;
    if (data) setProviders(data as Provider[]);
    setLoading(false);
  };

  const filteredProviders = providers.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.specialty?.toLowerCase().includes(search.toLowerCase())
  );

  // Build title
  let title = "Εύρεση Παρόχων";
  if (specialtyFilter) {
    title = specialtyFilter;
  } else if (typeFilter) {
    title = `Εύρεση ${typeLabels[typeFilter] || 'Παρόχων'}`;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title={title} />

      <div className="px-4 py-4 sticky top-[57px] bg-background/80 backdrop-blur-lg z-30 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Αναζήτηση με όνομα ή ειδικότητα..." 
            className="pl-10 h-12 rounded-xl" 
          />
        </div>
        
        {/* Active filters */}
        {(specialtyFilter || sortBy !== 'rating') && (
          <div className="flex flex-wrap gap-2">
            {specialtyFilter && (
              <Badge variant="secondary" className="gap-1">
                Ειδικότητα: {specialtyFilter}
              </Badge>
            )}
            {sortBy === 'rating' && (
              <Badge variant="outline" className="gap-1">
                <Star className="h-3 w-3" />
                Κατά βαθμολογία
              </Badge>
            )}
            {sortBy === 'distance' && (
              <Badge variant="outline" className="gap-1">
                <MapPin className="h-3 w-3" />
                Κατά απόσταση
              </Badge>
            )}
          </div>
        )}
      </div>

      <main className="px-4 pb-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredProviders.length > 0 ? (
          <div className="space-y-3">
            {filteredProviders.map((provider) => (
              <Link key={provider.id} to={`/providers/${provider.id}`}>
                <ProviderCard
                  id={provider.id}
                  name={provider.name}
                  type={provider.type}
                  specialty={provider.specialty || undefined}
                  rating={provider.rating || 0}
                  reviewCount={provider.review_count || 0}
                  priceMin={provider.price_min || undefined}
                  priceMax={provider.price_max || undefined}
                  city={provider.city || undefined}
                  avatarUrl={provider.avatar_url || undefined}
                  isVerified={provider.is_verified || false}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {specialtyFilter 
                ? `Δεν βρέθηκαν πάροχοι για "${specialtyFilter}"`
                : "Δεν βρέθηκαν πάροχοι"
              }
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
