export async function getAllGiangVien() {
    try {
        const res = await fetch('http://localhost:3000/giang-vien', {
            method: "GET",
            credentials: 'include'
        })

        if (!res.ok) {
            throw new Error("Không thể lấy dữ liệu giảng viên")
        }

        const allGiangVien = await res.json()
        return allGiangVien
    } catch (error) {
        console.error("Lỗi khi lấy giảng viên:", error)
        throw error
    }
}