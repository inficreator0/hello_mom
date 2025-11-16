const API_BASE_URL = "https://motherhood-community-app-latest.onrender.com/api";

// Get JWT token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Set JWT token in localStorage
export const setToken = (token: string): void => {
  localStorage.setItem("token", token);
};

// Remove JWT token from localStorage
export const removeToken = (): void => {
  localStorage.removeItem("token");
};

// API request helper
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.statusText}`);
  }

  return response.json();
};

// Auth API
export const authAPI = {
  register: async (data: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    const response = await apiRequest<{
      token: string;
      type: string;
      userId: number;
      username: string;
      email: string;
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  },

  login: async (username: string, password: string) => {
    const response = await apiRequest<{
      token: string;
      type: string;
      userId: number;
      username: string;
      email: string;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    return response;
  },
};

// Posts API
export const postsAPI = {
  getAll: async (page: number = 0, size: number = 20, sortBy: string = "createdAt", sortDir: string = "DESC") => {
    const response = await apiRequest<{
      content: any[];
      totalElements: number;
      totalPages: number;
      size: number;
      number: number;
    }>(`/posts?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
    return response;
  },

  getById: async (id: string) => {
    const response = await apiRequest<any>(`/posts/${id}`);
    return response;
  },

  create: async (data: { title: string; content: string }) => {
    const response = await apiRequest<any>("/posts", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  },

  update: async (id: string, data: { title: string; content: string }) => {
    const response = await apiRequest<any>(`/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response;
  },

  delete: async (id: string) => {
    await apiRequest(`/posts/${id}`, {
      method: "DELETE",
    });
  },
};

// Comments API
export const commentsAPI = {
  getByPostId: async (postId: string) => {
    const response = await apiRequest<any[]>(`/posts/${postId}/comments`);
    return response;
  },

  create: async (postId: string, data: { content: string; parentCommentId?: number }) => {
    const response = await apiRequest<any>(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  },

  update: async (postId: string, commentId: string, data: { content: string }) => {
    const response = await apiRequest<any>(`/posts/${postId}/comments/${commentId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response;
  },

  delete: async (postId: string, commentId: string) => {
    await apiRequest(`/posts/${postId}/comments/${commentId}`, {
      method: "DELETE",
    });
  },
};

