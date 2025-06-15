export async function ProfileService() {
    try {
        const response = await fetch("http://localhost:3000/auth/profile", {
            method: "GET",
            credentials: "include",
        });
        if (response.ok) {
            const data = await response.json();
            return {
                name: data.tai_khoan.ho + " " + data.tai_khoan.ten,
                email: data.tai_khoan.email
            }
        } else console.log("Get profile error :(((");
    } catch (error) {
        console.log(error);
    }
}
