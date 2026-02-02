import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  FileText,
  Save,
  Plus,
  Pencil,
  Trash2,
  Stethoscope,
  Search,
} from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  is_enabled: boolean;
  sort_order: number;
}

interface WebsiteContent {
  id: string;
  section_key: string;
  title: string | null;
  content: string | null;
  metadata: unknown;
  is_enabled: boolean;
}

const defaultService: Partial<Service> = {
  title: '',
  description: '',
  icon: 'Stethoscope',
  is_enabled: true,
  sort_order: 0,
};

const AdminContent = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [content, setContent] = useState<WebsiteContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, contentRes] = await Promise.all([
        supabase.from('services').select('*').order('sort_order'),
        supabase.from('website_content').select('*'),
      ]);

      if (servicesRes.error) throw servicesRes.error;
      if (contentRes.error) throw contentRes.error;

      setServices(servicesRes.data || []);
      setContent(contentRes.data || []);

      // Set SEO content
      const seoContent = (contentRes.data || []).find((c) => c.section_key === 'seo');
      if (seoContent) {
        setSeoTitle(seoContent.title || '');
        setSeoDescription(seoContent.content || '');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load content.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveService = async () => {
    if (!editingService || !editingService.title) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please enter a service title.',
      });
      return;
    }

    setIsSaving(true);

    try {
      const serviceData = {
        title: editingService.title,
        description: editingService.description || null,
        icon: editingService.icon || 'Stethoscope',
        is_enabled: editingService.is_enabled ?? true,
        sort_order: editingService.sort_order || 0,
      };

      if (editingService.id) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);

        if (error) throw error;

        setServices((prev) =>
          prev.map((s) =>
            s.id === editingService.id ? { ...s, ...serviceData } : s
          )
        );

        toast({ title: 'Service Updated' });
      } else {
        const { data, error } = await supabase
          .from('services')
          .insert(serviceData)
          .select()
          .single();

        if (error) throw error;

        setServices((prev) => [...prev, data]);
        toast({ title: 'Service Added' });
      }

      setIsServiceDialogOpen(false);
      setEditingService(null);
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save service.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;

      setServices((prev) => prev.filter((s) => s.id !== id));
      toast({ title: 'Service Deleted' });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete service.',
      });
    }
  };

  const toggleService = async (id: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_enabled: enabled })
        .eq('id', id);

      if (error) throw error;

      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_enabled: enabled } : s))
      );
    } catch (error) {
      console.error('Error toggling service:', error);
    }
  };

  const saveSeoContent = async () => {
    setIsSaving(true);

    try {
      const existingSeo = content.find((c) => c.section_key === 'seo');

      if (existingSeo) {
        const { error } = await supabase
          .from('website_content')
          .update({ title: seoTitle, content: seoDescription })
          .eq('id', existingSeo.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('website_content').insert({
          section_key: 'seo',
          title: seoTitle,
          content: seoDescription,
        });

        if (error) throw error;
      }

      toast({ title: 'SEO Settings Saved' });
    } catch (error) {
      console.error('Error saving SEO:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save SEO settings.',
      });
    } finally {
      setIsSaving(false);
    }
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
          Website Content
        </h1>
        <p className="text-muted-foreground">
          Manage services, treatments, and SEO settings.
        </p>
      </div>

      <Tabs defaultValue="services" className="w-full">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="seo">SEO Settings</TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="hero"
              onClick={() => {
                setEditingService(defaultService);
                setIsServiceDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>

          {services.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No services added yet.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingService(defaultService);
                    setIsServiceDialogOpen(true);
                  }}
                >
                  Add Your First Service
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <Card key={service.id} className={!service.is_enabled ? 'opacity-60' : ''}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-serif">{service.title}</CardTitle>
                      <Switch
                        checked={service.is_enabled}
                        onCheckedChange={(checked) => toggleService(service.id, checked)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {service.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {service.description}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setEditingService(service);
                          setIsServiceDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => deleteService(service.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <Search className="h-5 w-5" />
                SEO Settings
              </CardTitle>
              <CardDescription>
                Configure meta tags for search engine optimization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seo-title">Meta Title</Label>
                <Input
                  id="seo-title"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Siddha Doctor - Traditional Healing"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {seoTitle.length}/60 characters
                </p>
              </div>

              <div>
                <Label htmlFor="seo-desc">Meta Description</Label>
                <Textarea
                  id="seo-desc"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Experience holistic healing with traditional Siddha medicine..."
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {seoDescription.length}/160 characters
                </p>
              </div>

              <Button variant="hero" onClick={saveSeoContent} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save SEO Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Service Dialog */}
      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingService?.id ? 'Edit Service' : 'Add New Service'}
            </DialogTitle>
          </DialogHeader>
          {editingService && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="service-title">Service Title *</Label>
                <Input
                  id="service-title"
                  value={editingService.title}
                  onChange={(e) =>
                    setEditingService({ ...editingService, title: e.target.value })
                  }
                  placeholder="e.g., Digestive Problems"
                />
              </div>

              <div>
                <Label htmlFor="service-desc">Description</Label>
                <Textarea
                  id="service-desc"
                  value={editingService.description || ''}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                  placeholder="Describe this service..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="sort-order">Sort Order</Label>
                <Input
                  id="sort-order"
                  type="number"
                  value={editingService.sort_order || 0}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      sort_order: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Enabled</Label>
                <Switch
                  checked={editingService.is_enabled}
                  onCheckedChange={(checked) =>
                    setEditingService({ ...editingService, is_enabled: checked })
                  }
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsServiceDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="hero"
                  className="flex-1"
                  onClick={saveService}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : editingService.id ? 'Update' : 'Add Service'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContent;
