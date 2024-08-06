const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const login = async (email, password) => {
  try {
    const res = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      if (errorData.message.includes("Invalid credentials")) {
        return "Wrong Credentials";
      }
      throw new Error("Authentication failed");
    }

    const data = await res.json();
    const token = data.token;

    // Store the token in localStorage
    localStorage.setItem("authToken", token);

    return "Success";
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getToken = () => {
  return localStorage.getItem("authToken");
};
