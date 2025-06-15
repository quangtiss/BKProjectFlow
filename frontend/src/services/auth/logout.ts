export async function LogOutService() {
    try {
        const response = await fetch("http://localhost:3000/auth/logout", {
          method: "POST",
          credentials: "include"
        })
        if (response.ok) {
          console.log(await response.json());
        }
        else console.log("LogOut error :(((")
      } catch (error) {
        console.log(error)
      }
}