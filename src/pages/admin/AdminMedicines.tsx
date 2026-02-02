import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Pencil,
  Trash2,
  Pill,
  Search,
  IndianRupee,
} from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface Medicine {
  id: string;
  name: string;
  category: string;
  price: number;
  stock_status: string;
  images: string[];
  description: string | null;
  used_for: string | null;
  dosage_notes: string | null;
  is_active: boolean;
  created_at: string;
}

const defaultMedicine: Partial<Medicine> = {
  name: '',
  category: 'Tablet',
  price: 0,
  stock_status: 'Available',
  images: [],
  description: '',
  used_for: '',
  dosage_notes: '',
  is_active: true,
};

const AdminMedicines = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Partial<Medicine> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMedicines();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredMedicines(
        medicines.filter(
          (m) =>
            m.name.toLowerCase().includes(query) ||
            m.category.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredMedicines(medicines);
    }
  }, [medicines, searchQuery]);

  const fetchMedicines = async () => {
    try {
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedicines(data || []);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load medicines.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openAddDialog = () => {
    setEditingMedicine(defaultMedicine);
    setIsDialogOpen(true);
  };

  const openEditDialog = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setIsDialogOpen(true);
  };

  const saveMedicine = async () => {
    if (!editingMedicine || !editingMedicine.name || !editingMedicine.price) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
      });
      return;
    }

    setIsSaving(true);

    try {
      const medicineData = {
        name: editingMedicine.name,
        category: editingMedicine.category || 'Tablet',
        price: editingMedicine.price,
        stock_status: editingMedicine.stock_status || 'Available',
        images: editingMedicine.images || [],
        description: editingMedicine.description || null,
        used_for: editingMedicine.used_for || null,
        dosage_notes: editingMedicine.dosage_notes || null,
        is_active: editingMedicine.is_active ?? true,
      };

      if (editingMedicine.id) {
        // Update existing
        const { error } = await supabase
          .from('medicines')
          .update(medicineData)
          .eq('id', editingMedicine.id);

        if (error) throw error;

        setMedicines((prev) =>
          prev.map((m) =>
            m.id === editingMedicine.id ? { ...m, ...medicineData } : m
          )
        );

        toast({
          title: 'Medicine Updated',
          description: `${medicineData.name} has been updated.`,
        });
      } else {
        // Create new
        const { data, error } = await supabase
          .from('medicines')
          .insert(medicineData)
          .select()
          .single();

        if (error) throw error;

        setMedicines((prev) => [data, ...prev]);

        toast({
          title: 'Medicine Added',
          description: `${medicineData.name} has been added to your catalog.`,
        });
      }

      setIsDialogOpen(false);
      setEditingMedicine(null);
    } catch (error) {
      console.error('Error saving medicine:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save medicine.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteMedicine = async (id: string) => {
    if (!confirm('Are you sure you want to delete this medicine?')) return;

    try {
      const { error } = await supabase.from('medicines').delete().eq('id', id);

      if (error) throw error;

      setMedicines((prev) => prev.filter((m) => m.id !== id));

      toast({
        title: 'Medicine Deleted',
        description: 'The medicine has been removed from your catalog.',
      });
    } catch (error) {
      console.error('Error deleting medicine:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete medicine.',
      });
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('medicines')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      setMedicines((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_active: isActive } : m))
      );

      toast({
        title: isActive ? 'Medicine Activated' : 'Medicine Deactivated',
        description: `The medicine is now ${isActive ? 'visible' : 'hidden'} on the website.`,
      });
    } catch (error) {
      console.error('Error toggling medicine:', error);
    }
  };

  const getStockBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      Available: 'default',
      Limited: 'secondary',
      'Out of Stock': 'destructive',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-foreground">
            Medicines & Tonics
          </h1>
          <p className="text-muted-foreground">
            Manage your medicine catalog and pricing.
          </p>
        </div>
        <Button variant="hero" onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Medicine
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Medicines Grid */}
      {filteredMedicines.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Pill className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No medicines found.</p>
            <Button variant="outline" onClick={openAddDialog}>
              Add Your First Medicine
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMedicines.map((medicine) => (
            <Card key={medicine.id} className={!medicine.is_active ? 'opacity-60' : ''}>
              {/* Medicine Image */}
              {medicine.images && medicine.images.length > 0 && (
                <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                  <img
                    src={medicine.images[0]}
                    alt={medicine.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-serif">{medicine.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {medicine.category}
                    </Badge>
                  </div>
                  <Switch
                    checked={medicine.is_active}
                    onCheckedChange={(checked) => toggleActive(medicine.id, checked)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-lg font-semibold text-primary">
                    <IndianRupee className="h-4 w-4" />
                    {medicine.price}
                  </div>
                  {getStockBadge(medicine.stock_status)}
                </div>

                {medicine.used_for && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {medicine.used_for}
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditDialog(medicine)}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => deleteMedicine(medicine.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingMedicine?.id ? 'Edit Medicine' : 'Add New Medicine'}
            </DialogTitle>
          </DialogHeader>
          {editingMedicine && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Medicine Name *</Label>
                <Input
                  id="name"
                  value={editingMedicine.name}
                  onChange={(e) =>
                    setEditingMedicine({ ...editingMedicine, name: e.target.value })
                  }
                  placeholder="Enter medicine name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={editingMedicine.category}
                    onValueChange={(value) =>
                      setEditingMedicine({ ...editingMedicine, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tablet">Tablet</SelectItem>
                      <SelectItem value="Powder">Powder</SelectItem>
                      <SelectItem value="Syrup">Syrup</SelectItem>
                      <SelectItem value="Tonic">Tonic</SelectItem>
                      <SelectItem value="Oil">Oil</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={editingMedicine.price}
                    onChange={(e) =>
                      setEditingMedicine({
                        ...editingMedicine,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="stock">Stock Status</Label>
                <Select
                  value={editingMedicine.stock_status}
                  onValueChange={(value) =>
                    setEditingMedicine({ ...editingMedicine, stock_status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Limited">Limited</SelectItem>
                    <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Medicine Images</Label>
                <ImageUpload
                  value={editingMedicine.images || []}
                  onChange={(urls) =>
                    setEditingMedicine({
                      ...editingMedicine,
                      images: urls as string[],
                    })
                  }
                  multiple
                  folder="medicines"
                  aspectRatio="video"
                />
              </div>

              <div>
                <Label htmlFor="used_for">Used For (Benefits)</Label>
                <Textarea
                  id="used_for"
                  value={editingMedicine.used_for || ''}
                  onChange={(e) =>
                    setEditingMedicine({ ...editingMedicine, used_for: e.target.value })
                  }
                  placeholder="Describe what conditions this medicine helps with..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingMedicine.description || ''}
                  onChange={(e) =>
                    setEditingMedicine({ ...editingMedicine, description: e.target.value })
                  }
                  placeholder="Detailed description of the medicine..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="dosage">Dosage Notes</Label>
                <Textarea
                  id="dosage"
                  value={editingMedicine.dosage_notes || ''}
                  onChange={(e) =>
                    setEditingMedicine({ ...editingMedicine, dosage_notes: e.target.value })
                  }
                  placeholder="Recommended dosage and instructions..."
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="active">Active (Visible on website)</Label>
                <Switch
                  id="active"
                  checked={editingMedicine.is_active}
                  onCheckedChange={(checked) =>
                    setEditingMedicine({ ...editingMedicine, is_active: checked })
                  }
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="hero"
                  className="flex-1"
                  onClick={saveMedicine}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : editingMedicine.id ? 'Update' : 'Add Medicine'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMedicines;
