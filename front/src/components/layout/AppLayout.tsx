// src/components/layout/AppLayout.tsx
import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/ui/ThemeToggle"

type AppLayoutProps = {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen w-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground p-4 border-r border-sidebar-border hidden md:flex flex-col">
        <div className="text-xl font-bold mb-6">🐙 Tako</div>
        <nav className="flex flex-col gap-2">
          <Button variant="ghost" className="justify-start text-inherit">Projets</Button>
          <Button variant="ghost" className="justify-start text-inherit">À propos</Button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="h-16 px-4 flex items-center justify-between border-b border-border bg-muted">
          <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
          <ThemeToggle />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
