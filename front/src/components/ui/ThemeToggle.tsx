// src/components/ui/ThemeToggle.tsx
import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Moon, Sun } from "lucide-react"

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")

  useEffect(() => {
    const stored = localStorage.getItem("theme")
    if (stored === "light" || stored === "dark") {
      setTheme(stored)
      document.documentElement.classList.toggle("dark", stored === "dark")
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      document.documentElement.classList.toggle("dark", prefersDark)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4 text-yellow-400" />
      <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
      <Moon className="h-4 w-4 text-blue-400" />
    </div>
  )
}
