export async function CreateHocKy(data: object) {
    try {
        const response = await fetch("http://localhost:3000/hoc-ky", {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.ok) return "Succcess!"
        return "Fail!"
    } catch {
        return "Error!"
    }
}