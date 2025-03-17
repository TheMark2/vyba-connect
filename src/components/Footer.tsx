
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LanguageDropdown } from "@/components/ui/language-dropdown";
const Footer = () => {
  return <footer className="bg-vyba-cream dark:bg-[#2C2C2B] py-8 border-t border-gray-200/30 dark:border-gray-700/30">
      <div className="container mx-auto px-8 md:px-16 lg:px-24 xl:px-32 2xl:max-w-[1800px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-xl font-bold dark:text-white">VYBA</h2>
            <p className="text-black/60 dark:text-white/60 text-sm mt-1">© 2025 Vyba. Todos los derechos reservados</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-4">
            <div className="space-y-2">
              <Link to="/blog" className="block text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white text-sm">Blog</Link>
              <Link to="/ayuda" className="block text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white text-sm">Ayuda</Link>
            </div>
            <div className="space-y-2">
              <Link to="/precios" className="block text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white text-sm">Precios</Link>
              <Link to="/buscar" className="block text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white text-sm">Buscar</Link>
            </div>
            <div className="md:flex justify-end col-span-2 md:col-span-1 mt-4 md:mt-0">
              <LanguageDropdown />
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;
