export async function getAllDeTai() {
    try {
        const response = await fetch('http://localhost:3000/duyet_de_tai?trang_thai=Đã chấp nhận', {
            method: "GET",
            credentials: 'include'
        })
        return await response.json()
    } catch (error) {
        return error
    }
}