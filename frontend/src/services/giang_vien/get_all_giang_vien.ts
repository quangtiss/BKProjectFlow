export async function getAllGiangVien() {
    try {
        const response = await fetch('http://localhost:3000/giang-vien', {
            method: "GET",
            credentials: 'include'
        })
        return await response.json()
    } catch (error) {
        console.log(error)
    }
}