import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  FlaskConical, 
  ScanLine, 
  Stethoscope, 
  CalendarIcon, 
  Upload,
  X,
  File,
  Loader2,
  Plus
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useMedicalAuditLog } from '@/hooks/useMedicalAuditLog';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import { cn } from '@/lib/utils';

type EntryType = 'blood_test' | 'imaging' | 'diagnosis';

interface AddMedicalEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ENTRY_TYPES: { value: EntryType; label: string; icon: React.ReactNode }[] = [
  { value: 'blood_test', label: 'Αιματολογική Εξέταση', icon: <FlaskConical className="h-4 w-4" /> },
  { value: 'imaging', label: 'Απεικονιστική Εξέταση', icon: <ScanLine className="h-4 w-4" /> },
  { value: 'diagnosis', label: 'Διάγνωση', icon: <Stethoscope className="h-4 w-4" /> },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

export function AddMedicalEntryDialog({ open, onOpenChange, onSuccess }: AddMedicalEntryDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { logAction } = useMedicalAuditLog();

  const [entryType, setEntryType] = useState<EntryType>('blood_test');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [entryDate, setEntryDate] = useState<Date>(new Date());
  const [providerName, setProviderName] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [symptomSessions, setSymptomSessions] = useState<{ id: string; created_at: string }[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && user) {
      fetchSymptomSessions();
    }
  }, [open, user]);

  useEffect(() => {
    if (!open) {
      // Reset form
      setEntryType('blood_test');
      setTitle('');
      setDescription('');
      setEntryDate(new Date());
      setProviderName('');
      setTags([]);
      setNewTag('');
      setFiles([]);
      setSelectedSessionId('');
    }
  }, [open]);

  const fetchSymptomSessions = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('symptom_intakes')
      .select('id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);
    
    setSymptomSessions(data || []);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    const validFiles = selectedFiles.filter(file => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast({
          title: 'Μη έγκυρος τύπος αρχείου',
          description: `Το αρχείο ${file.name} δεν υποστηρίζεται`,
          variant: 'destructive',
        });
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: 'Πολύ μεγάλο αρχείο',
          description: `Το αρχείο ${file.name} ξεπερνά τα 10MB`,
          variant: 'destructive',
        });
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSave = async () => {
    if (!user || !title.trim()) {
      toast({
        title: 'Σφάλμα',
        description: 'Παρακαλώ συμπληρώστε τον τίτλο',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    try {
      // Create the entry
      const { data: entry, error: entryError } = await supabase
        .from('medical_entries')
        .insert({
          user_id: user.id,
          entry_type: entryType,
          title: title.trim(),
          description: description.trim() || null,
          entry_date: format(entryDate, 'yyyy-MM-dd'),
          provider_name: providerName.trim() || null,
          symptom_session_id: selectedSessionId || null,
          tags,
        })
        .select()
        .single();

      if (entryError) throw entryError;

      // Upload files
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}/${entry.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('medical-documents')
          .upload(filePath, file);

        if (uploadError) {
          console.error('File upload error:', uploadError);
          continue;
        }

        // Create attachment record
        await supabase.from('medical_entry_attachments').insert({
          entry_id: entry.id,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          uploaded_by: user.id,
        });
      }

      // Log the action
      await logAction('upload', user.id, 'medical_entry', entry.id, {
        title,
        entry_type: entryType,
        attachments_count: files.length,
      });

      toast({
        title: 'Επιτυχία',
        description: 'Η καταχώρηση αποθηκεύτηκε',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: 'Σφάλμα',
        description: 'Αποτυχία αποθήκευσης',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Νέα Καταχώρηση</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Entry Type */}
          <div className="space-y-2">
            <Label>Τύπος Καταχώρησης *</Label>
            <Select value={entryType} onValueChange={(v) => setEntryType(v as EntryType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ENTRY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      {type.icon}
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label>Τίτλος *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="π.χ. Γενική Αίματος, Ακτινογραφία Θώρακα..."
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Περιγραφή</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Προσθέστε λεπτομέρειες..."
              rows={3}
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Ημερομηνία *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !entryDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {entryDate ? format(entryDate, 'PPP', { locale: el }) : 'Επιλέξτε ημερομηνία'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={entryDate}
                  onSelect={(date) => date && setEntryDate(date)}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Provider Name */}
          <div className="space-y-2">
            <Label>Πάροχος / Εργαστήριο</Label>
            <Input
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              placeholder="π.χ. Διαγνωστικό Κέντρο Αθηνών..."
            />
          </div>

          {/* Link to Symptom Session */}
          {symptomSessions.length > 0 && (
            <div className="space-y-2">
              <Label>Σύνδεση με Συνεδρία AI</Label>
              <Select value={selectedSessionId} onValueChange={setSelectedSessionId}>
                <SelectTrigger>
                  <SelectValue placeholder="Επιλέξτε συνεδρία (προαιρετικό)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Καμία</SelectItem>
                  {symptomSessions.map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      Συνεδρία {format(new Date(session.created_at), 'dd/MM/yyyy HH:mm')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Tags */}
          <div className="space-y-2">
            <Label>Ετικέτες</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Προσθήκη ετικέτας..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" size="icon" onClick={addTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Αρχεία (PDF, JPG, PNG)</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={handleFileSelect}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Σύρετε αρχεία εδώ ή κάντε κλικ για επιλογή
                </span>
                <span className="text-xs text-muted-foreground">
                  Μέγιστο μέγεθος: 10MB
                </span>
              </label>
            </div>

            {files.length > 0 && (
              <div className="space-y-2 mt-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4" />
                      <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / 1024 / 1024).toFixed(1)}MB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Ακύρωση
          </Button>
          <Button onClick={handleSave} disabled={saving || !title.trim()}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Αποθήκευση...
              </>
            ) : (
              'Αποθήκευση'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
