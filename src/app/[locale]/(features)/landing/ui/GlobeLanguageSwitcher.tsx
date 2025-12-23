import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Check, Globe } from "lucide-react";
import { useLocale } from "next-intl";

const localeConfig = {
  en: { name: "English (EN)", nativeName: "English" },
  fr: { name: "Français (FR)", nativeName: "Français" },
  ar: { name: "  العربية (AR)", nativeName: "العربية" },
};

type Locale = keyof typeof localeConfig;

function GlobeLanguageSwitcher() {
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
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch Language</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {(Object.keys(localeConfig) as Locale[]).map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className=""
          >
            {localeConfig[loc].nativeName}
            {locale === loc && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default GlobeLanguageSwitcher;
