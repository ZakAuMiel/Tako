import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Plus } from "lucide-react"
import TaskCard, { Task } from "./TaskCard"
import TaskDialog from "./TaskDialog"

type ColumnProps = {
  column: {
    id: string
    name: string
    tasks: Task[]
  }
}

export default function KanbanColumn({ column }: ColumnProps) {
  const [tasks, setTasks] = useState<Task[]>(column.tasks)
  const [newTitle, setNewTitle] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const addTask = () => {
    if (!newTitle.trim()) return
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTitle,
      description: "",
      tags: [],
    }
    setTasks(prev => [...prev, newTask])
    setNewTitle("")
  }

  const handleOpenDialog = (task: Task) => {
    setSelectedTask(task)
    setDialogOpen(true)
  }

  const handleSaveTask = (updated: Task) => {
    setTasks(prev =>
      prev.map(t => (t.id === updated.id ? updated : t))
    )
    setDialogOpen(false)
  }

  return (
    <div className="min-w-[250px] w-64 flex flex-col gap-2">
      <h2 className="text-lg font-semibold mb-2">{column.name}</h2>

      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onClick={() => handleOpenDialog(task)}
        />
      ))}

      <div className="mt-2">
        <Input
          placeholder="Nouvelle tâche"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTask()}
        />
        <Button onClick={addTask} variant="ghost" size="sm" className="mt-1 w-full">
          <Plus className="w-4 h-4 mr-1" /> Ajouter
        </Button>
      </div>

      {selectedTask && (
        <TaskDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          task={selectedTask}
          onSave={handleSaveTask}
        />
      )}
    </div>
  )
}
