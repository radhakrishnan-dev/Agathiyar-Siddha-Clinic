-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user has a role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create is_admin helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- RLS policies for user_roles
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Create doctor_profile table (singleton for the doctor)
CREATE TABLE public.doctor_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Dr. Siddha Specialist',
  qualification TEXT NOT NULL DEFAULT 'BBMS - Siddha Doctor',
  photo_url TEXT,
  about TEXT,
  years_of_experience INTEGER DEFAULT 10,
  specializations TEXT[] DEFAULT ARRAY['Digestive problems', 'Skin diseases', 'Joint pain'],
  clinic_timings JSONB DEFAULT '{"monday": "9:00 AM - 6:00 PM", "tuesday": "9:00 AM - 6:00 PM", "wednesday": "9:00 AM - 6:00 PM", "thursday": "9:00 AM - 6:00 PM", "friday": "9:00 AM - 6:00 PM", "saturday": "9:00 AM - 1:00 PM", "sunday": "Closed"}'::jsonb,
  contact_phone TEXT,
  contact_email TEXT,
  whatsapp_number TEXT DEFAULT '+91 9876543210',
  clinic_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.doctor_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage doctor profile" ON public.doctor_profile
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Public can view doctor profile" ON public.doctor_profile
  FOR SELECT TO anon
  USING (true);

-- Create consultation_requests table
CREATE TABLE public.consultation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_age INTEGER,
  patient_gender TEXT,
  health_issue TEXT NOT NULL,
  consultation_type TEXT DEFAULT 'Online',
  requested_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Completed', 'Cancelled')),
  doctor_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage consultation requests" ON public.consultation_requests
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Anyone can create consultation requests" ON public.consultation_requests
  FOR INSERT TO anon
  WITH CHECK (true);

-- Create medicines table
CREATE TABLE public.medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Tablet' CHECK (category IN ('Tablet', 'Powder', 'Syrup', 'Tonic', 'Oil', 'Other')),
  price DECIMAL(10, 2) NOT NULL,
  stock_status TEXT NOT NULL DEFAULT 'Available' CHECK (stock_status IN ('Available', 'Out of Stock', 'Limited')),
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  description TEXT,
  used_for TEXT,
  dosage_notes TEXT,
  whatsapp_template TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage medicines" ON public.medicines
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Public can view active medicines" ON public.medicines
  FOR SELECT TO anon
  USING (is_active = true);

-- Create medicine_inquiries table
CREATE TABLE public.medicine_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_id UUID REFERENCES public.medicines(id) ON DELETE SET NULL,
  medicine_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_name TEXT,
  inquiry_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Replied', 'Closed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.medicine_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage medicine inquiries" ON public.medicine_inquiries
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Create website_content table (singleton)
CREATE TABLE public.website_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  title TEXT,
  content TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage website content" ON public.website_content
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Public can view enabled content" ON public.website_content
  FOR SELECT TO anon
  USING (is_enabled = true);

-- Create admin_settings table (singleton)
CREATE TABLE public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number TEXT DEFAULT '+91 9876543210',
  consultation_message_template TEXT DEFAULT 'Hello Doctor, I would like to consult you.',
  medicine_inquiry_template TEXT DEFAULT 'I want to consult before purchasing this medicine.',
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  medicine_selling_enabled BOOLEAN NOT NULL DEFAULT true,
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  sms_notifications BOOLEAN NOT NULL DEFAULT false,
  new_consultation_notification BOOLEAN NOT NULL DEFAULT true,
  new_inquiry_notification BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage settings" ON public.admin_settings
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Public can view certain settings" ON public.admin_settings
  FOR SELECT TO anon
  USING (true);

-- Create services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'Stethoscope',
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage services" ON public.services
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Public can view enabled services" ON public.services
  FOR SELECT TO anon
  USING (is_enabled = true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers to all tables
CREATE TRIGGER update_doctor_profile_updated_at
  BEFORE UPDATE ON public.doctor_profile
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_consultation_requests_updated_at
  BEFORE UPDATE ON public.consultation_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medicines_updated_at
  BEFORE UPDATE ON public.medicines
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medicine_inquiries_updated_at
  BEFORE UPDATE ON public.medicine_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_website_content_updated_at
  BEFORE UPDATE ON public.website_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default doctor profile
INSERT INTO public.doctor_profile (name, qualification, about, years_of_experience, specializations, whatsapp_number)
VALUES (
  'Dr. Siddha Specialist',
  'BBMS - Bachelor of Siddha Medicine & Surgery',
  'With over 10 years of experience in traditional Siddha medicine, I am dedicated to providing natural, holistic healing solutions for various health conditions. My approach combines ancient wisdom with modern understanding to deliver personalized care for each patient.',
  10,
  ARRAY['Digestive problems', 'Skin diseases', 'Joint pain & arthritis', 'Diabetes management', 'Hair fall & skin care', 'Women''s health', 'Men''s health', 'Immunity boosting'],
  '+91 9876543210'
);

-- Insert default admin settings
INSERT INTO public.admin_settings (whatsapp_number, consultation_message_template, medicine_inquiry_template)
VALUES (
  '+91 9876543210',
  'Hello Doctor, I would like to consult you.',
  'I want to consult before purchasing this medicine.'
);

-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('admin-uploads', 'admin-uploads', true);

-- Storage policies for admin-uploads bucket
CREATE POLICY "Admins can upload files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'admin-uploads' AND public.is_admin());

CREATE POLICY "Admins can update files" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'admin-uploads' AND public.is_admin());

CREATE POLICY "Admins can delete files" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'admin-uploads' AND public.is_admin());

CREATE POLICY "Public can view admin uploads" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'admin-uploads');