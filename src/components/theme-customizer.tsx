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
import { useEffect, useState } from "react";

// Define available themes corresponding to CSS data-attributes
const themes = [
  { name: "Zinc", value: "", color: "bg-zinc-900" },
  { name: "Blue", value: "blue", color: "bg-blue-600" },
  { name: "Violet", value: "violet", color: "bg-violet-600" },
  { name: "Orange", value: "orange", color: "bg-orange-500" },
  { name: "Green", value: "green", color: "bg-green-600" },
  { name: "Red", value: "red", color: "bg-red-600" },
];

export function ThemeCustomizer() {
  const [mounted, setMounted] = useState(false);
  const [activeTheme, setActiveTheme] = useState("");

  // Wait for mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Read current theme from document body
    const currentTheme = document.body.getAttribute("data-theme") || "";
    setActiveTheme(currentTheme);
  }, []);

  const handleThemeChange = (themeValue: string) => {
    setActiveTheme(themeValue);
    if (themeValue) {
      document.body.setAttribute("data-theme", themeValue);
    } else {
      document.body.removeAttribute("data-theme");
    }
  };

  if (!mounted) return null;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hidden md:flex gap-2 w-full"
        >
          <Paintbrush className="h-4 w-4" />
          Customize Theme
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Theme Customizer</DrawerTitle>
            <DrawerDescription>
              Pick a color theme for your dashboard.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-8">
            <div className="space-y-4">
              <Label className="text-base">Primary Color</Label>
              <div className="grid grid-cols-3 gap-2">
                {themes.map((theme) => (
                  <Button
                    key={theme.name}
                    variant={"outline"}
                    className={cn(
                      "justify-start gap-2",
                      activeTheme === theme.value &&
                        "border-2 border-primary ring-1 ring-primary"
                    )}
                    onClick={() => handleThemeChange(theme.value)}
                  >
                    <span
                      className={cn(
                        "h-5 w-5 rounded-full border border-black/10 dark:border-white/10",
                        theme.color
                      )}
                    />
                    <span className="text-xs font-medium">{theme.name}</span>
                    {activeTheme === theme.value && (
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
