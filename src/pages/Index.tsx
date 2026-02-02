import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FeatureCard from "@/components/FeatureCard";
import { 
  Leaf, 
  Shield, 
  Heart, 
  Clock, 
  Award, 
  Users,
  ArrowRight,
  Phone
} from "lucide-react";
import doctorHero from "@/assets/doctor-hero.png";
import siddhaMedicine from "@/assets/siddha-medicine.jpg";
import { useDoctorProfile } from "@/hooks/useDoctorProfile";

const Index = () => {
  const { profile, isLoading } = useDoctorProfile();

  const doctorImage = profile?.photo_url || doctorHero;
  const doctorName = profile?.name || "Dr.Ramachandran S";
  const doctorQualification = profile?.qualification || "BSMS – Bachelor of Siddha Medicine & Surgery";
  const yearsExperience = profile?.years_of_experience || 6;
  const phoneNumber = profile?.contact_phone || "+91 95007 69849";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-16 md:py-24 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div className="text-center lg:text-left animate-fade-in-up">
              <span className="inline-block px-4 py-2 bg-herbal text-herbal-foreground text-sm font-medium rounded-full mb-6">
                ✨ Best Siddha Clinic in Pethanaicken Palayam, Salem
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
               Traditional Siddha Treatment by{" "}
                <span className="text-gradient-primary">Dr.S.Ramachandran</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                Experience the ancient wisdom of Siddha medicine at Agathiyar Siddha Clinic, 
                Pethanaicken Palayam, Salem with personalized, natural and holistic treatments.

              </p>
              
              {/* Doctor Info */}
              <div className="flex items-center gap-4 mb-8 justify-center lg:justify-start">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                  <img src={doctorImage} alt="Doctor" className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">{doctorName}</p>
                  <p className="text-sm text-muted-foreground">{doctorQualification}</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/book">
                  <Button variant="hero" className="w-full sm:w-auto gap-2">
                    Book Online Consultation
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/medicines">
                  <Button variant="heroOutline" className="w-full sm:w-auto gap-2">
                    <Leaf className="w-5 h-5" />
                    View Medicines
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-fade-in-delay">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-card">
                <img 
                  src={doctorImage} 
                  alt="Siddha Doctor" 
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 md:left-6 bg-card p-4 rounded-2xl shadow-card border border-border z-20 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-herbal rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{yearsExperience}+ Years</p>
                    <p className="text-xs text-muted-foreground">Experience</p>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-herbal rounded-full opacity-50 blur-2xl" />
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-accent/20 rounded-full opacity-50 blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* About Siddha Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <div className="relative">
                <img 
                  src={siddhaMedicine} 
                  alt="Siddha Medicine Preparation" 
                  className="rounded-3xl shadow-card w-full"
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <span className="inline-block px-4 py-2 bg-herbal text-herbal-foreground text-sm font-medium rounded-full mb-6">
                About Siddha Medicine
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                Ancient Healing Wisdom for Modern Wellness
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Siddha medicine is one of the oldest medical systems in the world, originating 
                from Tamil Nadu, India. It emphasizes balance between body, mind, and spirit 
                through natural remedies derived from herbs, minerals, and metals.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "100% natural and herbal treatments",
                  "No harmful side effects",
                  "Treats root cause, not just symptoms",
                  "Personalized treatment for each individual"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-nature flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-3 h-3 text-nature-foreground" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/about">
                <Button variant="default" className="gap-2">
                  Learn More About Doctor
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features/Highlights Section */}
      <section className="py-16 md:py-24 nature-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-card text-foreground text-sm font-medium rounded-full mb-6">
              Why Choose Us
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Health, Our Priority
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience personalized Siddha treatment with a focus on holistic healing 
              and long-lasting results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard
              icon={Clock}
              title="15+ Years Experience"
              description="Decades of expertise in traditional Siddha medicine with thousands of successfully treated patients."
            />
            <FeatureCard
              icon={Leaf}
              title="Natural Treatment"
              description="100% herbal medicines with no harmful chemicals or side effects. Safe for all age groups."
            />
            <FeatureCard
              icon={Shield}
              title="Side-Effect Free"
              description="Our treatments focus on healing without causing additional health complications."
            />
            <FeatureCard
              icon={Heart}
              title="Personalized Care"
              description="Every patient receives customized treatment plans based on their unique health condition."
            />
            <FeatureCard
              icon={Users}
              title="Online Consultation"
              description="Consult from anywhere in the world through our convenient online consultation service."
            />
            <FeatureCard
              icon={Award}
              title="Trusted by Thousands"
              description="Patients across India and abroad trust our expertise for their health needs."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-3xl p-8 md:p-12 lg:p-16 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Consult the Doctor Online from Anywhere
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
              Get personalized Siddha treatment recommendations from the comfort of your home. 
              Book your consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/book">
                <Button 
                  variant="secondary" 
                  size="xl"
                  className="w-full sm:w-auto gap-2 font-semibold"
                >
                  Book Consultation
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href={`tel:${phoneNumber.replace(/\s+/g, "")}`}>
                <Button 
                  variant="outline" 
                  size="xl"
                  className="w-full sm:w-auto gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
