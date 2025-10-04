import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import HomeLayout from "./layouts/HomeLayout";
import Dashboard from "./pages/Dashboard";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { DuyetDeTai } from "./pages/giang-vien-truong-bo-mon/DuyetDeTai";
import Forbidden from "./pages/403";
import { DeXuatDeTai } from "./pages/DeXuatDeTai";
import { HocKy } from "./pages/giao-vu/HocKy";
import DeTaiCuaToi from "./pages/DeTaiCuaToi";
import TienDo from "./pages/TienDo";
import BieuMauList from "./pages/giao-vu/BieuMauList";
import TieuChiGroups from "./pages/giao-vu/TieuChiGroups";
import { DanhGiaDeTai } from "./pages/giang-vien/DanhGiaDeTai";
import { ChuDe } from "./pages/giao-vu/ChuDe";
import HoiDong from "./pages/giang-vien-truong-bo-mon/HoiDong";
import ThongTinTaiKhoan from "./pages/ThongTinTaiKhoan";
import QuanLyTaiKhoan from "./pages/giao-vu/QuanLyTaiKhoan";
import PhanBien from "./pages/giang-vien-truong-bo-mon/PhanBien";
import { ChamDiemHoiDong } from "./pages/giang-vien/ChamDiemHoiDong";
import { ChamDiemPhanBien } from "./pages/giang-vien/ChamDiemPhanBien";
import ThongBao from "./pages/ThongBao";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/403" element={<Forbidden />} />

        {/* Auth Provide and Role Provide */}
        <Route element={<ProtectedRoute />}>
          <Route element={<HomeLayout />}> {/*Chia layout chính*/}


            <Route path="/" element={<Dashboard />} />
            <Route path="/thong-tin-tai-khoan" element={<ThongTinTaiKhoan />} />
            <Route path="/bieu-mau" element={<BieuMauList />} />
            <Route path="/bieu-mau/:id" element={<TieuChiGroups />} />
            <Route path="/hoc-ky" element={<HocKy />} />
            <Route path="/chu-de" element={<ChuDe />} />
            <Route path="/hoi-dong" element={<HoiDong />} />
            <Route path="/phan-bien" element={<PhanBien />} />
            <Route path="/thong-bao" element={<ThongBao />} />




            <Route element={<ProtectedRoute allowedRoles={["Giảng viên trưởng bộ môn"]} />}>
              <Route path="/duyet-de-tai" element={<DuyetDeTai />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["Giảng viên trưởng bộ môn", "Giảng viên"]} />}>
              <Route path="/danh-gia-de-tai/:id" element={<DanhGiaDeTai />} />
              <Route path="/cham-diem-hoi-dong/:id" element={<ChamDiemHoiDong />} />
              <Route path="/cham-diem-phan-bien/:id" element={<ChamDiemPhanBien />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["Sinh viên", "Giảng viên", "Giảng viên trưởng bộ môn"]} />}>
              <Route path="/de-xuat-de-tai" element={<DeXuatDeTai />} />
              <Route path="/de-tai-cua-toi" element={<DeTaiCuaToi />} />
              <Route path="/tien-do-de-tai/:id" element={<TienDo />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["Giáo vụ"]} />}>
              <Route path="/quan-ly-tai-khoan" element={<QuanLyTaiKhoan />} />
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
