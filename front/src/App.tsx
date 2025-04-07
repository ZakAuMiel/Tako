import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProjectManager from "@/components/projects/ProjectManager"
import ProjectPage from "@/pages/ProjectPage"
import AppLayout from "./components/layout/AppLayout"

function App() {
  return (
    <BrowserRouter>
    <AppLayout>
      <Routes>
        <Route path="/" element={<ProjectManager />} />
        <Route path="/project/:id" element={<ProjectPage />} />
      </Routes>
    </AppLayout>
    </BrowserRouter>
  )
}

export default App
