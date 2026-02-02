import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle,
  Send
} from "lucide-react";
import { useState } from "react";
import { useDoctorProfile } from "@/hooks/useDoctorProfile";

const Contact = () => {
  const { profile } = useDoctorProfile();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const phoneNumber = profile?.contact_phone || "+91 95007 69849";
  const whatsappNumber = profile?.whatsapp_number || "+91 95007 69849";
  const email = profile?.contact_email || "ramsiddha95@gmail.com";
  const address = profile?.clinic_address || "135, AARIYUR STREET, ROAD, opp. MURUGAN HOTEL, PETHANAICKEN PALAYAM, Olaipadi, SALEM, Tamil Nadu 636109";
  const clinicTimings = profile?.clinic_timings;

  const formatPhoneForLink = (phone: string) => {
    return phone.replace(/\s+/g, "").replace(/^\+/, "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.message) {
      alert("Please fill in required fields");
      return;
    }

    const message = `📧 *Contact Form Message*

👤 *From:* ${formData.name}
📧 *Email:* ${formData.email || "Not provided"}
📱 *Phone:* ${formData.phone || "Not provided"}

💬 *Message:*
${formData.message}

---
Sent from Contact Page`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${formatPhoneForLink(whatsappNumber)}?text=${encodedMessage}`, "_blank");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-2 bg-herbal text-herbal-foreground text-sm font-medium rounded-full mb-6">
              Get in Touch
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Contact Us
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions about our treatments or want to schedule a consultation? 
              We're here to help you on your wellness journey.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
                Contact Information
              </h2>

              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4 p-5 bg-card rounded-xl border border-border">
                  <div className="w-12 h-12 rounded-xl bg-herbal flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                    <a 
                      href={`tel:+${formatPhoneForLink(phoneNumber)}`}
                      className="text-primary hover:underline"
                    >
                      {phoneNumber}
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      Call for appointments
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-card rounded-xl border border-border">
                  <div className="w-12 h-12 rounded-xl bg-herbal flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">WhatsApp</h3>
                    <a 
                      href={`https://wa.me/${formatPhoneForLink(whatsappNumber)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {whatsappNumber}
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      Quick response on WhatsApp
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-card rounded-xl border border-border">
                  <div className="w-12 h-12 rounded-xl bg-herbal flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <a 
                      href={`mailto:${email}`}
                      className="text-primary hover:underline"
                    >
                      {email}
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">
                      For detailed inquiries
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-card rounded-xl border border-border">
                  <div className="w-12 h-12 rounded-xl bg-herbal flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Clinic Address</h3>
                    <p className="text-muted-foreground">
                      {address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-card rounded-xl border border-border">
                  <div className="w-12 h-12 rounded-xl bg-herbal flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Consultation Hours</h3>
                    <p className="text-muted-foreground">
                      Mon – Sat: {clinicTimings?.monday || "9:00 AM – 6:00 PM"}<br />
                      Sunday: {clinicTimings?.sunday || "By Appointment Only"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-card rounded-2xl shadow-card border border-border p-6 md:p-8">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Send a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Your phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="How can we help you?"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" variant="default" className="w-full gap-2">
                    <Send className="w-4 h-4" />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 md:py-20 nature-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
              Find Us
            </h2>
            <p className="text-muted-foreground">
              Visit our clinic for in-person consultation
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-card">
            <iframe
              src="https://www.google.com/maps?q=11.6487414,78.507029&z=17&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Clinic Location"
              className="w-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
