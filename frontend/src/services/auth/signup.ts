export async function SignUpService(data) {
    try {
        const response = await fetch("http://localhost:3000/auth/signup", {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            return "Success!"
        }
        return "Fail!"
    } catch (error) {
        console.log(error)
        return "Error";
    }
}