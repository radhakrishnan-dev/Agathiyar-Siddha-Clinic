import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "919500769849"; // Replace with actual number
const DEFAULT_MESSAGE = "Hello Doctor, I would like to consult you.";

interface WhatsAppButtonProps {
  message?: string;
  productName?: string;
  productPrice?: string;
}

const WhatsAppButton = ({ message, productName, productPrice }: WhatsAppButtonProps) => {
  const handleClick = () => {
    let finalMessage = message || DEFAULT_MESSAGE;
    
    if (productName && productPrice) {
      finalMessage = `Hello Doctor, I am interested in ${productName} (Price: ₹${productPrice}). I would like to consult before purchasing.`;
    }
    
    const encodedMessage = encodeURIComponent(finalMessage);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 bg-nature text-nature-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center animate-pulse-soft"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 md:w-8 md:h-8" />
    </button>
  );
};

export default WhatsAppButton;
