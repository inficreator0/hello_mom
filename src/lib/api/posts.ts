import { apiRequest } from "../http";

export const postsAPI = {
  getAll: async (
    page: number = 0,
    size: number = 20,
    sortBy: string = "createdAt",
    sortDir: string = "DESC"
  ) => {
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

  upvote: async (id: string) => {
    await apiRequest(`/posts/${id}/upvote`, {
      method: "POST",
    });
  },

  downvote: async (id: string) => {
    await apiRequest(`/posts/${id}/downvote`, {
      method: "POST",
    });
  },
};

export const commentsAPI = {
  getByPostId: async (postId: string) => {
    const response = await apiRequest<any[]>(`/posts/${postId}/comments`);
    return response;
  },

  create: async (
    postId: string,
    data: { content: string; parentCommentId?: number }
  ) => {
    const response = await apiRequest<any>(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  },

  update: async (
    postId: string,
    commentId: string,
    data: { content: string }
  ) => {
    const response = await apiRequest<any>(
      `/posts/${postId}/comments/${commentId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
    return response;
  },

  delete: async (postId: string, commentId: string) => {
    await apiRequest(`/posts/${postId}/comments/${commentId}`, {
      method: "DELETE",
    });
  },
};


