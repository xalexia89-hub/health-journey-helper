import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle2, 
  Clock,
  AlertCircle
} from "lucide-react";

interface DocumentUploadSectionProps {
  documents: UploadedDocument[];
  onDocumentsChange: (docs: UploadedDocument[]) => void;
  requiredTypes?: DocumentType[];
}

export type DocumentType = 'license' | 'diploma' | 'id' | 'insurance' | 'other';

export interface UploadedDocument {
  id: string;
  type: DocumentType;
  fileName: string;
  file?: File;
  status: 'pending' | 'uploading' | 'uploaded' | 'error';
}

const documentTypeLabels: Record<DocumentType, string> = {
  license: 'Άδεια Άσκησης',
  diploma: 'Πτυχίο',
  id: 'Ταυτότητα',
  insurance: 'Ασφάλεια Ευθύνης',
  other: 'Άλλο'
};

const documentTypeDescriptions: Record<DocumentType, string> = {
  license: 'Επίσημη άδεια άσκησης επαγγέλματος',
  diploma: 'Πτυχίο ή πιστοποιητικό ειδικότητας',
  id: 'Ταυτότητα ή διαβατήριο',
  insurance: 'Ασφαλιστήριο επαγγελματικής ευθύνης',
  other: 'Άλλο σχετικό έγγραφο'
};

export function DocumentUploadSection({ 
  documents, 
  onDocumentsChange,
  requiredTypes = ['license', 'diploma']
}: DocumentUploadSectionProps) {
  const [selectedType, setSelectedType] = useState<DocumentType>('license');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: DocumentType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Επιτρεπόμενοι τύποι: PDF, JPEG, PNG');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Το αρχείο πρέπει να είναι μικρότερο από 10MB');
      return;
    }

    const newDoc: UploadedDocument = {
      id: `doc-${Date.now()}`,
      type,
      fileName: file.name,
      file,
      status: 'uploaded'
    };

    // Replace existing document of same type or add new
    const existingIndex = documents.findIndex(d => d.type === type);
    if (existingIndex >= 0) {
      const updated = [...documents];
      updated[existingIndex] = newDoc;
      onDocumentsChange(updated);
    } else {
      onDocumentsChange([...documents, newDoc]);
    }
  };

  const removeDocument = (id: string) => {
    onDocumentsChange(documents.filter(d => d.id !== id));
  };

  const getDocumentForType = (type: DocumentType) => {
    return documents.find(d => d.type === type);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Έγγραφα Πιστοποίησης</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Ανεβάστε τα απαραίτητα έγγραφα για την πιστοποίηση του λογαριασμού σας.
        Επιτρεπόμενοι τύποι: PDF, JPEG, PNG (μέχρι 10MB).
      </p>

      <div className="grid gap-3">
        {(['license', 'diploma', 'id', 'insurance'] as DocumentType[]).map((type) => {
          const doc = getDocumentForType(type);
          const isRequired = requiredTypes.includes(type);

          return (
            <Card key={type} className={`border ${doc ? 'border-success/50 bg-success/5' : isRequired ? 'border-warning/50' : 'border-border'}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{documentTypeLabels[type]}</span>
                      {isRequired && (
                        <Badge variant="outline" className="text-xs">Απαιτείται</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {documentTypeDescriptions[type]}
                    </p>

                    {doc && (
                      <div className="flex items-center gap-2 mt-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span className="text-sm text-success truncate max-w-[200px]">
                          {doc.fileName}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeDocument(doc.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`file-${type}`} className="cursor-pointer">
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        doc 
                          ? 'bg-muted text-muted-foreground hover:bg-muted/80' 
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      }`}>
                        <Upload className="h-4 w-4" />
                        {doc ? 'Αλλαγή' : 'Ανέβασμα'}
                      </div>
                    </Label>
                    <Input
                      id={`file-${type}`}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, type)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Status info */}
      <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg mt-4">
        <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
        <div className="text-xs text-muted-foreground">
          <p className="font-medium">Διαδικασία Επαλήθευσης</p>
          <p>Τα έγγραφά σας θα ελεγχθούν εντός 24-48 ωρών. Θα λάβετε ειδοποίηση μόλις ολοκληρωθεί η επαλήθευση.</p>
        </div>
      </div>
    </div>
  );
}
