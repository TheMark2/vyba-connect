import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LanguageDropdown } from "@/components/ui/language-dropdown";
import { Instagram, Facebook } from "lucide-react";

interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  return (
    <footer className={cn("py-10 bg-[#F7F7F7]", className)}>
      <div className="container mx-auto px-6 md:px-16 lg:px-24 xl:px-32 2xl:max-w-[1800px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Bloque izquierdo: logo + textos legales */}
          <div className="flex flex-col gap-4">
            <img
              src="/lovable-uploads/logovyba.png"
              alt="Vyba Artists"
              className="w-24 h-auto"
            />
            <div className="flex flex-wrap items-center gap-4 text-sm text-black/60 dark:text-white/60">
              <span>© 2025 Vyba. Todos los derechos reservados.</span>
              <Link
                to="/privacidad"
                className="hover:text-black dark:hover:text-white"
              >
                Privacidad
              </Link>
              <Link
                to="/condiciones"
                className="hover:text-black dark:hover:text-white"
              >
                Términos y condiciones
              </Link>
            </div>
          </div>

          {/* Bloque derecho: idioma y redes */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <LanguageDropdown />
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram className="text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white w-5 h-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook className="text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
