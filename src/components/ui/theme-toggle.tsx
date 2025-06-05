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
  return;
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