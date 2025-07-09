export async function GetAllHocKi() {
    try {
        const response = await fetch("http://localhost:3000/hoc-ki", {
            method: "GET",
            credentials: "include"
        })
        const data = await response.json();
        if (response.ok) return data
        return false
    } catch (error) {
        console.log(error)
    }
}