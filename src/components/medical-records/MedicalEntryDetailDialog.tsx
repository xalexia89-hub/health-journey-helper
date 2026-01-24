import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FlaskConical, 
  ScanLine, 
  Stethoscope, 
  Calendar,
  Building,
  Download,
  FileText,
  Image,
  File,
  ExternalLink,
  Loader2,
  Link as LinkIcon
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useMedicalAuditLog } from '@/hooks/useMedicalAuditLog';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';

type EntryType = 'blood_test' | 'imaging' | 'diagnosis';

interface Attachment {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number | null;
  created_at: string;
}

interface MedicalEntry {
  id: string;
  entry_type: EntryType;
  title: string;
  description: string | null;
  entry_date: string;
  provider_name: string | null;
  provider_id: string | null;
  symptom_session_id: string | null;
  tags: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  attachments?: Attachment[];
}

interface MedicalEntryDetailDialogProps {
  entry: MedicalEntry | null;
  onClose: () => void;
  onRefresh: () => void;
}

const ENTRY_TYPE_CONFIG: Record<EntryType, { label: string; icon: React.ReactNode; color: string }> = {
  blood_test: {
    label: 'Αιματολογική Εξέταση',
    icon: <FlaskConical className="h-5 w-5" />,
    color: 'text-rose-500',
  },
  imaging: {
    label: 'Απεικονιστική Εξέταση',
    icon: <ScanLine className="h-5 w-5" />,
    color: 'text-blue-500',
  },
  diagnosis: {
    label: 'Διάγνωση',
    icon: <Stethoscope className="h-5 w-5" />,
    color: 'text-emerald-500',
  },
};

export function MedicalEntryDetailDialog({ entry, onClose, onRefresh }: MedicalEntryDetailDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { logAction } = useMedicalAuditLog();
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  if (!entry) return null;

  const config = ENTRY_TYPE_CONFIG[entry.entry_type];

  const handleDownloadFile = async (attachment: Attachment) => {
    if (!user) return;

    setDownloadingFile(attachment.id);

    try {
      const { data, error } = await supabase.storage
        .from('medical-documents')
        .createSignedUrl(attachment.file_path, 60);

      if (error) throw error;

      // Log the download
      await logAction('download', user.id, 'attachment', attachment.id, {
        file_name: attachment.file_name,
        entry_id: entry.id,
      });

      // Open in new tab
      window.open(data.signedUrl, '_blank');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: 'Σφάλμα',
        description: 'Αποτυχία λήψης αρχείου',
        variant: 'destructive',
      });
    } finally {
      setDownloadingFile(null);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (fileType === 'application/pdf') return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <Dialog open={!!entry} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={config.color}>{config.icon}</div>
            <div>
              <Badge variant="outline" className="mb-1">
                {config.label}
              </Badge>
              <DialogTitle className="text-xl">{entry.title}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(new Date(entry.entry_date), 'dd MMMM yyyy', { locale: el })}
            </div>
            {entry.provider_name && (
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                {entry.provider_name}
              </div>
            )}
          </div>

          {/* Description */}
          {entry.description && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Περιγραφή</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {entry.description}
                </p>
              </div>
            </>
          )}

          {/* Linked Session */}
          {entry.symptom_session_id && (
            <>
              <Separator />
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <LinkIcon className="h-4 w-4 text-primary" />
                <span className="text-sm">
                  Συνδεδεμένη με συνεδρία AI
                </span>
              </div>
            </>
          )}

          {/* Tags */}
          {entry.tags.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Ετικέτες</h4>
                <div className="flex flex-wrap gap-1">
                  {entry.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Attachments */}
          {entry.attachments && entry.attachments.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">
                  Συνημμένα ({entry.attachments.length})
                </h4>
                <div className="space-y-2">
                  {entry.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {getFileIcon(attachment.file_type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {attachment.file_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(attachment.file_size)} • {format(new Date(attachment.created_at), 'dd/MM/yyyy')}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadFile(attachment)}
                        disabled={downloadingFile === attachment.id}
                      >
                        {downloadingFile === attachment.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Άνοιγμα
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Created At */}
          <div className="text-xs text-muted-foreground text-center pt-4">
            Δημιουργήθηκε: {format(new Date(entry.created_at), 'dd/MM/yyyy HH:mm')}
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Κλείσιμο
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
