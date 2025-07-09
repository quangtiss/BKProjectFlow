export async function CreateHocKi(data: object) {
    try {
        const response = await fetch("http://localhost:3000/hoc-ki", {
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