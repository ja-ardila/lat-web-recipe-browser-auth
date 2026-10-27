import type { CurrentUser, Recipe } from "../types";

const RECIPES_URL = "http://localhost:3001";
const AUTH_URL = "https://se-register-api.en.tripleten-services.com/v1";

async function authRequest(path: string, options: RequestInit = {}) {
  const res = await fetch(`${AUTH_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(
      error.error || error.message || "Error de autenticación",
    );
  }

  return res.json();
}

function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((err) => Promise.reject(new Error(err.message || "Error en la solicitud")));
      }
      return res.json();
    })
    .then((body) => body.data);
}

export function getRecipes(): Promise<Recipe[]> {
  return request<Recipe[]>(`${RECIPES_URL}/recipes`);
}

export function getRecipe(id: string): Promise<Recipe> {
  return request<Recipe>(`${RECIPES_URL}/recipes/${id}`);
}

export function toggleLike(id: string, userId: string): Promise<Recipe> {
  return request<Recipe>(`${RECIPES_URL}/recipes/${id}/likes`, {
    method: "PUT",
    body: JSON.stringify({ userId }),
  });
}

export async function getCurrentUser(token: string): Promise<CurrentUser> {
  const { data } = await authRequest("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ token: string; user: CurrentUser }> {
  const { token } = await authRequest("/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const user = await getCurrentUser(token);
  return { token, user };
}

export async function registerUser(
  email: string,
  password: string,
): Promise<CurrentUser> {
  const { data } = await authRequest("/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return data;
}
