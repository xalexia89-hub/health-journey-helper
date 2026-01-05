import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, User, Users, Heart } from 'lucide-react';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  conditions: string[];
}

interface FamilyHistory {
  grandparents: FamilyMember[];
  parents: FamilyMember[];
  siblings: FamilyMember[];
}

interface FamilyTreeDialogProps {
  familyHistory: FamilyHistory;
  onSave: (history: FamilyHistory) => void;
  trigger: React.ReactNode;
}

const relationshipLabels: Record<string, string[]> = {
  grandparents: ['Παππούς (Πατρική)', 'Γιαγιά (Πατρική)', 'Παππούς (Μητρική)', 'Γιαγιά (Μητρική)'],
  parents: ['Πατέρας', 'Μητέρα'],
  siblings: ['Αδερφός/ή'],
};

const generationIcons: Record<string, React.ReactNode> = {
  grandparents: <Users className="h-4 w-4" />,
  parents: <User className="h-4 w-4" />,
  siblings: <Heart className="h-4 w-4" />,
};

const generationLabels: Record<string, string> = {
  grandparents: 'Παππούδες & Γιαγιάδες',
  parents: 'Γονείς',
  siblings: 'Αδέρφια',
};

export const FamilyTreeDialog = ({ familyHistory, onSave, trigger }: FamilyTreeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<FamilyHistory>(familyHistory);
  const [activeTab, setActiveTab] = useState('grandparents');
  
  // Form state for adding new member
  const [newName, setNewName] = useState('');
  const [newRelationship, setNewRelationship] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [editingMember, setEditingMember] = useState<string | null>(null);

  const handleAddMember = (generation: keyof FamilyHistory) => {
    if (!newName.trim()) return;
    
    const newMember: FamilyMember = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      relationship: newRelationship || relationshipLabels[generation][0],
      conditions: [],
    };
    
    setHistory(prev => ({
      ...prev,
      [generation]: [...prev[generation], newMember],
    }));
    
    setNewName('');
    setNewRelationship('');
  };

  const handleRemoveMember = (generation: keyof FamilyHistory, memberId: string) => {
    setHistory(prev => ({
      ...prev,
      [generation]: prev[generation].filter(m => m.id !== memberId),
    }));
  };

  const handleAddCondition = (generation: keyof FamilyHistory, memberId: string) => {
    if (!newCondition.trim()) return;
    
    setHistory(prev => ({
      ...prev,
      [generation]: prev[generation].map(m => 
        m.id === memberId 
          ? { ...m, conditions: [...m.conditions, newCondition.trim()] }
          : m
      ),
    }));
    
    setNewCondition('');
  };

  const handleRemoveCondition = (generation: keyof FamilyHistory, memberId: string, condition: string) => {
    setHistory(prev => ({
      ...prev,
      [generation]: prev[generation].map(m => 
        m.id === memberId 
          ? { ...m, conditions: m.conditions.filter(c => c !== condition) }
          : m
      ),
    }));
  };

  const handleSave = () => {
    onSave(history);
    setOpen(false);
  };

  const getMemberCount = (generation: keyof FamilyHistory) => history[generation]?.length || 0;
  const getTotalConditions = () => {
    return [...history.grandparents, ...history.parents, ...history.siblings]
      .reduce((acc, m) => acc + m.conditions.length, 0);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4">
          <div className="flex flex-col items-center gap-3">
            {/* Center Avatar */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Users className="h-7 w-7 text-white" />
            </div>
            <div className="text-center">
              <DialogTitle className="text-lg">
                Γενεαλογικό Δέντρο
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Καταγράψτε το οικογενειακό ιατρικό ιστορικό (έως 3 γενιές)
              </p>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="grandparents" className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Παππούδες</span>
                {getMemberCount('grandparents') > 0 && (
                  <Badge variant="secondary" className="h-5 w-5 p-0 justify-center text-xs">
                    {getMemberCount('grandparents')}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="parents" className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Γονείς</span>
                {getMemberCount('parents') > 0 && (
                  <Badge variant="secondary" className="h-5 w-5 p-0 justify-center text-xs">
                    {getMemberCount('parents')}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="siblings" className="flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Αδέρφια</span>
                {getMemberCount('siblings') > 0 && (
                  <Badge variant="secondary" className="h-5 w-5 p-0 justify-center text-xs">
                    {getMemberCount('siblings')}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[400px] px-6 py-4">
            {(['grandparents', 'parents', 'siblings'] as const).map((generation) => (
              <TabsContent key={generation} value={generation} className="m-0 space-y-4">
                {/* Add new member form */}
                <Card className="border-dashed">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Ονοματεπώνυμο</Label>
                          <Input
                            placeholder="π.χ. Γιώργος Παπαδόπουλος"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Σχέση</Label>
                          <select
                            value={newRelationship}
                            onChange={(e) => setNewRelationship(e.target.value)}
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          >
                            <option value="">Επιλέξτε...</option>
                            {relationshipLabels[generation].map((rel) => (
                              <option key={rel} value={rel}>{rel}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleAddMember(generation)}
                        disabled={!newName.trim()}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Προσθήκη {generationLabels[generation].split(' ')[0]}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Member list */}
                <div className="space-y-3">
                  {history[generation].map((member) => (
                    <Card key={member.id} className="overflow-hidden">
                      <CardHeader className="p-3 pb-2 bg-muted/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.relationship}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveMember(generation, member.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-2 space-y-2">
                        <Label className="text-xs text-muted-foreground">Παθήσεις / Ασθένειες</Label>
                        
                        {/* Conditions list */}
                        <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                          {member.conditions.map((condition, i) => (
                            <Badge 
                              key={i} 
                              variant="outline" 
                              className="pl-2 pr-1 py-0.5 text-xs bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
                            >
                              {condition}
                              <button
                                onClick={() => handleRemoveCondition(generation, member.id, condition)}
                                className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                              >
                                <X className="h-2.5 w-2.5" />
                              </button>
                            </Badge>
                          ))}
                          {member.conditions.length === 0 && (
                            <span className="text-xs text-muted-foreground italic">Δεν έχουν καταγραφεί</span>
                          )}
                        </div>

                        {/* Add condition */}
                        {editingMember === member.id ? (
                          <div className="flex gap-2">
                            <Input
                              placeholder="π.χ. Διαβήτης, Καρδιοπάθεια..."
                              value={newCondition}
                              onChange={(e) => setNewCondition(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddCondition(generation, member.id);
                                }
                              }}
                              className="h-8 text-sm"
                              autoFocus
                            />
                            <Button 
                              size="sm" 
                              className="h-8"
                              onClick={() => {
                                handleAddCondition(generation, member.id);
                              }}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-8"
                              onClick={() => {
                                setEditingMember(null);
                                setNewCondition('');
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs w-full justify-start text-muted-foreground hover:text-foreground"
                            onClick={() => setEditingMember(member.id)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Προσθήκη πάθησης
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  {history[generation].length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Δεν έχετε προσθέσει {generationLabels[generation].toLowerCase()}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>

        <div className="flex items-center justify-between p-4 border-t bg-muted/30">
          <p className="text-xs text-muted-foreground">
            Σύνολο: {getMemberCount('grandparents') + getMemberCount('parents') + getMemberCount('siblings')} μέλη, {getTotalConditions()} παθήσεις
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Ακύρωση
            </Button>
            <Button onClick={handleSave}>
              Αποθήκευση
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
