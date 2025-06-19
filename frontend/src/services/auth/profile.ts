export async function ProfileService() {
    try {
        const response = await fetch("http://localhost:3000/auth/profile", {
            method: "GET",
            credentials: "include",
        });
        if (response.ok) {
            const data = await response.json();
            return {
                ...data.tai_khoan,
                fullName: data.tai_khoan.ho + " " + data.tai_khoan.ten
            }
        } else console.log("Get profile error :(((");
    } catch (error) {
        console.log(error);
    }
}
