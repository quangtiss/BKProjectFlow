export async function getDeTai() {
    try {
        const response = await fetch('http://localhost:3000/de_tai', {
            method: "GET",
            credentials: 'include'
        })
        return await response.json()
    } catch (error) {
        return error
    }
}