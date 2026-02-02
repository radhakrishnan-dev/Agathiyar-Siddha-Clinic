import { Link } from "react-router-dom";
import { Leaf, Phone, Mail, MapPin, Clock, Shield } from "lucide-react";
import { useDoctorProfile } from "@/hooks/useDoctorProfile";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { profile } = useDoctorProfile();

  const formatPhone = (phone: string | null) => {
    if (!phone) return "+91 98765 43210";
    return phone;
  };

  const formatPhoneForLink = (phone: string | null) => {
    if (!phone) return "+919876543210";
    return phone.replace(/\s+/g, "").replace(/^\+/, "");
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold">
                  {profile?.name || "Siddha Doctor"}
                </h3>
                <p className="text-sm text-primary-foreground/70">
                  {profile?.qualification || "BSMS – Traditional Healing"}
                </p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              {profile?.about?.substring(0, 150) || 
                "Bringing the ancient wisdom of Siddha medicine to modern healthcare. Natural healing for a healthy life."}
              {profile?.about && profile.about.length > 150 ? "..." : ""}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "About Doctor", path: "/about" },
                { name: "Services", path: "/services" },
                { name: "Medicines", path: "/medicines" },
                { name: "Book Consultation", path: "/book" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Consultation Hours */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Consultation Hours</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 text-accent" />
                <div>
                  <p className="text-sm font-medium">Monday – Saturday</p>
                  <p className="text-xs text-primary-foreground/70">
                    {profile?.clinic_timings?.monday || "9:00 AM – 6:00 PM"}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 text-accent" />
                <div>
                  <p className="text-sm font-medium">Sunday</p>
                  <p className="text-xs text-primary-foreground/70">
                    {profile?.clinic_timings?.sunday || "By Appointment Only"}
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 text-accent" />
                <div>
                  <a 
                    href={`tel:+${formatPhoneForLink(profile?.contact_phone)}`}
                    className="text-sm hover:text-primary-foreground/80 transition-colors"
                  >
                    {formatPhone(profile?.contact_phone)}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 text-accent" />
                <div>
                  <a 
                    href={`mailto:${profile?.contact_email || "doctor@siddhahealing.com"}`}
                    className="text-sm hover:text-primary-foreground/80 transition-colors"
                  >
                    {profile?.contact_email || "doctor@siddhahealing.com"}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-accent" />
                <div>
                  <p className="text-sm text-primary-foreground/80">
                    {profile?.clinic_address || "123 Healing Street, Chennai, Tamil Nadu - 600001"}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <p className="text-xs text-primary-foreground/60 text-center mb-4 max-w-3xl mx-auto">
            <strong>Disclaimer:</strong> All medicines and treatments offered through this website are provided only after proper consultation with the Siddha physician. Purchasing or taking any medicine without medical advice is not recommended. Treatments are personalized based on individual health conditions, and results may vary from person to person.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-sm text-center text-primary-foreground/80">
              © {currentYear} {profile?.name || "Siddha Doctor"}. All rights reserved. | Powered by Krishzz Techz
            </p>
            <Link
              to="/admin/login"
              className="flex items-center gap-1.5 text-xs text-primary-foreground/50 hover:text-primary-foreground/70 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
