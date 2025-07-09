export async function getAllSinhVien() {
    try {
        const response = await fetch('http://localhost:3000/sinh-vien', {
            method: "GET",
            credentials: 'include'
        })
        return await response.json()
    } catch (error) {
        console.log(error)
    }
}