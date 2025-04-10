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
import { Button } from "@/components/ui/button"

type ProjectCardProps = {
  id: number
  name: string
  onRename: (id: number, newName: string) => void
  onDelete: (id: number) => void
  onDuplicate: (id: number) => void
  onClick?: () => void
  isRenaming?: boolean
  onStartRenaming?: () => void
}

export default function ProjectCard({
  id,
  name,
  onRename,
  onDelete,
  onDuplicate,
  onClick,
  isRenaming,
  onStartRenaming,
}: ProjectCardProps) {
  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  const inputRef = useRef<HTMLInputElement>(null)
  const [newName, setNewName] = useState(name)

  const handleRename = () => {
    if (newName.trim() && newName !== name) {
      onRename(id, newName.trim())
    }
  }

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onClick}
      style={style}
      className="relative cursor-pointer hover:shadow-lg transition p-4"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="absolute top-2 right-2 p-1 rounded hover:bg-muted"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              onStartRenaming?.()
            }}
          >
            💬 Renommer
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate(id)
            }}
          >
            📄 Dupliquer
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              onDelete(id)
            }}
          >
            🗑 Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isRenaming ? (
        <Input
          ref={inputRef}
          id={`rename-${id}`}
          name={`rename-${id}`}
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") handleRename()
            if (e.key === "Escape") onStartRenaming?.()
          }}
          onBlur={handleRename}
          autoFocus
          className="text-sm font-medium"
        />
      ) : (
        <span className="truncate font-medium">{name}</span>
      )}
    </Card>
  )
}
