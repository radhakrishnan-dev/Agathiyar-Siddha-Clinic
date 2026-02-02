import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About Doctor", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "Medicines", path: "/medicines" },
  { name: "Book Consultation", path: "/book" },
  { name: "Contact", path: "/contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo + Title */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>

            {/* ✅ Visible on BOTH mobile & desktop */}
            <div className="leading-tight">
              <h1 className="font-serif font-semibold text-foreground text-sm md:text-lg">
                Agathiyar Siddha Clinic

              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Siddha Doctor in Salem
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.path
                    ? "bg-herbal text-herbal-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-herbal/50"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:block">
            <Link to="/book">
              <Button variant="default" size="default">
                Book Consultation
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-herbal transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    location.pathname === link.path
                      ? "bg-herbal text-herbal-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-herbal/50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/book" onClick={() => setIsMenuOpen(false)} className="mt-2">
                <Button variant="default" className="w-full">
                  Book Consultation
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
