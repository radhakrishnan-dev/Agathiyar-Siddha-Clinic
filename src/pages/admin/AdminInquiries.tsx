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
  MessageSquare,
  Pill,
} from 'lucide-react';

interface MedicineInquiry {
  id: string;
  medicine_id: string | null;
  medicine_name: string;
  customer_phone: string;
  customer_name: string | null;
  inquiry_date: string;
  status: string;
  notes: string | null;
  created_at: string;
}

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState<MedicineInquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<MedicineInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<MedicineInquiry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchInquiries();
  }, []);

  useEffect(() => {
    filterInquiries();
  }, [inquiries, searchQuery, statusFilter]);

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('medicine_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load inquiries.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterInquiries = () => {
    let filtered = inquiries;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.medicine_name.toLowerCase().includes(query) ||
          i.customer_phone.includes(query) ||
          (i.customer_name && i.customer_name.toLowerCase().includes(query))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((i) => i.status === statusFilter);
    }

    setFilteredInquiries(filtered);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('medicine_inquiries')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
      );

      toast({
        title: 'Status Updated',
        description: `Inquiry marked as ${newStatus}.`,
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
    if (!selectedInquiry) return;

    try {
      const { error } = await supabase
        .from('medicine_inquiries')
        .update({ notes })
        .eq('id', selectedInquiry.id);

      if (error) throw error;

      setInquiries((prev) =>
        prev.map((i) =>
          i.id === selectedInquiry.id ? { ...i, notes } : i
        )
      );

      toast({
        title: 'Notes Saved',
        description: 'Inquiry notes have been saved.',
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

  const openWhatsApp = (phone: string, medicineName: string) => {
    const message = encodeURIComponent(
      `Hello! Thank you for your interest in ${medicineName}. I'm Dr. Siddha Specialist. How can I help you with this medicine?`
    );
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      New: 'default',
      Replied: 'secondary',
      Closed: 'outline',
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

  const openDetails = (inquiry: MedicineInquiry) => {
    setSelectedInquiry(inquiry);
    setNotes(inquiry.notes || '');
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
          Medicine Inquiries
        </h1>
        <p className="text-muted-foreground">
          Track and respond to customer medicine inquiries.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by medicine, phone, or name..."
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
                <SelectItem value="Replied">Replied</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-serif">
            {filteredInquiries.length} Inquir{filteredInquiries.length !== 1 ? 'ies' : 'y'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInquiries.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No inquiries found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicine</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInquiries.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Pill className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{inquiry.medicine_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{inquiry.customer_name || '-'}</TableCell>
                      <TableCell>{inquiry.customer_phone}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(inquiry.inquiry_date)}
                      </TableCell>
                      <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDetails(inquiry)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openWhatsApp(inquiry.customer_phone, inquiry.medicine_name)}
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
            <DialogTitle className="font-serif">Inquiry Details</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Medicine</p>
                  <p className="font-medium">{selectedInquiry.medicine_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedInquiry.customer_name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedInquiry.customer_phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{formatDate(selectedInquiry.inquiry_date)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Select
                  value={selectedInquiry.status}
                  onValueChange={(value) => {
                    updateStatus(selectedInquiry.id, value);
                    setSelectedInquiry({ ...selectedInquiry, status: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Replied">Replied</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Notes</p>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this inquiry..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => openWhatsApp(selectedInquiry.customer_phone, selectedInquiry.medicine_name)}
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

export default AdminInquiries;
