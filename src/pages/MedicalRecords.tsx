import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Pill, 
  AlertTriangle, 
  Stethoscope, 
  Scissors, 
  Plus, 
  X,
  Save,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MedicalRecord {
  id: string;
  allergies: string[] | null;
  chronic_conditions: string[] | null;
  current_medications: string[] | null;
  past_surgeries: string[] | null;
  notes: string | null;
}

const MedicalRecords = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newSurgery, setNewSurgery] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (user) fetchMedicalRecord();
  }, [user]);

  const fetchMedicalRecord = async () => {
    const { data } = await supabase
      .from('medical_records')
      .select('*')
      .eq('user_id', user?.id)
      .maybeSingle();

    if (data) {
      setRecord(data);
      setNotes(data.notes || '');
    }
    setLoading(false);
  };

  const addItem = (field: keyof MedicalRecord, value: string, setter: (v: string) => void) => {
    if (!value.trim() || !record) return;
    
    const currentArray = (record[field] as string[] | null) || [];
    if (!currentArray.includes(value.trim())) {
      setRecord({
        ...record,
        [field]: [...currentArray, value.trim()]
      });
    }
    setter('');
  };

  const removeItem = (field: keyof MedicalRecord, value: string) => {
    if (!record) return;
    const currentArray = (record[field] as string[] | null) || [];
    setRecord({
      ...record,
      [field]: currentArray.filter(item => item !== value)
    });
  };

  const handleSave = async () => {
    if (!record) return;
    
    setSaving(true);
    const { error } = await supabase
      .from('medical_records')
      .update({
        allergies: record.allergies,
        chronic_conditions: record.chronic_conditions,
        current_medications: record.current_medications,
        past_surgeries: record.past_surgeries,
        notes: notes
      })
      .eq('id', record.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to save medical records',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Saved',
        description: 'Your medical records have been updated'
      });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Medical records not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Medical Records</h1>
          <p className="text-muted-foreground">Manage your health information</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="allergies" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="allergies" className="text-xs sm:text-sm">
            <AlertTriangle className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Allergies</span>
          </TabsTrigger>
          <TabsTrigger value="conditions" className="text-xs sm:text-sm">
            <Stethoscope className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Conditions</span>
          </TabsTrigger>
          <TabsTrigger value="medications" className="text-xs sm:text-sm">
            <Pill className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Medications</span>
          </TabsTrigger>
          <TabsTrigger value="surgeries" className="text-xs sm:text-sm">
            <Scissors className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Surgeries</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="allergies" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-health-warning" />
                Allergies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add allergy (e.g., Penicillin, Peanuts)"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addItem('allergies', newAllergy, setNewAllergy)}
                />
                <Button onClick={() => addItem('allergies', newAllergy, setNewAllergy)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(record.allergies || []).map((allergy, i) => (
                  <Badge key={i} variant="secondary" className="pl-3 pr-1 py-1">
                    {allergy}
                    <button
                      onClick={() => removeItem('allergies', allergy)}
                      className="ml-2 hover:bg-destructive/20 rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {(!record.allergies || record.allergies.length === 0) && (
                  <p className="text-sm text-muted-foreground">No allergies recorded</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Stethoscope className="h-5 w-5 text-primary" />
                Chronic Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add condition (e.g., Diabetes, Hypertension)"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addItem('chronic_conditions', newCondition, setNewCondition)}
                />
                <Button onClick={() => addItem('chronic_conditions', newCondition, setNewCondition)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(record.chronic_conditions || []).map((condition, i) => (
                  <Badge key={i} variant="secondary" className="pl-3 pr-1 py-1">
                    {condition}
                    <button
                      onClick={() => removeItem('chronic_conditions', condition)}
                      className="ml-2 hover:bg-destructive/20 rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {(!record.chronic_conditions || record.chronic_conditions.length === 0) && (
                  <p className="text-sm text-muted-foreground">No conditions recorded</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Pill className="h-5 w-5 text-health-info" />
                Current Medications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add medication (e.g., Metformin 500mg)"
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addItem('current_medications', newMedication, setNewMedication)}
                />
                <Button onClick={() => addItem('current_medications', newMedication, setNewMedication)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(record.current_medications || []).map((medication, i) => (
                  <Badge key={i} variant="secondary" className="pl-3 pr-1 py-1">
                    {medication}
                    <button
                      onClick={() => removeItem('current_medications', medication)}
                      className="ml-2 hover:bg-destructive/20 rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {(!record.current_medications || record.current_medications.length === 0) && (
                  <p className="text-sm text-muted-foreground">No medications recorded</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="surgeries" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Scissors className="h-5 w-5 text-health-danger" />
                Past Surgeries
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add surgery (e.g., Appendectomy 2020)"
                  value={newSurgery}
                  onChange={(e) => setNewSurgery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addItem('past_surgeries', newSurgery, setNewSurgery)}
                />
                <Button onClick={() => addItem('past_surgeries', newSurgery, setNewSurgery)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(record.past_surgeries || []).map((surgery, i) => (
                  <Badge key={i} variant="secondary" className="pl-3 pr-1 py-1">
                    {surgery}
                    <button
                      onClick={() => removeItem('past_surgeries', surgery)}
                      className="ml-2 hover:bg-destructive/20 rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {(!record.past_surgeries || record.past_surgeries.length === 0) && (
                  <p className="text-sm text-muted-foreground">No surgeries recorded</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Additional Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add any additional medical information or notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalRecords;
