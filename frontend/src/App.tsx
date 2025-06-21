import { Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import LoginPage from './pages/LoginPage'
import ProtectedRoute from "./routes/ProtectedRoute"
import HomeLayout from "./layouts/HomeLayout"
import Dashboard from "./pages/Dashboard"
import Other from "./pages/Other"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { DuyetDeTai } from "./pages/DuyetDeTai"
import Forbidden from "./pages/403"
import { ChapNhanHuongDan } from "./pages/ChapNhanHuongDan"
import { DeXuatDeTai } from "./pages/DeXuatDeTai"


function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/403" element={<Forbidden />} />

        {/* Auth Provide and Role Provide */}
        <Route element={<ProtectedRoute />}>
          {/* Chia layout chính */}
          <Route element={<HomeLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/other" element={<Other />} />
            {/* Route chỉ cho giảng viên */}
            <Route element={<ProtectedRoute allowedRoles={['Giảng viên trưởng bộ môn', 'Giáo vụ']} />}>
              <Route path="/duyet-de-tai" element={<DuyetDeTai />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['Giảng viên']} />}>
              <Route path="/chap-nhan-huong-dan" element={<ChapNhanHuongDan />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['Giảng viên', 'Sinh viên']} />}>
              <Route path="/de-xuat-de-tai" element={<DeXuatDeTai />} />
            </Route>
          </Route>
        </Route>

      </Routes>

      {/* tạo thông báo */}
      <Toaster position="top-center" richColors />
    </ThemeProvider>
  )
}

export default App
