import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Clock, MessageCircle, Phone, Video } from "lucide-react";

const BookConsultation = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    healthIssue: "",
    consultationType: "online"
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.age || !formData.gender || !formData.phone || !formData.healthIssue) {
      alert("Please fill in all required fields");
      return;
    }

    // Create WhatsApp message
    const message = `🏥 *New Consultation Request*

👤 *Patient Details:*
Name: ${formData.name}
Age: ${formData.age}
Gender: ${formData.gender}
Phone: ${formData.phone}

📋 *Health Issue:*
${formData.healthIssue}

📞 *Preferred Consultation:* ${formData.consultationType === "online" ? "Online Video Call" : "Phone Call"}

---
Sent from Siddha Doctor Website`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/919500769849?text=${encodedMessage}`, "_blank");
    
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-nature/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-nature" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
              Consultation Request Sent!
            </h1>
            <p className="text-muted-foreground mb-8">
              Thank you for your consultation request. The doctor will review your details 
              and contact you shortly via WhatsApp or Phone.
            </p>
            <Button 
              onClick={() => setSubmitted(false)}
              variant="outline"
            >
              Submit Another Request
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-2 bg-herbal text-herbal-foreground text-sm font-medium rounded-full mb-6">
              Online Consultation
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Book Your Consultation
            </h1>
            <p className="text-lg text-muted-foreground">
              Fill in your details below and the doctor will contact you to schedule 
              your personalized Siddha consultation.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl shadow-card border border-border p-6 md:p-8">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Patient Details
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  {/* Age & Gender Row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Enter your age"
                        min="1"
                        max="120"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => setFormData({ ...formData, gender: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  {/* Health Issue */}
                  <div className="space-y-2">
                    <Label htmlFor="healthIssue">Describe Your Health Issue *</Label>
                    <Textarea
                      id="healthIssue"
                      placeholder="Please describe your health condition, symptoms, and any existing medications..."
                      rows={5}
                      value={formData.healthIssue}
                      onChange={(e) => setFormData({ ...formData, healthIssue: e.target.value })}
                      required
                    />
                  </div>

                  {/* Consultation Type */}
                  <div className="space-y-3">
                    <Label>Preferred Consultation Type</Label>
                    <RadioGroup
                      value={formData.consultationType}
                      onValueChange={(value) => setFormData({ ...formData, consultationType: value })}
                      className="flex flex-col sm:flex-row gap-4"
                    >
                      <div className="flex items-center space-x-3 p-4 bg-herbal rounded-xl cursor-pointer flex-1">
                        <RadioGroupItem value="online" id="online" />
                        <Label htmlFor="online" className="flex items-center gap-2 cursor-pointer">
                          <Video className="w-5 h-5 text-primary" />
                          Online Video Call
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-herbal rounded-xl cursor-pointer flex-1">
                        <RadioGroupItem value="phone" id="phone" />
                        <Label htmlFor="phone" className="flex items-center gap-2 cursor-pointer">
                          <Phone className="w-5 h-5 text-primary" />
                          Phone Call
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" variant="hero" className="w-full">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Submit via WhatsApp
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    Your details will be sent to the doctor via WhatsApp. 
                    The doctor will contact you shortly.
                  </p>
                </form>
              </div>
            </div>

            {/* Info Sidebar */}
            <div className="space-y-6">
              {/* Consultation Info */}
              <div className="bg-herbal rounded-2xl p-6">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                  Consultation Hours
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Monday – Saturday</p>
                      <p className="text-sm text-muted-foreground">9:00 AM – 6:00 PM</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Sunday</p>
                      <p className="text-sm text-muted-foreground">By Appointment Only</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* What to Expect */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                  What to Expect
                </h3>
                <ul className="space-y-3">
                  {[
                    "Doctor will review your details",
                    "You'll receive a call/message to schedule",
                    "Consultation via video or phone",
                    "Personalized treatment plan",
                    "Medicine recommendations if needed"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-nature mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Contact */}
              <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
                <h3 className="font-serif text-lg font-semibold mb-3">
                  Need Urgent Help?
                </h3>
                <p className="text-sm text-primary-foreground/80 mb-4">
                  For urgent consultations, you can directly contact via WhatsApp or call.
                </p>
                <a 
                  href="tel:+919500769849"
                  className="flex items-center gap-2 text-accent font-medium hover:underline"
                >
                  <Phone className="w-4 h-4" />
                  +91 95007 69849
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookConsultation;
