
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
        className="min-w-[225px] bg-white border-none rounded-3xl p-3 shadow-none mb-2"
        align="center"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            className={cn(
              "rounded-md px-3 py-2.5 text-base font-medium mb-1 focus:bg-[#F8F8F8] hover:bg-[#F8F8F8] cursor-pointer",
              selectedLanguage.code === language.code && "bg-[#F8F8F8]"
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
