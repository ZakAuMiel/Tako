// src/components/kanban/TaskDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import type { Task } from "./TaskCard"
import { DialogDescription } from "@/components/ui/dialog"

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task
  onSave: (updatedTask: Task) => void
  onDelete: (taskId: string) => void

}

export default function TaskDialog({ open, onOpenChange, task, onSave, onDelete }: TaskDialogProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [tags, setTags] = useState(task.tags.join(", "))

  useEffect(() => {
    setTitle(task.title)
    setDescription(task.description)
    setTags(task.tags.join(", "))
  }, [task])

  const handleSave = () => {
    onSave({
      ...task,
      title,
      description,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la tâche</DialogTitle>
          <DialogDescription>
            Modifiez les détails de la tâche ci-dessous.
          </DialogDescription>
        </DialogHeader>

        <Input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Titre de la tâche"
        />

        <Textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
          className="min-h-[100px]"
        />

        <Input
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="Tags séparés par des virgules"
        />

        <DialogFooter>
            <Button variant="destructive" onClick={() => onDelete(task.id)}>
                Supprimer
            </Button>
          <Button onClick={handleSave}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}