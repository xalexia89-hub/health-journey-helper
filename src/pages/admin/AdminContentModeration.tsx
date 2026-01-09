import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Clock,
  Shield,
  User,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { format } from 'date-fns';

interface CaseStudy {
  id: string;
  title: string;
  summary: string | null;
  patient_background: string | null;
  diagnosis: string | null;
  treatment: string | null;
  outcome: string | null;
  status: string;
  category: string;
  created_at: string;
  provider: {
    name: string;
    specialty: string | null;
  } | null;
}

interface ContentWarning {
  type: 'high' | 'medium' | 'low';
  message: string;
  field: string;
}

const IDENTIFYING_PATTERNS = [
  { pattern: /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/g, message: 'Contains specific date', severity: 'medium' as const },
  { pattern: /\b(mr\.|mrs\.|ms\.|dr\.)\s+[a-z]+/gi, message: 'May contain name with title', severity: 'high' as const },
  { pattern: /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g, message: 'Possible full name detected', severity: 'high' as const },
  { pattern: /\b\d{5}\b/g, message: 'Contains postal code', severity: 'medium' as const },
  { pattern: /\b(street|avenue|road|blvd|οδός|λεωφόρος)\b/gi, message: 'Contains address reference', severity: 'high' as const },
  { pattern: /\b(hospital|clinic|κλινική|νοσοκομείο)\s+[A-ZΑ-Ω][a-zα-ω]+/gi, message: 'Specific institution named', severity: 'medium' as const },
  { pattern: /\b\d{10,}\b/g, message: 'Contains phone or ID number', severity: 'high' as const },
  { pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, message: 'Contains email address', severity: 'high' as const },
];

const analyzeContent = (text: string | null, fieldName: string): ContentWarning[] => {
  if (!text) return [];
  
  const warnings: ContentWarning[] = [];
  
  IDENTIFYING_PATTERNS.forEach(({ pattern, message, severity }) => {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      warnings.push({
        type: severity,
        message: `${message} in ${fieldName}`,
        field: fieldName
      });
    }
  });
  
  return warnings;
};

const AdminContentModeration = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending_review');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const stats = {
    pending: caseStudies.filter(c => c.status === 'pending_review').length,
    published: caseStudies.filter(c => c.status === 'published').length,
    draft: caseStudies.filter(c => c.status === 'draft').length,
    archived: caseStudies.filter(c => c.status === 'archived').length,
  };

  useEffect(() => {
    fetchCaseStudies();
  }, [activeTab]);

  const fetchCaseStudies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('academy_case_studies')
      .select(`
        *,
        provider:providers(name, specialty)
      `)
      .eq('status', activeTab as 'draft' | 'pending_review' | 'published' | 'archived')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch case studies');
    } else {
      setCaseStudies(data || []);
    }
    setLoading(false);
  };

  const getContentWarnings = (study: CaseStudy): ContentWarning[] => {
    const warnings: ContentWarning[] = [];
    warnings.push(...analyzeContent(study.patient_background, 'Patient Background'));
    warnings.push(...analyzeContent(study.diagnosis, 'Diagnosis'));
    warnings.push(...analyzeContent(study.treatment, 'Treatment'));
    warnings.push(...analyzeContent(study.outcome, 'Outcome'));
    return warnings;
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setProcessingId(id);
    
    const updateData: Record<string, unknown> = { status: newStatus };
    if (newStatus === 'published') {
      updateData.published_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('academy_case_studies')
      .update(updateData)
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success(`Case study ${newStatus === 'published' ? 'approved' : newStatus === 'archived' ? 'rejected' : 'updated'}`);
      fetchCaseStudies();
    }
    
    setProcessingId(null);
    setRejectionReason('');
    setExpandedId(null);
  };

  const getSeverityColor = (type: ContentWarning['type']) => {
    switch (type) {
      case 'high': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_review':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'published':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"><CheckCircle className="h-3 w-3 mr-1" />Published</Badge>;
      case 'archived':
        return <Badge variant="outline" className="bg-destructive/20 text-destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline"><FileText className="h-3 w-3 mr-1" />Draft</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Content Moderation
          </h1>
          <p className="text-muted-foreground">
            Review case studies for patient privacy compliance
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className={activeTab === 'pending_review' ? 'ring-2 ring-primary' : ''}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={activeTab === 'published' ? 'ring-2 ring-primary' : ''}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.published}</p>
                <p className="text-xs text-muted-foreground">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={activeTab === 'draft' ? 'ring-2 ring-primary' : ''}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{stats.draft}</p>
                <p className="text-xs text-muted-foreground">Drafts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={activeTab === 'archived' ? 'ring-2 ring-primary' : ''}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-2xl font-bold">{stats.archived}</p>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending_review">Pending</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="archived">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : caseStudies.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No case studies in this category</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {caseStudies.map((study) => {
                const warnings = getContentWarnings(study);
                const isExpanded = expandedId === study.id;
                const hasHighRisk = warnings.some(w => w.type === 'high');

                return (
                  <Card key={study.id} className={hasHighRisk && activeTab === 'pending_review' ? 'border-destructive/50' : ''}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusBadge(study.status)}
                            {hasHighRisk && (
                              <Badge variant="destructive" className="gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Privacy Risk
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg">{study.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{study.provider?.name || 'Unknown Provider'}</span>
                            <span>•</span>
                            <span>{format(new Date(study.created_at), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedId(isExpanded ? null : study.id)}
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          <span className="ml-1">{isExpanded ? 'Hide' : 'Review'}</span>
                        </Button>
                      </div>
                    </CardHeader>

                    {isExpanded && (
                      <CardContent className="pt-0 space-y-4">
                        {/* Warnings */}
                        {warnings.length > 0 && (
                          <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                            <h4 className="font-medium flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                              Privacy Warnings ({warnings.length})
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {warnings.map((warning, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className={getSeverityColor(warning.type)}
                                >
                                  {warning.message}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Content Preview */}
                        <ScrollArea className="h-64 rounded-lg border p-4">
                          <div className="space-y-4">
                            {study.summary && (
                              <div>
                                <h5 className="font-medium text-sm text-muted-foreground mb-1">Summary</h5>
                                <p className="text-sm">{study.summary}</p>
                              </div>
                            )}
                            {study.patient_background && (
                              <div className={warnings.some(w => w.field === 'Patient Background') ? 'p-2 rounded bg-yellow-50 dark:bg-yellow-900/20' : ''}>
                                <h5 className="font-medium text-sm text-muted-foreground mb-1">Patient Background ⚠️</h5>
                                <p className="text-sm">{study.patient_background}</p>
                              </div>
                            )}
                            {study.diagnosis && (
                              <div>
                                <h5 className="font-medium text-sm text-muted-foreground mb-1">Diagnosis</h5>
                                <p className="text-sm">{study.diagnosis}</p>
                              </div>
                            )}
                            {study.treatment && (
                              <div>
                                <h5 className="font-medium text-sm text-muted-foreground mb-1">Treatment</h5>
                                <p className="text-sm">{study.treatment}</p>
                              </div>
                            )}
                            {study.outcome && (
                              <div>
                                <h5 className="font-medium text-sm text-muted-foreground mb-1">Outcome</h5>
                                <p className="text-sm">{study.outcome}</p>
                              </div>
                            )}
                          </div>
                        </ScrollArea>

                        {/* Actions */}
                        {activeTab === 'pending_review' && (
                          <div className="flex flex-col gap-3">
                            <div className="flex gap-2">
                              <Button
                                className="flex-1"
                                onClick={() => updateStatus(study.id, 'published')}
                                disabled={processingId === study.id}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve & Publish
                              </Button>
                              <Button
                                variant="destructive"
                                className="flex-1"
                                onClick={() => updateStatus(study.id, 'archived')}
                                disabled={processingId === study.id}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                            <Button
                              variant="outline"
                              onClick={() => updateStatus(study.id, 'draft')}
                              disabled={processingId === study.id}
                            >
                              Return to Draft (request revisions)
                            </Button>
                          </div>
                        )}

                        {activeTab === 'published' && (
                          <Button
                            variant="destructive"
                            onClick={() => updateStatus(study.id, 'archived')}
                            disabled={processingId === study.id}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Unpublish
                          </Button>
                        )}

                        {activeTab === 'archived' && (
                          <Button
                            variant="outline"
                            onClick={() => updateStatus(study.id, 'draft')}
                            disabled={processingId === study.id}
                          >
                            Restore to Draft
                          </Button>
                        )}
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminContentModeration;
