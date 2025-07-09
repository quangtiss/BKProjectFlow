export async function CreateDeTai(values: object) {
    try {
        const response = await fetch("http://localhost:3000/de-tai", {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values)
        })
        if (response.ok) return "Success!"
        return "Fail!"
    } catch (error) {
        console.log(error)
        return "Error!"
    }
}