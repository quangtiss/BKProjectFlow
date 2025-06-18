import { Routes, Route } from "react-router-dom"
import LoginPage from './pages/LoginPage'
import ProtectedRoute from "./routes/ProtectedRoute"
import HomeLayout from "./layouts/HomeLayout"
import Dashboard from "./pages/Dashboard"
import Other from "./pages/Other"
import { ThemeProvider } from "@/components/ui/theme-provider"


function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<ProtectedRoute><HomeLayout /></ProtectedRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/other" element={<Other />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App
