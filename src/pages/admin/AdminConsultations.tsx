import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Phone,
  Eye,
  Calendar,
  User,
  MessageSquare,
} from 'lucide-react';

interface Consultation {
  id: string;
  patient_name: string;
  patient_phone: string;
  patient_age: number | null;
  patient_gender: string | null;
  health_issue: string;
  consultation_type: string | null;
  status: string;
  doctor_notes: string | null;
  created_at: string;
}

const AdminConsultations = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchConsultations();
  }, []);

  useEffect(() => {
    filterConsultations();
  }, [consultations, searchQuery, statusFilter]);

  const fetchConsultations = async () => {
    try {
      const { data, error } = await supabase
        .from('consultation_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConsultations(data || []);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load consultations.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterConsultations = () => {
    let filtered = consultations;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.patient_name.toLowerCase().includes(query) ||
          c.patient_phone.includes(query) ||
          c.health_issue.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    setFilteredConsultations(filtered);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('consultation_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setConsultations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );

      toast({
        title: 'Status Updated',
        description: `Consultation marked as ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update status.',
      });
    }
  };

  const saveNotes = async () => {
    if (!selectedConsultation) return;

    try {
      const { error } = await supabase
        .from('consultation_requests')
        .update({ doctor_notes: doctorNotes })
        .eq('id', selectedConsultation.id);

      if (error) throw error;

      setConsultations((prev) =>
        prev.map((c) =>
          c.id === selectedConsultation.id ? { ...c, doctor_notes: doctorNotes } : c
        )
      );

      toast({
        title: 'Notes Saved',
        description: 'Doctor notes have been saved.',
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save notes.',
      });
    }
  };

  const openWhatsApp = (phone: string, patientName: string) => {
    const message = encodeURIComponent(
      `Hello ${patientName}, this is Dr. Siddha Specialist. I received your consultation request. How can I help you today?`
    );
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      New: 'default',
      Contacted: 'secondary',
      Completed: 'outline',
      Cancelled: 'destructive',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const openDetails = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setDoctorNotes(consultation.doctor_notes || '');
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-48" />
        <div className="h-96 bg-muted rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-foreground">
          Consultation Requests
        </h1>
        <p className="text-muted-foreground">
          Manage and respond to patient consultation requests.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or issue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif">
            {filteredConsultations.length} Consultation{filteredConsultations.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredConsultations.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No consultations found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Health Issue</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConsultations.map((consultation) => (
                    <TableRow key={consultation.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{consultation.patient_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {consultation.patient_age && `${consultation.patient_age}y`}
                              {consultation.patient_gender && `, ${consultation.patient_gender}`}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{consultation.patient_phone}</TableCell>
                      <TableCell>
                        <p className="max-w-xs truncate">{consultation.health_issue}</p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(consultation.created_at)}
                      </TableCell>
                      <TableCell>{getStatusBadge(consultation.status)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDetails(consultation)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openWhatsApp(consultation.patient_phone, consultation.patient_name)}
                          >
                            <Phone className="h-4 w-4 text-nature" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">Consultation Details</DialogTitle>
          </DialogHeader>
          {selectedConsultation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Patient Name</p>
                  <p className="font-medium">{selectedConsultation.patient_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedConsultation.patient_phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Age / Gender</p>
                  <p className="font-medium">
                    {selectedConsultation.patient_age || '-'} / {selectedConsultation.patient_gender || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{selectedConsultation.consultation_type || 'Online'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Health Issue</p>
                <p className="bg-muted p-3 rounded-lg text-sm">{selectedConsultation.health_issue}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Select
                  value={selectedConsultation.status}
                  onValueChange={(value) => {
                    updateStatus(selectedConsultation.id, value);
                    setSelectedConsultation({ ...selectedConsultation, status: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Contacted">Contacted</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Doctor Notes (Private)</p>
                <Textarea
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="Add private notes about this consultation..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => openWhatsApp(selectedConsultation.patient_phone, selectedConsultation.patient_name)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button variant="hero" className="flex-1" onClick={saveNotes}>
                  Save Notes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminConsultations;
