import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, FileText, Image, File, Trash2, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MedicalDocument {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string | null;
  document_category: string | null;
  description: string | null;
  uploaded_at: string | null;
}

const DOCUMENT_CATEGORIES = [
  { value: 'exam_results', label: 'Αποτελέσματα Εξετάσεων' },
  { value: 'diagnosis', label: 'Γνωμοδοτήσεις / Διαγνώσεις' },
  { value: 'prescription', label: 'Συνταγές' },
  { value: 'imaging', label: 'Απεικονιστικές (Ακτινογραφίες, MRI)' },
  { value: 'referral', label: 'Παραπεμπτικά' },
  { value: 'other', label: 'Άλλο' },
];

export function DocumentUploadDialog() {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string>('other');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (open && user) {
      fetchDocuments();
    }
  }, [open, user]);

  const fetchDocuments = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('medical_documents')
      .select('*')
      .eq('user_id', user.id)
      .order('uploaded_at', { ascending: false });

    if (!error && data) {
      // Generate signed URLs for each document
      const docsWithSignedUrls = await Promise.all(
        data.map(async (doc) => {
          const { data: signedData } = await supabase.storage
            .from('medical-documents')
            .createSignedUrl(doc.file_url, 3600); // 1 hour expiry
          
          return {
            ...doc,
            file_url: signedData?.signedUrl || doc.file_url
          };
        })
      );
      setDocuments(docsWithSignedUrls as MedicalDocument[]);
    }
    setLoading(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'Σφάλμα',
          description: 'Το αρχείο είναι πολύ μεγάλο. Μέγιστο μέγεθος: 10MB',
          variant: 'destructive'
        });
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'Σφάλμα',
          description: 'Μη επιτρεπόμενος τύπος αρχείου. Επιτρέπονται: JPG, PNG, WebP, PDF',
          variant: 'destructive'
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;
    
    setUploading(true);
    
    try {
      // Generate unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('medical-documents')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Save file path to database (not public URL for security)
      const { error: dbError } = await supabase
        .from('medical_documents')
        .insert({
          user_id: user.id,
          file_name: selectedFile.name,
          file_url: fileName, // Store path, not public URL
          file_type: selectedFile.type,
          document_category: category,
          description: description || null
        });

      if (dbError) throw dbError;

      toast({
        title: 'Επιτυχία',
        description: 'Το αρχείο ανέβηκε επιτυχώς'
      });

      // Reset form
      setSelectedFile(null);
      setCategory('other');
      setDescription('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // Refresh documents list
      fetchDocuments();

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Σφάλμα',
        description: error.message || 'Αποτυχία μεταφόρτωσης αρχείου',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (doc: MedicalDocument) => {
    if (!user) return;
    
    try {
      // Get the original file path from database for deletion
      const { data: docData } = await supabase
        .from('medical_documents')
        .select('file_url')
        .eq('id', doc.id)
        .single();
      
      const filePath = docData?.file_url || '';
      
      // Delete from storage
      if (filePath && !filePath.startsWith('http')) {
        await supabase.storage
          .from('medical-documents')
          .remove([filePath]);
      }

      // Delete from database
      const { error } = await supabase
        .from('medical_documents')
        .delete()
        .eq('id', doc.id);

      if (error) throw error;

      toast({
        title: 'Διαγράφηκε',
        description: 'Το αρχείο διαγράφηκε επιτυχώς'
      });

      fetchDocuments();

    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: 'Σφάλμα',
        description: 'Αποτυχία διαγραφής αρχείου',
        variant: 'destructive'
      });
    }
  };

  const getFileIcon = (fileType: string | null) => {
    if (fileType?.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (fileType === 'application/pdf') return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const getCategoryLabel = (value: string | null) => {
    return DOCUMENT_CATEGORIES.find(c => c.value === value)?.label || 'Άλλο';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Upload className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Έγγραφα Υγείας</DialogTitle>
          <DialogDescription>
            Ανεβάστε και διαχειριστείτε τα ιατρικά σας έγγραφα
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Form */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="file">Επιλογή αρχείου</Label>
              <div className="flex gap-2">
                <Input
                  ref={fileInputRef}
                  id="file"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  onChange={handleFileSelect}
                  className="flex-1"
                />
                {selectedFile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Επιτρεπόμενοι τύποι: JPG, PNG, WebP, PDF (μέγ. 10MB)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Κατηγορία</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Περιγραφή (προαιρετικό)</Label>
              <Input
                id="description"
                placeholder="π.χ. Αιματολογικές Ιανουαρίου 2024"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <Button 
              className="w-full" 
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Μεταφόρτωση...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Ανέβασμα
                </>
              )}
            </Button>
          </div>

          {/* Documents List */}
          <div className="space-y-2">
            <Label>Τα έγγραφά μου</Label>
            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : documents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Δεν υπάρχουν έγγραφα
              </p>
            ) : (
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {documents.map(doc => (
                    <div 
                      key={doc.id} 
                      className="flex items-center gap-3 p-3 bg-background rounded-lg border"
                    >
                      <div className="p-2 bg-muted rounded">
                        {getFileIcon(doc.file_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <a 
                          href={doc.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm font-medium hover:underline truncate block"
                        >
                          {doc.file_name}
                        </a>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{getCategoryLabel(doc.document_category)}</span>
                          {doc.uploaded_at && (
                            <>
                              <span>•</span>
                              <span>{new Date(doc.uploaded_at).toLocaleDateString('el-GR')}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(doc)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
