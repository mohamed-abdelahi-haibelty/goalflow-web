"use client";

import { Languages, Check, ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const localeConfig = {
  en: { name: "English", flag: "🇬🇧", nativeName: "English" },
  fr: { name: "Français", flag: "🇫🇷", nativeName: "Français" },
  ar: { name: "العربية", flag: "🇸🇦", nativeName: "العربية" },
};

type Locale = keyof typeof localeConfig;

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
  };

  const currentLocale = localeConfig[locale];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-2 px-3 hover:bg-accent/50"
        >
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline-block text-sm font-medium">
            {currentLocale.flag} {currentLocale.nativeName}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {(Object.keys(localeConfig) as Locale[]).map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className="flex items-center justify-between cursor-pointer py-2.5"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-lg">{localeConfig[loc].flag}</span>
              <span className="text-sm font-medium">
                {localeConfig[loc].nativeName}
              </span>
            </div>
            {locale === loc && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
