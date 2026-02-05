import axiosClient from './axiosClient';

export const commentsApi = {
  // Get comments by post ID
  getCommentsByPostId: async (postId) => {
    const response = await axiosClient.get(`/comments?postId=${postId}&_sort=createdAt&_order=asc`);
    return response.data;
  },

  // Create new comment
  createComment: async (commentData) => {
    const response = await axiosClient.post('/comments', {
      ...commentData,
      createdAt: new Date().toISOString(),
      likes: 0,
    });
    return response.data;
  },

  // Update comment
  updateComment: async ({ id, data }) => {
    const response = await axiosClient.patch(`/comments/${id}`, data);
    return response.data;
  },

  // Delete comment
  deleteComment: async (id) => {
    const response = await axiosClient.delete(`/comments/${id}`);
    return response.data;
  },

  // Like comment
  likeComment: async (id) => {
    const comment = await axiosClient.get(`/comments/${id}`);
    const response = await axiosClient.patch(`/comments/${id}`, {
      likes: comment.data.likes + 1,
    });
    return response.data;
  },
};
