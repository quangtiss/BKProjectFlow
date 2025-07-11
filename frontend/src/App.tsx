import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import HomeLayout from "./layouts/HomeLayout";
import Dashboard from "./pages/Dashboard";
import Other from "./pages/Other";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { DuyetDeTai } from "./pages/giang-vien-truong-bo-mon/DuyetDeTai";
import Forbidden from "./pages/403";
import { ChapNhanHuongDan } from "./pages/giang-vien/ChapNhanHuongDan";
import { DeXuatDeTai } from "./pages/DeXuatDeTai";
import { SignupPage } from "./pages/auth/SignupPage";
import { HocKy } from "./pages/giao-vu/HocKy";
import { ChapNhanDeTai } from "./pages/sinh-vien/ChapNhanDeTai";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/403" element={<Forbidden />} />

        {/* Auth Provide and Role Provide */}
        <Route element={<ProtectedRoute />}>
          <Route element={<HomeLayout />}> {/*Chia layout chính*/}


            <Route path="/" element={<Dashboard />} />
            <Route path="/other" element={<Other />} />
            <Route path="/de-xuat-de-tai" element={<DeXuatDeTai />} />


            <Route element={<ProtectedRoute allowedRoles={["Giảng viên trưởng bộ môn"]} />}>
              <Route path="/duyet-de-tai" element={<DuyetDeTai />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["Giảng viên"]} />}>
              <Route path="/chap-nhan-huong-dan" element={<ChapNhanHuongDan />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["Giáo vụ"]} />}>
              <Route path="/hoc-ky" element={<HocKy />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["Sinh viên"]} />}>
              <Route path="/chap-nhan-de-tai" element={<ChapNhanDeTai />} />
            </Route>


          </Route>
        </Route>
      </Routes>

      {/* tạo thông báo */}
      <Toaster position="top-center" richColors />
    </ThemeProvider>
  );
}

export default App;
