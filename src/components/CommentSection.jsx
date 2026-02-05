import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { commentsApi } from '../api/commentsApi';
import { postsApi } from '../api/postsApi';
import CommentItem from './CommentItem';
import Loader from './Loader';

function CommentSection({ postId }) {
  const [newComment, setNewComment] = useState('');
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);

  // Fetch comments
  const { data: comments, isLoading, error } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentsApi.getCommentsByPostId(postId),
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: commentsApi.createComment,
    onSuccess: async () => {
      // Refetch comments
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      
      // Update post comments count
      const post = queryClient.getQueryData(['post', postId]);
      if (post) {
        await postsApi.updatePost({
          id: postId,
          data: { commentsCount: (post.commentsCount || 0) + 1 },
        });
        queryClient.invalidateQueries({ queryKey: ['post', postId] });
      }
      
      setNewComment('');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    createCommentMutation.mutate({
      postId,
      content: newComment.trim(),
      authorId: user.id,
      authorName: user.name,
      parentId: null, // Top-level comment
    });
  };

  // Organize comments into tree structure
  const organizeComments = (commentsList) => {
    const commentMap = {};
    const rootComments = [];

    // Create a map of all comments
    commentsList.forEach((comment) => {
      commentMap[comment.id] = { ...comment, replies: [] };
    });

    // Build the tree
    commentsList.forEach((comment) => {
      if (comment.parentId) {
        // This is a reply
        const parent = commentMap[comment.parentId];
        if (parent) {
          parent.replies.push(commentMap[comment.id]);
        }
      } else {
        // This is a root comment
        rootComments.push(commentMap[comment.id]);
      }
    });

    return rootComments;
  };

  if (isLoading) {
    return <Loader message="Loading comments..." />;
  }

  if (error) {
    return (
      <div className="comments-section">
        <p className="error-text">Failed to load comments.</p>
      </div>
    );
  }

  const organizedComments = organizeComments(comments || []);

  return (
    <div className="comments-section">
      <h2>Comments ({comments?.length || 0})</h2>

      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={createCommentMutation.isPending || !newComment.trim()}
        >
          {createCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      <div className="comments-list">
        {organizedComments.length > 0 ? (
          organizedComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} />
          ))
        ) : (
          <p className="empty-comments">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
}

export default CommentSection;
