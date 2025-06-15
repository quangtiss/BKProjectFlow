export async function LogInService(ten_tai_khoan: string, mat_khau: string) {
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ten_tai_khoan, mat_khau }),
      });
  
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Login failed");
      }
      
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
}