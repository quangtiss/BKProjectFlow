import { getCurrentAndNextHocKy } from "../getCurrentNextHocKy"

export async function getAllDeTaiCuaHocKyHienTai() {
    try {
        const response1 = await fetch('http://localhost:3000/hoc-ky', { method: 'GET', credentials: 'include' })
        const data1 = await response1.json()
        const currentHocKy = getCurrentAndNextHocKy(data1)?.current?.id
        const response = await fetch('http://localhost:3000/duyet-de-tai?giai_doan=Đồ án chuyên ngành&trang_thai=Đã chấp nhận&id_hoc_ky=' + currentHocKy, {
            method: "GET",
            credentials: 'include'
        })
        return await response.json()
    } catch (error) {
        return error
    }
}