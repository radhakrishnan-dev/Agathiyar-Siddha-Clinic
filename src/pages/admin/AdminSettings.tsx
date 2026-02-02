import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Save,
  Phone,
  Bell,
  Shield,
  Power,
  Key,
  Mail,
} from 'lucide-react';

interface AdminSettings {
  id: string;
  whatsapp_number: string | null;
  consultation_message_template: string | null;
  medicine_inquiry_template: string | null;
  maintenance_mode: boolean;
  medicine_selling_enabled: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
  new_consultation_notification: boolean;
  new_inquiry_notification: boolean;
}

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Security section state
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setNewEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings(data);
      } else {
        // Create default settings if none exists
        const { data: newSettings, error: createError } = await supabase
          .from('admin_settings')
          .insert({})
          .select()
          .single();

        if (createError) throw createError;
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load settings.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({
          whatsapp_number: settings.whatsapp_number,
          consultation_message_template: settings.consultation_message_template,
          medicine_inquiry_template: settings.medicine_inquiry_template,
          maintenance_mode: settings.maintenance_mode,
          medicine_selling_enabled: settings.medicine_selling_enabled,
          email_notifications: settings.email_notifications,
          sms_notifications: settings.sms_notifications,
          new_consultation_notification: settings.new_consultation_notification,
          new_inquiry_notification: settings.new_inquiry_notification,
        })
        .eq('id', settings.id);

      if (error) throw error;

      toast({
        title: 'Settings Saved',
        description: 'Your settings have been updated successfully.',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save settings.',
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

  if (!settings) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-foreground">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Configure your admin panel and website settings.
          </p>
        </div>
        <Button variant="hero" onClick={saveSettings} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WhatsApp Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Phone className="h-5 w-5" />
              WhatsApp Settings
            </CardTitle>
            <CardDescription>
              Configure WhatsApp number and message templates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input
                id="whatsapp"
                value={settings.whatsapp_number || ''}
                onChange={(e) =>
                  setSettings({ ...settings, whatsapp_number: e.target.value })
                }
                placeholder="+91 9876543210"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Include country code (e.g., +91 for India)
              </p>
            </div>

            <div>
              <Label htmlFor="consultation-template">Consultation Message Template</Label>
              <Textarea
                id="consultation-template"
                value={settings.consultation_message_template || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    consultation_message_template: e.target.value,
                  })
                }
                placeholder="Hello Doctor, I would like to consult you."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="inquiry-template">Medicine Inquiry Template</Label>
              <Textarea
                id="inquiry-template"
                value={settings.medicine_inquiry_template || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    medicine_inquiry_template: e.target.value,
                  })
                }
                placeholder="I want to consult before purchasing this medicine."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure notification preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Receive email alerts for new activities
                </p>
              </div>
              <Switch
                checked={settings.email_notifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, email_notifications: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label>New Consultation Alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Get notified for new consultation requests
                </p>
              </div>
              <Switch
                checked={settings.new_consultation_notification}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, new_consultation_notification: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>New Inquiry Alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Get notified for new medicine inquiries
                </p>
              </div>
              <Switch
                checked={settings.new_inquiry_notification}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, new_inquiry_notification: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Website Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Power className="h-5 w-5" />
              Website Controls
            </CardTitle>
            <CardDescription>
              Control website features and access.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Medicine Selling</Label>
                <p className="text-xs text-muted-foreground">
                  Enable/disable medicine sales on website
                </p>
              </div>
              <Switch
                checked={settings.medicine_selling_enabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, medicine_selling_enabled: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-destructive">Maintenance Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Take website offline for maintenance
                </p>
              </div>
              <Switch
                checked={settings.maintenance_mode}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, maintenance_mode: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>
              Manage your account email and password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Update Email */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium">Update Email</h4>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="current-email">Current Email</Label>
                  <Input
                    id="current-email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="new-email">New Email</Label>
                  <Input
                    id="new-email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter new email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={async () => {
                    if (!newEmail || newEmail === user?.email) {
                      toast({
                        variant: 'destructive',
                        title: 'Invalid Email',
                        description: 'Please enter a different email address.',
                      });
                      return;
                    }
                    
                    // Validate email format
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(newEmail)) {
                      toast({
                        variant: 'destructive',
                        title: 'Invalid Email Format',
                        description: 'Please enter a valid email address.',
                      });
                      return;
                    }
                    
                    setIsUpdatingEmail(true);
                    try {
                      const { error } = await supabase.auth.updateUser({
                        email: newEmail,
                      });
                      if (error) throw error;
                      toast({
                        title: 'Confirmation Email Sent',
                        description: 'A confirmation link has been sent to your new email address. Please click it to complete the email change.',
                      });
                    } catch (error: any) {
                      console.error('Email update error:', error);
                      toast({
                        variant: 'destructive',
                        title: 'Error',
                        description: error.message || 'Failed to update email.',
                      });
                    } finally {
                      setIsUpdatingEmail(false);
                    }
                  }}
                  disabled={isUpdatingEmail || newEmail === user?.email}
                >
                  {isUpdatingEmail ? 'Sending Confirmation...' : 'Update Email'}
                </Button>
                <p className="text-xs text-muted-foreground">
                  A confirmation email will be sent to your new email address. Click the link in that email to confirm the change.
                </p>
              </div>
            </div>

            <Separator />

            {/* Update Password */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium">Update Password</h4>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={async () => {
                  if (!newPassword) {
                    toast({
                      variant: 'destructive',
                      title: 'Invalid Password',
                      description: 'Please enter a new password.',
                    });
                    return;
                  }
                  if (newPassword.length < 6) {
                    toast({
                      variant: 'destructive',
                      title: 'Weak Password',
                      description: 'Password must be at least 6 characters.',
                    });
                    return;
                  }
                  if (newPassword !== confirmPassword) {
                    toast({
                      variant: 'destructive',
                      title: 'Password Mismatch',
                      description: 'Passwords do not match.',
                    });
                    return;
                  }
                  setIsUpdatingPassword(true);
                  try {
                    const { error } = await supabase.auth.updateUser({
                      password: newPassword,
                    });
                    if (error) throw error;
                    toast({
                      title: 'Password Updated',
                      description: 'Your password has been updated successfully.',
                    });
                    setNewPassword('');
                    setConfirmPassword('');
                  } catch (error: any) {
                    toast({
                      variant: 'destructive',
                      title: 'Error',
                      description: error.message || 'Failed to update password.',
                    });
                  } finally {
                    setIsUpdatingPassword(false);
                  }
                }}
                disabled={isUpdatingPassword || !newPassword}
              >
                {isUpdatingPassword ? 'Updating...' : 'Update Password'}
              </Button>
            </div>

            <Separator />

            {/* Session Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Session Information</h4>
                <p className="text-sm text-muted-foreground">
                  You are currently logged in as <strong>{user?.email}</strong>. Your session will expire after 24 hours of inactivity.
                </p>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-medium mb-2 text-primary">Admin Access</h4>
                <p className="text-sm text-muted-foreground">
                  Only users with admin role can access this panel.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
