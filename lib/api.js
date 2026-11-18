export const API_URL = process.env.NEXT_PUBLIC_API_URL;

const TOKEN_KEY = "access-token";

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Server থেকে JWT token নিয়ে সংরক্ষণ করে
export async function requestToken(email) {
  const res = await fetch(`${API_URL}/jwt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (res.status === 404) {
    throw new Error("Account not found. Please register first or contact the admin.");
  }
  if (!res.ok) {
    throw new Error("Could not get access token. Please try again.");
  }

  const data = await res.json();
  setToken(data.token);
  return data.token;
}

// Token সহ Server-এ request পাঠানো (private route-এর জন্য, পরে কাজে লাগবে)
export async function apiFetch(path, options = {}) {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error((data && data.message) || "Request failed");
    error.status = res.status;
    throw error;
  }
  return data;
}