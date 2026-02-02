import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="group p-6 md:p-8 bg-card rounded-2xl shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border">
      <div className="w-14 h-14 rounded-xl bg-herbal flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
        <Icon className="w-7 h-7 text-primary group-hover:text-primary-foreground" />
      </div>
      <h3 className="font-serif text-xl font-semibold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
