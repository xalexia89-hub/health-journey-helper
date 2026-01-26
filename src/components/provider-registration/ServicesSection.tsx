import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  Trash2, 
  Euro,
  Clock,
  Package
} from "lucide-react";

export interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  priceMin?: number;
  priceMax?: number;
  duration?: number; // in minutes
}

interface ServicesSectionProps {
  services: ServiceItem[];
  onServicesChange: (services: ServiceItem[]) => void;
  suggestedServices?: string[];
  title?: string;
}

export function ServicesSection({ 
  services, 
  onServicesChange,
  suggestedServices = [],
  title = "Υπηρεσίες & Τιμοκατάλογος"
}: ServicesSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState<Partial<ServiceItem>>({
    name: '',
    priceMin: undefined,
    priceMax: undefined,
    duration: 30
  });

  const addService = () => {
    if (!newService.name?.trim()) return;

    const service: ServiceItem = {
      id: `service-${Date.now()}`,
      name: newService.name.trim(),
      description: newService.description,
      priceMin: newService.priceMin,
      priceMax: newService.priceMax,
      duration: newService.duration
    };

    onServicesChange([...services, service]);
    setNewService({ name: '', priceMin: undefined, priceMax: undefined, duration: 30 });
    setShowAddForm(false);
  };

  const removeService = (id: string) => {
    onServicesChange(services.filter(s => s.id !== id));
  };

  const addSuggestedService = (name: string) => {
    if (services.some(s => s.name === name)) return;
    
    const service: ServiceItem = {
      id: `service-${Date.now()}`,
      name,
      duration: 30
    };
    onServicesChange([...services, service]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Package className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">{title}</h3>
      </div>

      {/* Suggested Services */}
      {suggestedServices.length > 0 && services.length < 5 && (
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">Προτεινόμενες υπηρεσίες:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedServices.slice(0, 8).map((service) => (
              <Button
                key={service}
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => addSuggestedService(service)}
                disabled={services.some(s => s.name === service)}
              >
                <Plus className="h-3 w-3 mr-1" />
                {service}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Services List */}
      {services.length > 0 && (
        <div className="space-y-2">
          {services.map((service) => (
            <Card key={service.id} className="bg-muted/30">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{service.name}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      {service.priceMin !== undefined && (
                        <span className="flex items-center gap-1">
                          <Euro className="h-3 w-3" />
                          {service.priceMin}{service.priceMax && service.priceMax !== service.priceMin ? `-${service.priceMax}` : ''}
                        </span>
                      )}
                      {service.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {service.duration} λεπτά
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => removeService(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Service Form */}
      {showAddForm ? (
        <Card className="border-primary/50">
          <CardContent className="p-4 space-y-3">
            <div>
              <Label className="text-xs">Όνομα υπηρεσίας *</Label>
              <Input
                value={newService.name || ''}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                placeholder="π.χ. Γενική εξέταση"
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs">Τιμή από (€)</Label>
                <Input
                  type="number"
                  value={newService.priceMin || ''}
                  onChange={(e) => setNewService({ ...newService, priceMin: Number(e.target.value) || undefined })}
                  placeholder="30"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Τιμή έως (€)</Label>
                <Input
                  type="number"
                  value={newService.priceMax || ''}
                  onChange={(e) => setNewService({ ...newService, priceMax: Number(e.target.value) || undefined })}
                  placeholder="50"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Διάρκεια (λεπτά)</Label>
                <Input
                  type="number"
                  value={newService.duration || ''}
                  onChange={(e) => setNewService({ ...newService, duration: Number(e.target.value) || undefined })}
                  placeholder="30"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setShowAddForm(false)}
              >
                Ακύρωση
              </Button>
              <Button
                type="button"
                size="sm"
                className="flex-1"
                onClick={addService}
                disabled={!newService.name?.trim()}
              >
                Προσθήκη
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Προσθήκη Υπηρεσίας
        </Button>
      )}

      <p className="text-xs text-muted-foreground">
        Προσθέστε τις υπηρεσίες που προσφέρετε με τις αντίστοιχες τιμές.
      </p>
    </div>
  );
}
