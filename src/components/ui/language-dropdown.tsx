
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export type Language = {
  name: string;
  code: string;
};

export const languages: Language[] = [
  { name: "Español", code: "es" },
  { name: "Frances", code: "fr" },
  { name: "Ingles", code: "en" },
  { name: "Catalán", code: "ca" },
  { name: "Italiano", code: "it" },
];

interface LanguageDropdownProps {
  className?: string;
}

export function LanguageDropdown({ className }: LanguageDropdownProps) {
  const [selectedLanguage, setSelectedLanguage] = React.useState<Language>(languages[0]);
  const isMobile = useIsMobile();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="secondary" 
          className={cn("text-sm px-6 py-3 h-auto flex items-center gap-2", className)}
        >
          <Globe className="w-4 h-4" />
          {selectedLanguage.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className={cn(
          "min-w-[225px] bg-white dark:bg-[#575654] border-none rounded-2xl p-2 shadow-xl mb-2",
          isMobile && "ml-6" // Increased left margin on mobile
        )}
        align="center"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            className={cn(
              "rounded-md px-3 py-3 text-sm font-regular mb-1 focus:bg-[#F8F8F8] hover:bg-[#F8F8F8] dark:text-white dark:focus:bg-[#444341] dark:hover:bg-[#444341] cursor-pointer transition-colors duration-300",
              selectedLanguage.code === language.code && (
                "bg-[#F8F8F8] dark:bg-[#444341] font-medium"
              )
            )}
            onClick={() => setSelectedLanguage(language)}
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
