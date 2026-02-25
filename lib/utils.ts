/**
 * Verifies the current session token with the backend.
 * If valid, returns the user data and updates the local storage with the renewed token.
 * If invalid, clears local storage and throws an error.
 */
export async function verifySession() {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No token found");
  }

  try {
    const response = await fetch("/api/auth/verify", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Invalid token");
    }

    const data = await response.json();
    
    // Update stored user info and renewed token
    localStorage.setItem("user", JSON.stringify(data.user));
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
    }

    return data.user;
  } catch (error) {
    // Clear session on failure
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    throw error;
  }
}

/**
 * Clears the current session and redirects to home.
 */
export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
}
