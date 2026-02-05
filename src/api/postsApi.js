import axiosClient from './axiosClient';

export const postsApi = {
  // Get all posts
  getPosts: async () => {
    const response = await axiosClient.get('/posts?_sort=createdAt&_order=desc');
    return response.data;
  },

  // Get single post by ID
  getPostById: async (id) => {
    const response = await axiosClient.get(`/posts/${id}`);
    return response.data;
  },

  // Create new post
  createPost: async (postData) => {
    const response = await axiosClient.post('/posts', {
      ...postData,
      createdAt: new Date().toISOString(),
      likes: 0,
      views: 0,
      commentsCount: 0,
    });
    return response.data;
  },

  // Update post
  updatePost: async ({ id, data }) => {
    const response = await axiosClient.patch(`/posts/${id}`, data);
    return response.data;
  },

  // Delete post
  deletePost: async (id) => {
    const response = await axiosClient.delete(`/posts/${id}`);
    return response.data;
  },

  // Like post (optimistic update)
  likePost: async (id) => {
    const post = await axiosClient.get(`/posts/${id}`);
    const response = await axiosClient.patch(`/posts/${id}`, {
      likes: post.data.likes + 1,
    });
    return response.data;
  },

  // Increment views
  incrementViews: async (id) => {
    const post = await axiosClient.get(`/posts/${id}`);
    const response = await axiosClient.patch(`/posts/${id}`, {
      views: post.data.views + 1,
    });
    return response.data;
  },
};
