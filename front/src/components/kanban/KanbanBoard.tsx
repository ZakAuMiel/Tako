// src/components/kanban/KanbanBoard.tsx
import { useEffect, useState } from "react"
import {
  DndContext,
  DragOverlay,
  DragEndEvent,
  DragStartEvent,
  rectIntersection,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import KanbanColumn from "./KanbanColumn"
import TaskCard, { Task } from "./TaskCard"
import TaskDialog from "./TaskDialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export type Column = {
  id: string
  name: string
  tasks: Task[]
}

export default function KanbanBoard({ projectId }: { projectId: string }) {
  const [columns, setColumns] = useState<Column[]>([
    { id: "todo", name: "À faire", tasks: [] },
    { id: "doing", name: "En cours", tasks: [] },
    { id: "done", name: "Terminé", tasks: [] },
  ])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [addColumnDialogOpen, setAddColumnDialogOpen] = useState(false)
  const [newColumnName, setNewColumnName] = useState("")
  const [renamingColumnId, setRenamingColumnId] = useState<string | null>(null)

  // --- GESTION TÂCHES --- //

  const handleCreateTask = (task: Task) => {
    setColumns(prev =>
      prev.map(col =>
        col.id === "todo" ? { ...col, tasks: [...col.tasks, task] } : col
      )
    )
    setDialogOpen(false)
  }

  const handleDeleteTask = (taskId: string) => {
  setColumns(prev =>
    prev.map(col => ({
      ...col,
      tasks: col.tasks.filter(t => t.id !== taskId),
    }))
  )
  setDialogOpen(false)
  setSelectedTask(null)
}

  const handleUpdateTask = (updated: Task) => {
    setColumns(prev =>
      prev.map(col => ({
        ...col,
        tasks: col.tasks.map(t => (t.id === updated.id ? updated : t)),
      }))
    )
    setDialogOpen(false)
    setSelectedTask(null)
  }

  const openRenameDialog = (columnId: string) => {
    setRenamingColumnId(columnId)
    const col = columns.find(c => c.id === columnId)
    setNewColumnName(col?.name || "")
    setRenameDialogOpen(true)
  }

  const handleRenameColumn = () => {
    if (!renamingColumnId || !newColumnName.trim()) return
    setColumns(prev =>
      prev.map(col =>
        col.id === renamingColumnId ? { ...col, name: newColumnName } : col
      )
    )
    setRenameDialogOpen(false)
  }

  const handleDeleteColumn = (columnId: string) => {
    const confirmed = confirm("Supprimer cette colonne ?")
    if (!confirmed) return
    setColumns(prev => prev.filter(col => col.id !== columnId))
  }

  const handleAddColumn = () => {
    if (!newColumnName.trim()) return
    const newCol: Column = {
      id: `col-${Date.now()}`,
      name: newColumnName.trim(),
      tasks: [],
    }
    setColumns(prev => [...prev, newCol])
    setNewColumnName("")
    setAddColumnDialogOpen(false)
  }

  // --- DRAG & DROP --- //

  const handleDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current?.task as Task | undefined
    setActiveTask(task || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)
    if (!active || !over) return
    if (active.id === over.id) return

    const activeTask = active.data.current?.task as Task
    if (!activeTask) return

    const fromColumnIndex = columns.findIndex(col =>
      col.tasks.some(task => task.id === active.id)
    )
    const toColumnIndex = columns.findIndex(col =>
      col.tasks.some(task => task.id === over.id)
    )

    const fromColumn = columns[fromColumnIndex]
    const toColumn = toColumnIndex !== -1
      ? columns[toColumnIndex]
      : columns.find(col => col.id === over.id)

    if (!fromColumn || !toColumn) return

    const activeIndex = fromColumn.tasks.findIndex(t => t.id === active.id)
    const overIndex = toColumn.tasks.findIndex(t => t.id === over.id)

    if (fromColumn.id === toColumn.id) {
      const updatedTasks = [...fromColumn.tasks]
      const [movedTask] = updatedTasks.splice(activeIndex, 1)
      updatedTasks.splice(overIndex, 0, movedTask)

      setColumns(prev =>
        prev.map(col =>
          col.id === fromColumn.id ? { ...col, tasks: updatedTasks } : col
        )
      )
    } else {
      const fromTasks = [...fromColumn.tasks]
      const [movedTask] = fromTasks.splice(activeIndex, 1)

      const toTasks = [...toColumn.tasks]
      toTasks.splice(overIndex === -1 ? toTasks.length : overIndex, 0, movedTask)

      setColumns(prev =>
        prev.map(col => {
          if (col.id === fromColumn.id) return { ...col, tasks: fromTasks }
          if (col.id === toColumn.id) return { ...col, tasks: toTasks }
          return col
        })
      )
    }
  }

  // --- Écoute du clic sur task (via événement global) --- //
  useEffect(() => {
    const listener = (e: any) => {
      setSelectedTask(e.detail.task)
      setDialogOpen(true)
    }

    window.addEventListener("open-task-dialog", listener)
    return () => window.removeEventListener("open-task-dialog", listener)
  }, [])

  return (
    <>
      <div className="flex justify-between items-center px-6 pt-4">
        <h2 className="text-xl font-bold">Tableau de bord</h2>
        <div className="flex gap-2">
          <Button onClick={() => setAddColumnDialogOpen(true)} variant="secondary">
            <Plus className="w-4 h-4 mr-1" />
            Ajouter une colonne
          </Button>
          <Button
            onClick={() => {
              setDialogOpen(true)
              setSelectedTask(null)
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une tâche
          </Button>
        </div>
      </div>

      <DndContext
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex items-start gap-6 overflow-x-auto p-6 min-h-[calc(100vh-8rem)]">
          {columns.map(col => (
            <SortableContext
              key={col.id}
              items={col.tasks.map(t => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                key={col.id}
                id={col.id}
                name={col.name}
                tasks={col.tasks}
                onTaskClick={(task) => {
                  setSelectedTask(task)
                  setDialogOpen(true)

                }} // tu peux ajouter onTaskClick si tu veux ouvrir
                onRename={() => openRenameDialog(col.id)}
                onDelete={() => handleDeleteColumn(col.id)}
              />
            </SortableContext>
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="pointer-events-none scale-105 opacity-90 shadow-lg">
              <TaskCard task={activeTask} onExpand={() => {}} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Dialog Tâche (modale création ou édition) */}
      {dialogOpen && (
        <TaskDialog
          key={selectedTask ? selectedTask.id : "new"}
          open={dialogOpen}
          onDelete={handleDeleteTask}
          onOpenChange={(open) => {
            if (!open) setSelectedTask(null)
            setDialogOpen(open)
          }}
          task={
            selectedTask || {
              id: `task-${Date.now()}`,
              title: "",
              description: "",
              tags: [],
            }
          }
          onSave={selectedTask ? handleUpdateTask : handleCreateTask}
        />
      )}

      {/* Dialogs Colonnes */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renommer la colonne</DialogTitle>
          </DialogHeader>
          <Input
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            placeholder="Nom de la colonne"
          />
          <DialogFooter>
            <Button onClick={handleRenameColumn}>Valider</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addColumnDialogOpen} onOpenChange={setAddColumnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une colonne</DialogTitle>
          </DialogHeader>
          <Input
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            placeholder="Nom de la nouvelle colonne"
          />
          <DialogFooter>
            <Button onClick={handleAddColumn}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
