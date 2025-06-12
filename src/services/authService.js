import api from "./api";

// Store only access token, refresh token stays in cookies
export const getAccessToken = () => localStorage.getItem("accessToken");
export const setAccessToken = (accessToken) =>
  localStorage.setItem("accessToken", accessToken);
export const clearTokens = () => localStorage.removeItem("accessToken");

//**Register API Call
export const register = async (name, email, password) => {
  const { data } = await api.post("/auth/register", {
    name,
    email,
    password,
  });
  return data;
};

// **Login API Call with "Remember Me" Support**
export const login = async (email, password, rememberMe) => {
  const { data } = await api.post("/auth/login", {
    email,
    password,
    rememberMe,
  });
  // Set access token (refresh token is stored in secure HTTP-only cookie)
  setAccessToken(data.data.accessToken);
  return data.data;
};

// **Refresh Access Token Using Secure Cookie**
export async function refreshToken() {
  try {
    const { data } = await api.post("/auth/refresh"); // No need to send refresh token manually
    setAccessToken(data.data.accessToken);
    return data.data.accessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw new Error("Failed to refresh token");
  }
}

// **Logout API Call**
export async function logoutUser() {
  try {
    await api.post("/auth/logout"); // Backend will clear the refresh token cookie
  } catch (error) {
    console.error("Failed to logout on the server:", error);
  } finally {
    clearTokens();
    window.location.href = "/auth/login";
  }
}
