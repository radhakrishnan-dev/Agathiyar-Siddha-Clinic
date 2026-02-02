import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  conditions?: string[];
}

const ServiceCard = ({ icon: Icon, title, description, conditions }: ServiceCardProps) => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Hello Doctor, I would like to consult you about ${title}.`);
    window.open(`https://wa.me/919876543210?text=${message}`, "_blank");
  };

  return (
    <div className="group p-6 bg-card rounded-2xl shadow-card hover:shadow-lg transition-all duration-300 border border-border">
      <div className="w-12 h-12 rounded-xl bg-herbal flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
        <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
      </div>
      <h3 className="font-serif text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>
      
      {conditions && conditions.length > 0 && (
        <div className="mb-4">
          <ul className="flex flex-wrap gap-2">
            {conditions.map((condition, index) => (
              <li
                key={index}
                className="text-xs px-2 py-1 bg-herbal text-herbal-foreground rounded-full"
              >
                {condition}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="flex gap-2">
        <Button 
          variant="whatsapp" 
          size="sm" 
          className="flex-1"
          onClick={handleWhatsAppClick}
        >
          Consult Now
        </Button>
        <Link to="/book" className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            Book
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
