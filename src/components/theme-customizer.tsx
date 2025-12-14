"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, Paintbrush } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const themes = [
  {
    name: "Zinc",
    activeColor: "bg-zinc-950",
    cssVars: {
      light: {
        "--background": "0 0% 100%",
        "--foreground": "240 10% 3.9%",
        "--card": "0 0% 100%",
        "--card-foreground": "240 10% 3.9%",
        "--popover": "0 0% 100%",
        "--popover-foreground": "240 10% 3.9%",
        "--primary": "240 5.9% 10%",
        "--primary-foreground": "0 0% 98%",
        "--secondary": "240 4.8% 95.9%",
        "--secondary-foreground": "240 5.9% 10%",
        "--muted": "240 4.8% 95.9%",
        "--muted-foreground": "240 3.8% 46.1%",
        "--accent": "240 4.8% 95.9%",
        "--accent-foreground": "240 5.9% 10%",
        "--destructive": "0 84.2% 60.2%",
        "--destructive-foreground": "0 0% 98%",
        "--border": "240 5.9% 90%",
        "--input": "240 5.9% 90%",
        "--ring": "240 10% 3.9%",
      },
      dark: {
        "--background": "240 10% 3.9%",
        "--foreground": "0 0% 98%",
        "--card": "240 10% 3.9%",
        "--card-foreground": "0 0% 98%",
        "--popover": "240 10% 3.9%",
        "--popover-foreground": "0 0% 98%",
        "--primary": "0 0% 98%",
        "--primary-foreground": "240 5.9% 10%",
        "--secondary": "240 3.7% 15.9%",
        "--secondary-foreground": "0 0% 98%",
        "--muted": "240 3.7% 15.9%",
        "--muted-foreground": "240 5% 64.9%",
        "--accent": "240 3.7% 15.9%",
        "--accent-foreground": "0 0% 98%",
        "--destructive": "0 62.8% 30.6%",
        "--destructive-foreground": "0 0% 98%",
        "--border": "240 3.7% 15.9%",
        "--input": "240 3.7% 15.9%",
        "--ring": "240 4.9% 83.9%",
      },
    },
  },
  {
    name: "Blue",
    activeColor: "bg-blue-600",
    cssVars: {
      light: {
        "--background": "0 0% 100%",
        "--foreground": "222.2 84% 4.9%",
        "--card": "0 0% 100%",
        "--card-foreground": "222.2 84% 4.9%",
        "--popover": "0 0% 100%",
        "--popover-foreground": "222.2 84% 4.9%",
        "--primary": "221.2 83.2% 53.3%",
        "--primary-foreground": "210 40% 98%",
        "--secondary": "210 40% 96.1%",
        "--secondary-foreground": "222.2 47.4% 11.2%",
        "--muted": "210 40% 96.1%",
        "--muted-foreground": "215.4 16.3% 46.9%",
        "--accent": "210 40% 96.1%",
        "--accent-foreground": "222.2 47.4% 11.2%",
        "--destructive": "0 84.2% 60.2%",
        "--destructive-foreground": "210 40% 98%",
        "--border": "214.3 31.8% 91.4%",
        "--input": "214.3 31.8% 91.4%",
        "--ring": "221.2 83.2% 53.3%",
      },
      dark: {
        "--background": "222.2 84% 4.9%",
        "--foreground": "210 40% 98%",
        "--card": "222.2 84% 4.9%",
        "--card-foreground": "210 40% 98%",
        "--popover": "222.2 84% 4.9%",
        "--popover-foreground": "210 40% 98%",
        "--primary": "217.2 91.2% 59.8%",
        "--primary-foreground": "222.2 47.4% 11.2%",
        "--secondary": "217.2 32.6% 17.5%",
        "--secondary-foreground": "210 40% 98%",
        "--muted": "217.2 32.6% 17.5%",
        "--muted-foreground": "215 20.2% 65.1%",
        "--accent": "217.2 32.6% 17.5%",
        "--accent-foreground": "210 40% 98%",
        "--destructive": "0 62.8% 30.6%",
        "--destructive-foreground": "210 40% 98%",
        "--border": "217.2 32.6% 17.5%",
        "--input": "217.2 32.6% 17.5%",
        "--ring": "212.7 26.8% 83.9%",
      },
    },
  },
  {
    name: "Violet",
    activeColor: "bg-violet-600",
    cssVars: {
      light: {
        "--background": "0 0% 100%",
        "--foreground": "224 71.4% 4.1%",
        "--card": "0 0% 100%",
        "--card-foreground": "224 71.4% 4.1%",
        "--popover": "0 0% 100%",
        "--popover-foreground": "224 71.4% 4.1%",
        "--primary": "262.1 83.3% 57.8%",
        "--primary-foreground": "210 20% 98%",
        "--secondary": "220 14.3% 95.9%",
        "--secondary-foreground": "220.9 39.3% 11%",
        "--muted": "220 14.3% 95.9%",
        "--muted-foreground": "220 8.9% 46.1%",
        "--accent": "220 14.3% 95.9%",
        "--accent-foreground": "220.9 39.3% 11%",
        "--destructive": "0 84.2% 60.2%",
        "--destructive-foreground": "210 20% 98%",
        "--border": "220 13% 91%",
        "--input": "220 13% 91%",
        "--ring": "262.1 83.3% 57.8%",
      },
      dark: {
        "--background": "224 71.4% 4.1%",
        "--foreground": "210 20% 98%",
        "--card": "224 71.4% 4.1%",
        "--card-foreground": "210 20% 98%",
        "--popover": "224 71.4% 4.1%",
        "--popover-foreground": "210 20% 98%",
        "--primary": "263.4 70% 50.4%", // Deep Violet
        "--primary-foreground": "210 20% 98%",
        "--secondary": "215 27.9% 16.9%",
        "--secondary-foreground": "210 20% 98%",
        "--muted": "215 27.9% 16.9%",
        "--muted-foreground": "217.9 10.6% 64.9%",
        "--accent": "215 27.9% 16.9%",
        "--accent-foreground": "210 20% 98%",
        "--destructive": "0 62.8% 30.6%",
        "--destructive-foreground": "210 20% 98%",
        "--border": "215 27.9% 16.9%",
        "--input": "215 27.9% 16.9%",
        "--ring": "263.4 70% 50.4%",
      },
    },
  },
  {
    name: "Orange",
    activeColor: "bg-orange-500",
    cssVars: {
      light: {
        "--background": "0 0% 100%",
        "--foreground": "20 14.3% 4.1%",
        "--card": "0 0% 100%",
        "--card-foreground": "20 14.3% 4.1%",
        "--popover": "0 0% 100%",
        "--popover-foreground": "20 14.3% 4.1%",
        "--primary": "24.6 95% 53.1%",
        "--primary-foreground": "60 9.1% 97.8%",
        "--secondary": "60 4.8% 95.9%",
        "--secondary-foreground": "24 9.8% 10%",
        "--muted": "60 4.8% 95.9%",
        "--muted-foreground": "25 5.3% 44.7%",
        "--accent": "60 4.8% 95.9%",
        "--accent-foreground": "24 9.8% 10%",
        "--destructive": "0 84.2% 60.2%",
        "--destructive-foreground": "60 9.1% 97.8%",
        "--border": "20 5.9% 90%",
        "--input": "20 5.9% 90%",
        "--ring": "24.6 95% 53.1%",
      },
      dark: {
        "--background": "20 14.3% 4.1%",
        "--foreground": "60 9.1% 97.8%",
        "--card": "20 14.3% 4.1%",
        "--card-foreground": "60 9.1% 97.8%",
        "--popover": "20 14.3% 4.1%",
        "--popover-foreground": "60 9.1% 97.8%",
        "--primary": "20.5 90.2% 48.2%", // Deep Orange
        "--primary-foreground": "60 9.1% 97.8%",
        "--secondary": "12 6.5% 15.1%",
        "--secondary-foreground": "60 9.1% 97.8%",
        "--muted": "12 6.5% 15.1%",
        "--muted-foreground": "24 5.4% 63.9%",
        "--accent": "12 6.5% 15.1%",
        "--accent-foreground": "60 9.1% 97.8%",
        "--destructive": "0 62.8% 30.6%",
        "--destructive-foreground": "60 9.1% 97.8%",
        "--border": "12 6.5% 15.1%",
        "--input": "12 6.5% 15.1%",
        "--ring": "20.5 90.2% 48.2%",
      },
    },
  },
];

export function ThemeCustomizer() {
  const { resolvedTheme } = useTheme();
  const [activeTheme, setActiveTheme] = useState(themes[0]);

  // Apply properties on theme switch or mount
  useEffect(() => {
    const root = document.documentElement;
    const themeMode = resolvedTheme === "dark" ? "dark" : "light";
    const vars = activeTheme.cssVars[themeMode];

    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [activeTheme, resolvedTheme]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="hidden md:flex gap-2">
          <Paintbrush className="h-4 w-4" />
          Customize
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Theme Customizer</DrawerTitle>
            <DrawerDescription>
              Pick a style for your dashboard.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-8">
            <div className="space-y-4">
              <Label className="text-base">Color</Label>
              <div className="grid grid-cols-3 gap-2">
                {themes.map((theme) => (
                  <Button
                    key={theme.name}
                    variant={"outline"}
                    className={cn(
                      "justify-start gap-2",
                      activeTheme.name === theme.name &&
                        "border-2 border-primary"
                    )}
                    onClick={() => setActiveTheme(theme)}
                  >
                    <span
                      className={cn("h-5 w-5 rounded-full", theme.activeColor)}
                    />
                    <span className="text-xs font-medium">{theme.name}</span>
                    {activeTheme.name === theme.name && (
                      <Check className="h-4 w-4 ml-auto" />
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
