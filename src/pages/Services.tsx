import ServiceCard from "@/components/ServiceCard";
import { 
  Utensils, 
  Droplets, 
  Bone, 
  Activity, 
  Wind, 
  Scissors, 
  Heart, 
  Shield, 
  Brain, 
  Zap, 
  Baby, 
  Sparkles 
} from "lucide-react";

const services = [
  {
    icon: Utensils,
    title: "Digestive Problems",
    description: "Natural treatment for gastritis, acidity, constipation, IBS, and other digestive disorders using herbal remedies.",
    conditions: ["Gastritis", "Acidity", "IBS", "Constipation"]
  },
  {
    icon: Droplets,
    title: "Skin Diseases",
    description: "Effective Siddha treatments for psoriasis, eczema, vitiligo, acne, and various skin allergies.",
    conditions: ["Psoriasis", "Eczema", "Vitiligo", "Acne"]
  },
  {
    icon: Bone,
    title: "Joint Pain & Arthritis",
    description: "Relief from joint pain, rheumatoid arthritis, osteoarthritis, and musculoskeletal disorders.",
    conditions: ["Arthritis", "Back Pain", "Knee Pain", "Sciatica"]
  },
  {
    icon: Activity,
    title: "Diabetes Management",
    description: "Natural diabetes control through Siddha medicines, diet modifications, and lifestyle changes.",
    conditions: ["Type 2 Diabetes", "Blood Sugar", "Metabolic Health"]
  },
  {
    icon: Wind,
    title: "Respiratory Problems",
    description: "Treatment for asthma, bronchitis, allergies, sinusitis, and chronic respiratory conditions.",
    conditions: ["Asthma", "Bronchitis", "Sinusitis", "Allergies"]
  },
  {
    icon: Scissors,
    title: "Hair Fall & Hair Care",
    description: "Natural solutions for hair fall, dandruff, premature greying, and scalp conditions.",
    conditions: ["Hair Fall", "Dandruff", "Grey Hair", "Baldness"]
  },
  {
    icon: Heart,
    title: "Women's Health",
    description: "Specialized care for PCOS, menstrual disorders, fertility issues, and hormonal imbalances.",
    conditions: ["PCOS", "Menstrual Issues", "Fertility", "Menopause"]
  },
  {
    icon: Shield,
    title: "Men's Health",
    description: "Treatment for male health concerns including vitality, reproductive health, and prostate issues.",
    conditions: ["Vitality", "Reproductive Health", "Prostate"]
  },
  {
    icon: Zap,
    title: "Immunity Boosting",
    description: "Strengthen your immune system with traditional Siddha tonics and preventive medicines.",
    conditions: ["Low Immunity", "Frequent Infections", "Weakness"]
  },
  {
    icon: Brain,
    title: "Stress & Mental Wellness",
    description: "Natural remedies for stress, anxiety, insomnia, and mental fatigue using Siddha principles.",
    conditions: ["Stress", "Anxiety", "Insomnia", "Depression"]
  },
  {
    icon: Baby,
    title: "Pediatric Care",
    description: "Safe and gentle Siddha treatments for children's common health issues and development.",
    conditions: ["Cold & Cough", "Digestion", "Growth", "Immunity"]
  },
  {
    icon: Sparkles,
    title: "Lifestyle Disorders",
    description: "Holistic management of obesity, high cholesterol, hypertension, and lifestyle-related conditions.",
    conditions: ["Obesity", "Cholesterol", "Hypertension", "Fatigue"]
  }
];

const Services = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-2 bg-herbal text-herbal-foreground text-sm font-medium rounded-full mb-6">
              Our Services
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Siddha Treatments & Services
            </h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive Siddha medical treatments for a wide range of health conditions. 
              Each treatment is personalized to address your unique health needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                conditions={service.conditions}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 md:py-20 nature-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6">
              Not Sure Which Treatment You Need?
            </h2>
            <p className="text-muted-foreground mb-8">
              Every individual is unique, and so is their health condition. Book a consultation 
              to get a personalized assessment and treatment recommendation.
            </p>
            <a 
              href="https://wa.me/919876543210?text=Hello%20Doctor%2C%20I%20would%20like%20to%20discuss%20my%20health%20condition."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-button"
            >
              Discuss with Doctor
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
