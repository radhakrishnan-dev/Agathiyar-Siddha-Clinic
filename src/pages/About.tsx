import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  BookOpen, 
  Heart, 
  Leaf, 
  Shield, 
  Users,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import doctorHero from "@/assets/doctor-hero.png";
import { useDoctorProfile } from "@/hooks/useDoctorProfile";

const About = () => {
  const { profile, isLoading } = useDoctorProfile();

  const doctorImage = profile?.photo_url || doctorHero;
  const doctorName = profile?.name || "Dr.Ramachandran S";
  const doctorQualification = profile?.qualification || "BSMS –  Bachelor of Siddha Medicine & Surgery";
  const yearsExperience = profile?.years_of_experience || 6;
  const aboutText = profile?.about || `With over ${yearsExperience} years of experience in traditional Siddha medicine, I am dedicated to providing natural, holistic healing solutions for various health conditions. My approach combines ancient wisdom with modern understanding to deliver personalized care for each patient..`;

  const qualifications = [
    doctorQualification,
    "Registered Medical Practitioner",
    "Member, Indian Medical Association",
    "Specialized in Traditional Siddha Therapeutics"
  ];

  const conditionsTreated = profile?.specializations?.length 
    ? profile.specializations 
    : [
        "Digestive Disorders",
        "Skin Diseases & Allergies",
        "Joint Pain & Arthritis",
        "Diabetes Management",
        "Respiratory Problems",
        "Hair Fall & Skin Care",
        "Women's Health Issues",
        "Men's Health Concerns",
        "Immunity Enhancement",
        "Stress & Mental Wellness",
        "Chronic Fatigue",
        "Lifestyle Disorders"
      ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-card">
                <img 
                  src={doctorImage} 
                  alt={doctorName} 
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {/* Experience Badge */}
              <div className="absolute -bottom-4 -right-4 md:right-8 bg-primary text-primary-foreground p-4 rounded-2xl shadow-card z-20">
                <p className="text-3xl font-bold">{yearsExperience}+</p>
                <p className="text-sm">Years Experience</p>
              </div>

              {/* Decorative */}
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-herbal rounded-full opacity-50 blur-2xl" />
            </div>

            {/* Content */}
            <div>
              <span className="inline-block px-4 py-2 bg-herbal text-herbal-foreground text-sm font-medium rounded-full mb-6">
                About the Doctor
              </span>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                {doctorName}
              </h1>
              <p className="text-xl text-primary font-medium mb-6">
                {doctorQualification}
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {aboutText}
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                My approach combines time-tested Siddha principles with modern diagnostic 
                understanding, ensuring each patient receives personalized care that addresses 
                the root cause of their health concerns.
              </p>

              <Link to="/book">
                <Button variant="hero" className="gap-2">
                  Book Consultation
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Qualifications */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-herbal flex items-center justify-center">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                Qualifications & Credentials
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {qualifications.map((qual, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border"
                >
                  <CheckCircle className="w-5 h-5 text-nature mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{qual}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Treatment Philosophy */}
      <section className="py-16 md:py-20 nature-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6">
              My Treatment Philosophy
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              I believe that true healing comes from understanding the individual as a whole – 
              body, mind, and spirit. Siddha medicine teaches us that every person is unique, 
              and their treatment should be equally personalized.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="p-6 bg-card rounded-2xl shadow-soft">
                <Leaf className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-serif text-lg font-semibold mb-2">Natural Remedies</h3>
                <p className="text-sm text-muted-foreground">
                  Using only pure herbs and natural ingredients
                </p>
              </div>
              <div className="p-6 bg-card rounded-2xl shadow-soft">
                <Shield className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-serif text-lg font-semibold mb-2">Safe Treatment</h3>
                <p className="text-sm text-muted-foreground">
                  No harmful side effects or chemical additives
                </p>
              </div>
              <div className="p-6 bg-card rounded-2xl shadow-soft">
                <Users className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-serif text-lg font-semibold mb-2">Personal Care</h3>
                <p className="text-sm text-muted-foreground">
                  Individual attention to every patient
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conditions Treated */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-herbal flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
              Conditions I Treat
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              With years of experience, I specialize in treating a wide range of health 
              conditions using traditional Siddha methods.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {conditionsTreated.map((condition, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 p-4 bg-card rounded-xl border border-border hover:border-primary transition-colors"
              >
                <Leaf className="w-4 h-4 text-nature flex-shrink-0" />
                <span className="text-sm text-foreground">{condition}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button variant="default" className="gap-2">
                View All Services
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
