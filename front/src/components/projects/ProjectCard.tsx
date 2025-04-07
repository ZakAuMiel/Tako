import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card } from "@/components/ui/card"
import { MoreVertical, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type ProjectCardProps = {
  id: number
  name: string
  onRename: (id: number, newName: string) => void
  onDelete: (id: number) => void
  onDuplicate: (id: number) => void
}

export default function ProjectCard({
  id,
  name,
  onRename,
  onDelete,
  onDuplicate,
}: ProjectCardProps) {
  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const [isRenamingInline, setIsRenamingInline] = useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [newName, setNewName] = useState(name)

  const inputRef = useRef<HTMLInputElement>(null)

  const handleRename = () => {
    if (newName.trim() && newName !== name) {
      onRename(id, newName.trim())
    }
    setIsRenamingInline(false)
    setRenameDialogOpen(false)
  }

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="relative p-4 w-full h-28 max-w-sm rounded-lg bg-card text-card-foreground border shadow transition group"
    >
      {/* Menu contextuel */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="absolute top-2 right-2 p-1 rounded hover:bg-muted">
            <MoreVertical className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsRenamingInline(true)}>
            ✏️ Renommer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setRenameDialogOpen(true)}>
            💬 Renommer via popup
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDuplicate(id)}>
            📄 Dupliquer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(id)}>
            🗑 Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Nom inline ou input */}
      {isRenamingInline ? (
        <Input
          ref={inputRef}
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") handleRename()
            if (e.key === "Escape") setIsRenamingInline(false)
          }}
          onBlur={handleRename}
          autoFocus
          className="text-sm font-medium"
        />
      ) : (
        <span className="truncate font-medium">{name}</span>
      )}

      {/* Dialog renommer */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <h2 className="text-lg font-semibold mb-2">Renommer le projet</h2>
          <Input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleRename()}
          />
          <DialogFooter className="mt-4">
            <Button onClick={handleRename}>Renommer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
