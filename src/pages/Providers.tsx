import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Search, Filter, Loader2 } from "lucide-react";

interface Provider {
  id: string;
  name: string;
  type: 'doctor' | 'clinic' | 'hospital';
  specialty: string | null;
  rating: number | null;
  review_count: number | null;
  price_min: number | null;
  price_max: number | null;
  city: string | null;
  avatar_url: string | null;
  is_verified: boolean | null;
}

export default function Providers() {
  const [searchParams] = useSearchParams();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const typeFilter = searchParams.get('type');

  useEffect(() => {
    fetchProviders();
  }, [typeFilter]);

  const fetchProviders = async () => {
    let query = supabase.from('providers').select('*').eq('is_active', true);
    if (typeFilter) query = query.eq('type', typeFilter);
    
    const { data } = await query.order('rating', { ascending: false });
    if (data) setProviders(data as Provider[]);
    setLoading(false);
  };

  const filteredProviders = providers.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.specialty?.toLowerCase().includes(search.toLowerCase())
  );

  const title = typeFilter ? `Find ${typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}s` : "Find Providers";

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title={title} />

      <div className="px-4 py-4 sticky top-[57px] bg-background/80 backdrop-blur-lg z-30">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or specialty..." className="pl-10 h-12 rounded-xl" />
        </div>
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
            <p className="text-muted-foreground">No providers found</p>
          </div>
        )}
      </main>
    </div>
  );
}
