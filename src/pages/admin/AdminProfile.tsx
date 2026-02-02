import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { User, Save, Clock, Phone, Mail, MapPin } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface DoctorProfile {
  id: string;
  name: string;
  qualification: string;
  photo_url: string | null;
  about: string | null;
  years_of_experience: number | null;
  specializations: string[];
  clinic_timings: Record<string, string>;
  contact_phone: string | null;
  contact_email: string | null;
  whatsapp_number: string | null;
  clinic_address: string | null;
}

const defaultTimings = {
  monday: '9:00 AM - 6:00 PM',
  tuesday: '9:00 AM - 6:00 PM',
  wednesday: '9:00 AM - 6:00 PM',
  thursday: '9:00 AM - 6:00 PM',
  friday: '9:00 AM - 6:00 PM',
  saturday: '9:00 AM - 1:00 PM',
  sunday: 'Closed',
};

const AdminProfile = () => {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [specializationInput, setSpecializationInput] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('doctor_profile')
        .select('*')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile({
          ...data,
          clinic_timings: (data.clinic_timings as Record<string, string>) || defaultTimings,
          specializations: data.specializations || [],
        });
      } else {
        // Create default profile if none exists
        const { data: newProfile, error: createError } = await supabase
          .from('doctor_profile')
          .insert({
            name: 'Dr. Siddha Specialist',
            qualification: 'BBMS',
            clinic_timings: defaultTimings,
          })
          .select()
          .single();

        if (createError) throw createError;
        setProfile({
          ...newProfile,
          clinic_timings: defaultTimings,
          specializations: [],
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load profile.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!profile) return;

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('doctor_profile')
        .update({
          name: profile.name,
          qualification: profile.qualification,
          photo_url: profile.photo_url,
          about: profile.about,
          years_of_experience: profile.years_of_experience,
          specializations: profile.specializations,
          clinic_timings: profile.clinic_timings,
          contact_phone: profile.contact_phone,
          contact_email: profile.contact_email,
          whatsapp_number: profile.whatsapp_number,
          clinic_address: profile.clinic_address,
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: 'Profile Saved',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save profile.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addSpecialization = () => {
    if (!specializationInput.trim() || !profile) return;
    setProfile({
      ...profile,
      specializations: [...profile.specializations, specializationInput.trim()],
    });
    setSpecializationInput('');
  };

  const removeSpecialization = (index: number) => {
    if (!profile) return;
    setProfile({
      ...profile,
      specializations: profile.specializations.filter((_, i) => i !== index),
    });
  };

  const updateTiming = (day: string, value: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      clinic_timings: { ...profile.clinic_timings, [day]: value },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-48" />
        <div className="h-96 bg-muted rounded-lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-serif font-semibold text-foreground">
            Doctor Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your professional information displayed on the website.
          </p>
        </div>
        <Button variant="hero" onClick={saveProfile} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Dr. Your Name"
                />
              </div>
              <div>
                <Label htmlFor="qualification">Qualification</Label>
                <Input
                  id="qualification"
                  value={profile.qualification}
                  onChange={(e) => setProfile({ ...profile, qualification: e.target.value })}
                  placeholder="BBMS"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  value={profile.years_of_experience || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      years_of_experience: parseInt(e.target.value) || null,
                    })
                  }
                  placeholder="10"
                />
              </div>
            </div>

            <div>
              <Label>Profile Photo</Label>
              <ImageUpload
                value={profile.photo_url || ''}
                onChange={(url) => setProfile({ ...profile, photo_url: url as string })}
                folder="profile"
                aspectRatio="square"
                className="max-w-xs"
              />
            </div>

            <div>
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                value={profile.about || ''}
                onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                placeholder="Write about your experience, approach, and philosophy..."
                rows={4}
              />
            </div>

            <div>
              <Label>Specializations</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={specializationInput}
                  onChange={(e) => setSpecializationInput(e.target.value)}
                  placeholder="Add specialization..."
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                />
                <Button variant="outline" onClick={addSpecialization}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.specializations.map((spec, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1"
                  >
                    {spec}
                    <button
                      onClick={() => removeSpecialization(index)}
                      className="ml-1 text-primary/60 hover:text-primary"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={profile.contact_phone || ''}
                  onChange={(e) => setProfile({ ...profile, contact_phone: e.target.value })}
                  className="pl-10"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="whatsapp"
                  value={profile.whatsapp_number || ''}
                  onChange={(e) => setProfile({ ...profile, whatsapp_number: e.target.value })}
                  className="pl-10"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={profile.contact_email || ''}
                  onChange={(e) => setProfile({ ...profile, contact_email: e.target.value })}
                  className="pl-10"
                  placeholder="doctor@example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Clinic Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="address"
                  value={profile.clinic_address || ''}
                  onChange={(e) => setProfile({ ...profile, clinic_address: e.target.value })}
                  className="pl-10"
                  placeholder="Full clinic address..."
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clinic Timings */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Clinic Timings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(profile.clinic_timings).map(([day, time]) => (
                <div key={day}>
                  <Label htmlFor={day} className="capitalize">
                    {day}
                  </Label>
                  <Input
                    id={day}
                    value={time}
                    onChange={(e) => updateTiming(day, e.target.value)}
                    placeholder="9:00 AM - 6:00 PM"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProfile;
