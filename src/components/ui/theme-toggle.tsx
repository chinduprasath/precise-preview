
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <ToggleGroup type="single" value={theme} onValueChange={(value) => {
      if (value === "light" || value === "dark" || value === "system") {
        setTheme(value)
      }
    }}>
      <ToggleGroupItem value="light" aria-label="Light mode" className="px-4 py-2 gap-2 data-[state=on]:bg-primary/10">
        <Sun size={16} />
        <span>Light</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Dark mode" className="px-4 py-2 gap-2 data-[state=on]:bg-primary/10">
        <Moon size={16} />
        <span>Dark</span>
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

export function ThemeToggleMinimal() {
  const { theme, setTheme } = useTheme()
  
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
