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
      return "Fail!"
    }
    return "Success!"

  } catch {
    return "Error";
  }
}