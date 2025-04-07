import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card } from "@/components/ui/card"
import { MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// Props attendues pour chaque carte
type ProjectCardProps = {
  id: number
  name: string
  onRename: (id: number, newName: string) => void
  onDelete: (id: number) => void
  onDuplicate: (id: number) => void
  onClick?: () => void // Fonction pour gérer le clic sur la carte
}

export default function ProjectCard({
  id,
  name,
  onRename,
  onDelete,
  onDuplicate,
  onClick, // Fonction par défaut pour le clic sur la carte
}: ProjectCardProps) {
  // Intégration avec sortable (drag)
  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // États pour le renommage
  const [isRenamingInline, setIsRenamingInline] = useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [newName, setNewName] = useState(name)

  const inputRef = useRef<HTMLInputElement>(null)

  // Validation du renommage (inline ou dialog)
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
      onClick={onClick}
      style={style}
      className="relative cursor-pointer hover:shadow-lg transition"
    >
      {/* Bouton menu contextuel "..." */}
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

      {/* Nom du projet ou input de renommage inline */}
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

      {/* Dialog pour renommer via popup */}
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
