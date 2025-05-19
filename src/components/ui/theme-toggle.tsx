import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
export function ThemeToggle() {
  const {
    theme,
    setTheme,
    resolvedTheme
  } = useTheme();
  return <ToggleGroup type="single" value={theme} onValueChange={value => {
    if (value === "light" || value === "dark") {
      setTheme(value);
    }
  }} className="border border-border rounded-lg bg-background shadow-sm">
      <ToggleGroupItem value="light" aria-label="Light mode" className="px-4 py-2 gap-2 data-[state=on]:bg-primary/10 data-[state=on]:text-primary data-[state=on]:font-medium">
        <Sun className="h-4 w-4" />
        <span>Light</span>
      </ToggleGroupItem>
      
      <ToggleGroupItem value="dark" aria-label="Dark mode" className="px-4 py-2 gap-2 data-[state=on]:bg-primary/10 data-[state=on]:text-primary data-[state=on]:font-medium">
        <Moon className="h-4 w-4" />
        <span>Dark</span>
      </ToggleGroupItem>
    </ToggleGroup>;
}
export function ThemeToggleMinimal() {
  const {
    setTheme,
    resolvedTheme
  } = useTheme();
  return <Tooltip>
      <TooltipTrigger asChild>
        
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{resolvedTheme === "dark" ? "Light mode" : "Dark mode"}</p>
      </TooltipContent>
    </Tooltip>;
}