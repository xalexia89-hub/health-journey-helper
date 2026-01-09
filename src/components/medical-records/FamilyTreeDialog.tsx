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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, X, User, Edit2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

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

// Tree node component
function TreeNode({ 
  member, 
  onEdit, 
  onRemove,
  onAddCondition,
  onRemoveCondition,
  isEditing,
  setEditing,
  className,
}: { 
  member: FamilyMember;
  onEdit: (name: string) => void;
  onRemove: () => void;
  onAddCondition: (condition: string) => void;
  onRemoveCondition: (condition: string) => void;
  isEditing: boolean;
  setEditing: (editing: boolean) => void;
  className?: string;
}) {
  const [editName, setEditName] = useState(member.name);
  const [newCondition, setNewCondition] = useState('');
  const [showConditionInput, setShowConditionInput] = useState(false);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Node circle */}
      <div className="relative group">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/80 to-accent/60 flex items-center justify-center shadow-lg shadow-primary/20 border-2 border-primary/30">
          {isEditing ? (
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-12 h-6 text-[10px] text-center p-0 bg-transparent border-none text-white"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onEdit(editName);
                  setEditing(false);
                }
              }}
            />
          ) : (
            <span className="text-white font-semibold text-lg">
              {member.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        
        {/* Edit/Remove buttons */}
        <div className="absolute -top-1 -right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {isEditing ? (
            <button
              onClick={() => {
                onEdit(editName);
                setEditing(false);
              }}
              className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white shadow-sm"
            >
              <Check className="w-3 h-3" />
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white shadow-sm"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={onRemove}
            className="w-5 h-5 rounded-full bg-destructive flex items-center justify-center text-white shadow-sm"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
      
      {/* Name & Relationship */}
      <div className="mt-1 text-center max-w-[100px]">
        <p className="text-xs font-medium text-foreground truncate">{member.name}</p>
        <p className="text-[10px] text-muted-foreground">{member.relationship}</p>
      </div>
      
      {/* Conditions */}
      <div className="mt-1 flex flex-wrap justify-center gap-0.5 max-w-[120px]">
        {member.conditions.map((condition, i) => (
          <Badge 
            key={i} 
            variant="outline" 
            className="text-[9px] px-1.5 py-0 h-4 bg-destructive/10 border-destructive/30 text-destructive cursor-pointer hover:bg-destructive/20"
            onClick={() => onRemoveCondition(condition)}
          >
            {condition}
            <X className="w-2 h-2 ml-0.5" />
          </Badge>
        ))}
        {showConditionInput ? (
          <div className="flex items-center gap-0.5 mt-0.5">
            <Input
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              placeholder="Πάθηση..."
              className="h-5 w-16 text-[9px] px-1"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newCondition.trim()) {
                  onAddCondition(newCondition.trim());
                  setNewCondition('');
                  setShowConditionInput(false);
                }
                if (e.key === 'Escape') {
                  setShowConditionInput(false);
                  setNewCondition('');
                }
              }}
            />
            <button
              onClick={() => {
                if (newCondition.trim()) {
                  onAddCondition(newCondition.trim());
                  setNewCondition('');
                }
                setShowConditionInput(false);
              }}
              className="w-4 h-4 rounded bg-primary flex items-center justify-center text-white"
            >
              <Check className="w-2.5 h-2.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConditionInput(true)}
            className="text-[9px] px-1.5 py-0 h-4 rounded-full border border-dashed border-muted-foreground/50 text-muted-foreground hover:border-primary hover:text-primary flex items-center"
          >
            <Plus className="w-2 h-2 mr-0.5" />
            Πάθηση
          </button>
        )}
      </div>
    </div>
  );
}

// Empty slot for adding new member
function EmptySlot({ 
  label, 
  onAdd 
}: { 
  label: string; 
  onAdd: (name: string, relationship: string) => void;
}) {
  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState('');

  return (
    <div className="flex flex-col items-center">
      {showInput ? (
        <div className="flex flex-col items-center gap-1">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Όνομα..."
            className="h-7 w-20 text-xs text-center"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && name.trim()) {
                onAdd(name.trim(), label);
                setName('');
                setShowInput(false);
              }
              if (e.key === 'Escape') {
                setShowInput(false);
                setName('');
              }
            }}
          />
          <div className="flex gap-1">
            <Button
              size="sm"
              className="h-5 text-[10px] px-2"
              onClick={() => {
                if (name.trim()) {
                  onAdd(name.trim(), label);
                  setName('');
                  setShowInput(false);
                }
              }}
            >
              OK
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-5 text-[10px] px-2"
              onClick={() => {
                setShowInput(false);
                setName('');
              }}
            >
              ✕
            </Button>
          </div>
        </div>
      ) : (
        <>
          <button
            onClick={() => setShowInput(true)}
            className="w-14 h-14 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <Plus className="w-5 h-5 text-muted-foreground" />
          </button>
          <p className="mt-1 text-[10px] text-muted-foreground">{label}</p>
        </>
      )}
    </div>
  );
}

export const FamilyTreeDialog = ({ familyHistory, onSave, trigger }: FamilyTreeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<FamilyHistory>(familyHistory);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  const handleAddMember = (generation: keyof FamilyHistory, name: string, relationship: string) => {
    const newMember: FamilyMember = {
      id: crypto.randomUUID(),
      name,
      relationship,
      conditions: [],
    };
    setHistory(prev => ({
      ...prev,
      [generation]: [...prev[generation], newMember],
    }));
  };

  const handleEditMember = (generation: keyof FamilyHistory, memberId: string, name: string) => {
    setHistory(prev => ({
      ...prev,
      [generation]: prev[generation].map(m => m.id === memberId ? { ...m, name } : m),
    }));
  };

  const handleRemoveMember = (generation: keyof FamilyHistory, memberId: string) => {
    setHistory(prev => ({
      ...prev,
      [generation]: prev[generation].filter(m => m.id !== memberId),
    }));
  };

  const handleAddCondition = (generation: keyof FamilyHistory, memberId: string, condition: string) => {
    setHistory(prev => ({
      ...prev,
      [generation]: prev[generation].map(m => 
        m.id === memberId ? { ...m, conditions: [...m.conditions, condition] } : m
      ),
    }));
  };

  const handleRemoveCondition = (generation: keyof FamilyHistory, memberId: string, condition: string) => {
    setHistory(prev => ({
      ...prev,
      [generation]: prev[generation].map(m => 
        m.id === memberId ? { ...m, conditions: m.conditions.filter(c => c !== condition) } : m
      ),
    }));
  };

  const handleSave = () => {
    onSave(history);
    setOpen(false);
  };

  // Helper to get paternal/maternal grandparents
  const paternalGrandfather = history.grandparents.find(g => g.relationship.includes('Πατρική') && g.relationship.includes('Παππούς'));
  const paternalGrandmother = history.grandparents.find(g => g.relationship.includes('Πατρική') && g.relationship.includes('Γιαγιά'));
  const maternalGrandfather = history.grandparents.find(g => g.relationship.includes('Μητρική') && g.relationship.includes('Παππούς'));
  const maternalGrandmother = history.grandparents.find(g => g.relationship.includes('Μητρική') && g.relationship.includes('Γιαγιά'));
  const father = history.parents.find(p => p.relationship === 'Πατέρας');
  const mother = history.parents.find(p => p.relationship === 'Μητέρα');

  const renderMemberOrSlot = (
    member: FamilyMember | undefined,
    generation: keyof FamilyHistory,
    relationship: string
  ) => {
    if (member) {
      return (
        <TreeNode
          member={member}
          onEdit={(name) => handleEditMember(generation, member.id, name)}
          onRemove={() => handleRemoveMember(generation, member.id)}
          onAddCondition={(condition) => handleAddCondition(generation, member.id, condition)}
          onRemoveCondition={(condition) => handleRemoveCondition(generation, member.id, condition)}
          isEditing={editingMemberId === member.id}
          setEditing={(editing) => setEditingMemberId(editing ? member.id : null)}
        />
      );
    }
    return (
      <EmptySlot
        label={relationship}
        onAdd={(name, rel) => handleAddMember(generation, name, rel)}
      />
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[95vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2 border-b border-border/50">
          <DialogTitle className="text-center text-lg">
            🌳 Γενεαλογικό Δέντρο
          </DialogTitle>
          <p className="text-center text-xs text-muted-foreground">
            Πατήστε + για να προσθέσετε μέλος • Hover για επεξεργασία/διαγραφή
          </p>
        </DialogHeader>

        <ScrollArea className="h-[calc(95vh-180px)] min-h-[450px]">
          <div className="p-6 pb-8 min-w-[600px]">
            {/* Family Tree Visual */}
            <div className="relative">
              
              {/* GRANDPARENTS ROW */}
              <div className="flex justify-center gap-8 mb-2">
                {/* Paternal Grandparents */}
                <div className="flex gap-4 items-end">
                  {renderMemberOrSlot(paternalGrandfather, 'grandparents', 'Παππούς (Πατρική)')}
                  {renderMemberOrSlot(paternalGrandmother, 'grandparents', 'Γιαγιά (Πατρική)')}
                </div>
                
                {/* Maternal Grandparents */}
                <div className="flex gap-4 items-end">
                  {renderMemberOrSlot(maternalGrandfather, 'grandparents', 'Παππούς (Μητρική)')}
                  {renderMemberOrSlot(maternalGrandmother, 'grandparents', 'Γιαγιά (Μητρική)')}
                </div>
              </div>

              {/* Connection lines from grandparents to parents */}
              <div className="flex justify-center mb-2">
                <svg width="400" height="40" className="overflow-visible">
                  {/* Paternal side connector */}
                  <line x1="80" y1="0" x2="80" y2="20" stroke="currentColor" strokeWidth="2" className="text-primary/40" />
                  <line x1="80" y1="20" x2="130" y2="20" stroke="currentColor" strokeWidth="2" className="text-primary/40" />
                  <line x1="130" y1="20" x2="130" y2="40" stroke="currentColor" strokeWidth="2" className="text-primary/40" />
                  
                  {/* Maternal side connector */}
                  <line x1="320" y1="0" x2="320" y2="20" stroke="currentColor" strokeWidth="2" className="text-primary/40" />
                  <line x1="320" y1="20" x2="270" y2="20" stroke="currentColor" strokeWidth="2" className="text-primary/40" />
                  <line x1="270" y1="20" x2="270" y2="40" stroke="currentColor" strokeWidth="2" className="text-primary/40" />
                </svg>
              </div>

              {/* PARENTS ROW */}
              <div className="flex justify-center gap-24 mb-2">
                {renderMemberOrSlot(father, 'parents', 'Πατέρας')}
                {renderMemberOrSlot(mother, 'parents', 'Μητέρα')}
              </div>

              {/* Connection lines from parents to user */}
              <div className="flex justify-center mb-2">
                <svg width="200" height="40" className="overflow-visible">
                  <line x1="40" y1="0" x2="40" y2="20" stroke="currentColor" strokeWidth="2" className="text-primary/40" />
                  <line x1="40" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="2" className="text-primary/40" />
                  <line x1="160" y1="0" x2="160" y2="20" stroke="currentColor" strokeWidth="2" className="text-primary/40" />
                  <line x1="160" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="2" className="text-primary/40" />
                  <line x1="100" y1="20" x2="100" y2="40" stroke="currentColor" strokeWidth="2" className="text-primary/40" />
                </svg>
              </div>

              {/* USER (Center) */}
              <div className="flex justify-center mb-6 mt-2">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-xl shadow-accent/40 border-4 border-accent/60 ring-4 ring-accent/20">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <p className="mt-2 text-sm font-bold text-accent">Εσύ</p>
                </div>
              </div>

              {/* SIBLINGS ROW */}
              {history.siblings.length > 0 && (
                <>
                  <div className="flex justify-center mb-2">
                    <svg width="200" height="30" className="overflow-visible">
                      <line x1="100" y1="0" x2="100" y2="15" stroke="currentColor" strokeWidth="2" className="text-primary/40" />
                      <line x1="30" y1="15" x2="170" y2="15" stroke="currentColor" strokeWidth="2" className="text-primary/40" />
                    </svg>
                  </div>
                  <div className="flex justify-center gap-4 flex-wrap">
                    {history.siblings.map(sibling => (
                      <TreeNode
                        key={sibling.id}
                        member={sibling}
                        onEdit={(name) => handleEditMember('siblings', sibling.id, name)}
                        onRemove={() => handleRemoveMember('siblings', sibling.id)}
                        onAddCondition={(condition) => handleAddCondition('siblings', sibling.id, condition)}
                        onRemoveCondition={(condition) => handleRemoveCondition('siblings', sibling.id, condition)}
                        isEditing={editingMemberId === sibling.id}
                        setEditing={(editing) => setEditingMemberId(editing ? sibling.id : null)}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Add sibling button */}
              <div className="flex justify-center mt-4">
                <EmptySlot
                  label="Αδερφός/ή"
                  onAdd={(name, rel) => handleAddMember('siblings', name, rel)}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between p-4 border-t bg-muted/30">
          <p className="text-xs text-muted-foreground">
            {history.grandparents.length + history.parents.length + history.siblings.length} μέλη • 
            {' '}{[...history.grandparents, ...history.parents, ...history.siblings].reduce((acc, m) => acc + m.conditions.length, 0)} παθήσεις
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
