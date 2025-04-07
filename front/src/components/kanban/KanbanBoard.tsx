import { useState } from "react"
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
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const handleCreateTask = (task: Task) => {
    setColumns(prev =>
      prev.map(col =>
        col.id === "todo" ? { ...col, tasks: [...col.tasks, task] } : col
      )
    )
  }

  const handleUpdateTask = (updated: Task) => {
    setColumns(prev =>
      prev.map(col => ({
        ...col,
        tasks: col.tasks.map(t => (t.id === updated.id ? updated : t)),
      }))
    )
  }

  const handleRenameColumn = (columnId: string) => {
    const newName = prompt("Nouveau nom de la colonne :")
    if (!newName) return
    setColumns(prev =>
      prev.map(col =>
        col.id === columnId ? { ...col, name: newName } : col
      )
    )
  }

  const handleDeleteColumn = (columnId: string) => {
    const confirmed = confirm("Supprimer cette colonne ?")
    if (!confirmed) return
    setColumns(prev => prev.filter(col => col.id !== columnId))
  }

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
      // Reorder dans la même colonne
      const updatedTasks = [...fromColumn.tasks]
      const [movedTask] = updatedTasks.splice(activeIndex, 1)
      updatedTasks.splice(overIndex, 0, movedTask)

      setColumns(prev =>
        prev.map(col =>
          col.id === fromColumn.id ? { ...col, tasks: updatedTasks } : col
        )
      )
    } else {
      // Déplacement entre colonnes
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

  return (
    <>
      <div className="flex justify-between items-center px-6 pt-4">
        <h2 className="text-xl font-bold">Tableau de bord</h2>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une tâche
        </Button>
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
                onTaskClick={handleUpdateTask}
                onRename={() => handleRenameColumn(col.id)}
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

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={{
          id: `task-${Date.now()}`,
          title: "",
          description: "",
          tags: [],
        }}
        onSave={handleCreateTask}
      />
    </>
  )
}
