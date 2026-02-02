import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DoctorProfile {
  id: string;
  name: string;
  qualification: string;
  photo_url: string | null;
  about: string | null;
  years_of_experience: number | null;
  specializations: string[] | null;
  contact_phone: string | null;
  contact_email: string | null;
  whatsapp_number: string | null;
  clinic_address: string | null;
  clinic_timings: Record<string, string> | null;
}

export const useDoctorProfile = () => {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("doctor_profile")
          .select("*")
          .limit(1)
          .single();

        if (error) {
          console.error("Error fetching doctor profile:", error);
          setError(error.message);
        } else {
          setProfile({
            ...data,
            clinic_timings: data.clinic_timings as Record<string, string> | null,
          });
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch doctor profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, isLoading, error };
};
