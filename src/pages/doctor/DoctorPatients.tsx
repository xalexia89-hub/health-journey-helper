import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Mail, Phone, Calendar, FileText, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { el } from 'date-fns/locale';
import { useDoctorAccessLog } from '@/hooks/useDoctorAccessLog';
import { AdvisorBanner } from '@/components/pilot/AdvisorBanner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Patient {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  blood_type: string | null;
  avatar_url: string | null;
  appointmentCount: number;
  lastAppointment: string | null;
}

interface MedicalRecord {
  allergies: string[] | null;
  chronic_conditions: string[] | null;
  current_medications: string[] | null;
  past_surgeries: string[] | null;
  notes: string | null;
}

const DoctorPatients = () => {
  const { user } = useAuth();
  const { logAccess } = useDoctorAccessLog();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord | null>(null);
  const [loadingRecord, setLoadingRecord] = useState(false);

  useEffect(() => {
    if (user) fetchPatients();
  }, [user]);

  const fetchPatients = async () => {
    // Get provider ID
    const { data: provider } = await supabase
      .from('providers')
      .select('id')
      .eq('user_id', user?.id)
      .maybeSingle();

    if (!provider) {
      setLoading(false);
      return;
    }

    // Get all appointments for this provider
    const { data: appointments } = await supabase
      .from('appointments')
      .select(`
        patient_id,
        appointment_date,
        profiles!appointments_patient_id_fkey (
          id,
          full_name,
          email,
          phone,
          date_of_birth,
          blood_type,
          avatar_url
        )
      `)
      .eq('provider_id', provider.id)
      .order('appointment_date', { ascending: false });

    if (appointments) {
      // Group by patient and calculate stats
      const patientMap = new Map<string, Patient>();
      
      appointments.forEach((apt: any) => {
        const patientId = apt.patient_id;
        const profile = apt.profiles;
        
        if (!profile) return;
        
        if (!patientMap.has(patientId)) {
          patientMap.set(patientId, {
            id: profile.id,
            full_name: profile.full_name,
            email: profile.email,
            phone: profile.phone,
            date_of_birth: profile.date_of_birth,
            blood_type: profile.blood_type,
            avatar_url: profile.avatar_url,
            appointmentCount: 1,
            lastAppointment: apt.appointment_date
          });
        } else {
          const existing = patientMap.get(patientId)!;
          existing.appointmentCount++;
        }
      });

      setPatients(Array.from(patientMap.values()));
    }
    setLoading(false);
  };

  const fetchMedicalRecord = async (patientId: string) => {
    setLoadingRecord(true);
    
    // Log access to medical record
    logAccess('view_medical_record', patientId, 'medical_record');
    
    const { data } = await supabase
      .from('medical_records')
      .select('allergies, chronic_conditions, current_medications, past_surgeries, notes')
      .eq('user_id', patientId)
      .maybeSingle();

    setMedicalRecord(data);
    setLoadingRecord(false);
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    // Log access to patient profile
    logAccess('view_patient', patient.id, 'patient');
    fetchMedicalRecord(patient.id);
  };

  const filteredPatients = patients.filter(p =>
    p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Advisor Banner */}
      <AdvisorBanner />

      <div>
        <h1 className="text-2xl font-bold">Χρήστες Πλοήγησης</h1>
        <p className="text-muted-foreground">Προβολή χρηστών με τους οποίους έχετε αλληλεπιδράσει</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Αναζήτηση με όνομα ή email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Patient Count */}
      <p className="text-sm text-muted-foreground">
        Εμφάνιση {filteredPatients.length} από {patients.length} χρήστες
      </p>

      {/* Patients Grid */}
      {filteredPatients.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              {searchQuery ? 'Δεν βρέθηκαν χρήστες με αυτήν την αναζήτηση' : 'Δεν υπάρχουν χρήστες ακόμα'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={patient.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {patient.full_name?.charAt(0) || 'Χ'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">
                      {patient.full_name || 'Χρήστης'}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {patient.email}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{patient.appointmentCount} επισκέψεις</span>
                      {patient.lastAppointment && (
                        <span>
                          Τελευταία: {format(parseISO(patient.lastAppointment), 'd MMM', { locale: el })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => handleViewPatient(patient)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Προβολή
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Patient Details Dialog */}
      <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Στοιχεία Χρήστη</DialogTitle>
          </DialogHeader>
          
          {selectedPatient && (
            <div className="space-y-6">
              {/* Patient Info */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedPatient.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {selectedPatient.full_name?.charAt(0) || 'P'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">
                    {selectedPatient.full_name || 'Patient'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedPatient.appointmentCount} appointments
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <h4 className="font-semibold">Contact Information</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedPatient.email}</span>
                  </div>
                  {selectedPatient.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedPatient.phone}</span>
                    </div>
                  )}
                  {selectedPatient.date_of_birth && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>DOB: {format(parseISO(selectedPatient.date_of_birth), 'MMMM d, yyyy')}</span>
                    </div>
                  )}
                  {selectedPatient.blood_type && (
                    <div className="flex items-center gap-2">
                      <span className="text-health-danger font-bold">🩸</span>
                      <span>Blood Type: {selectedPatient.blood_type}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Medical Record */}
              <div className="border-t pt-4 space-y-4">
                <h4 className="font-semibold">Medical Record</h4>
                
                {loadingRecord ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                  </div>
                ) : medicalRecord ? (
                  <div className="space-y-4">
                    {medicalRecord.allergies && medicalRecord.allergies.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-health-warning">Allergies</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {medicalRecord.allergies.map((a, i) => (
                            <Badge key={i} variant="outline" className="text-health-warning border-health-warning">
                              {a}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {medicalRecord.chronic_conditions && medicalRecord.chronic_conditions.length > 0 && (
                      <div>
                        <p className="text-sm font-medium">Chronic Conditions</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {medicalRecord.chronic_conditions.map((c, i) => (
                            <Badge key={i} variant="secondary">{c}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {medicalRecord.current_medications && medicalRecord.current_medications.length > 0 && (
                      <div>
                        <p className="text-sm font-medium">Current Medications</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {medicalRecord.current_medications.map((m, i) => (
                            <Badge key={i} variant="outline">{m}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {medicalRecord.past_surgeries && medicalRecord.past_surgeries.length > 0 && (
                      <div>
                        <p className="text-sm font-medium">Past Surgeries</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {medicalRecord.past_surgeries.map((s, i) => (
                            <Badge key={i} variant="outline">{s}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {medicalRecord.notes && (
                      <div>
                        <p className="text-sm font-medium">Notes</p>
                        <p className="text-sm text-muted-foreground mt-1">{medicalRecord.notes}</p>
                      </div>
                    )}

                    {!medicalRecord.allergies?.length && 
                     !medicalRecord.chronic_conditions?.length && 
                     !medicalRecord.current_medications?.length && 
                     !medicalRecord.past_surgeries?.length &&
                     !medicalRecord.notes && (
                      <p className="text-sm text-muted-foreground">No medical information on file</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No medical record available</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorPatients;
