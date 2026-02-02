import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShoppingBag, MessageCircle, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MedicineCardProps {
  id: string;
  name: string;
  price: number;
  description: string;
  usedFor: string[];
  images: string[];
}

const MedicineCard = ({ id, name, price, description, usedFor, images }: MedicineCardProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const { toast } = useToast();

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleConsultBuy = () => {
    const message = encodeURIComponent(
      `Hello Doctor, I am interested in "${name}" (Price: ₹${price}). I would like to consult before purchasing this medicine.`
    );
    window.open(`https://wa.me/919876543210?text=${message}`, "_blank");
  };

  const handleConsultDoctor = () => {
    const message = encodeURIComponent(
      `Hello Doctor, I would like to know more about "${name}" and its benefits.`
    );
    window.open(`https://wa.me/919876543210?text=${message}`, "_blank");
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/medicines#${id}`;
    const shareData = {
      title: name,
      text: `Check out ${name} - ${description}. Price: ₹${price}`,
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied!",
          description: "Medicine link has been copied to clipboard.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to copy",
          description: "Could not copy link to clipboard.",
        });
      }
    }
  };

  return (
    <div className="group bg-card rounded-2xl shadow-card hover:shadow-lg transition-all duration-300 border border-border overflow-hidden">
      {/* Image Slider */}
      <div className="relative aspect-square bg-herbal">
        <img
          src={images[currentImage]}
          alt={name}
          className="w-full h-full object-cover"
        />
        
        {/* Share Button */}
        <button
          onClick={handleShare}
          className="absolute top-2 right-2 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center hover:bg-background transition-colors z-10"
          aria-label="Share medicine"
        >
          <Share2 className="w-4 h-4 text-foreground" />
        </button>
        
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center hover:bg-background transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center hover:bg-background transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            
            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImage ? "bg-primary" : "bg-background/60"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-serif text-lg font-semibold text-foreground">{name}</h3>
          <span className="text-lg font-bold text-primary whitespace-nowrap">₹{price}</span>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>

        {/* Used For Tags */}
        <div className="mb-4">
          <p className="text-xs font-medium text-foreground mb-2">Used for:</p>
          <div className="flex flex-wrap gap-1">
            {usedFor.slice(0, 4).map((use, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-herbal text-herbal-foreground rounded-full"
              >
                {use}
              </span>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <Button 
            variant="default" 
            className="w-full gap-2"
            onClick={handleConsultBuy}
          >
            <ShoppingBag className="w-4 h-4" />
            Consult & Buy
          </Button>
          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={handleConsultDoctor}
          >
            <MessageCircle className="w-4 h-4" />
            Consult Doctor
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;
