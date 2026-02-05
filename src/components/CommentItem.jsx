import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { commentsApi } from '../api/commentsApi';
import { postsApi } from '../api/postsApi';
import LikeButton from './LikeButton';

function CommentItem({ comment, postId, depth = 0 }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);

  // Like comment mutation
  const likeCommentMutation = useMutation({
    mutationFn: commentsApi.likeComment,
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: ['comments', postId] });
      const previousComments = queryClient.getQueryData(['comments', postId]);

      queryClient.setQueryData(['comments', postId], (old) =>
        old.map((c) =>
          c.id === commentId ? { ...c, likes: c.likes + 1 } : c
        )
      );

      return { previousComments };
    },
    onError: (err, commentId, context) => {
      queryClient.setQueryData(['comments', postId], context.previousComments);
    },
  });

  // Create reply mutation
  const createReplyMutation = useMutation({
    mutationFn: commentsApi.createComment,
    onSuccess: async () => {
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
      
      setReplyContent('');
      setShowReplyForm(false);
    },
  });

  const handleLike = () => {
    likeCommentMutation.mutate(comment.id);
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    createReplyMutation.mutate({
      postId,
      content: replyContent.trim(),
      authorId: user.id,
      authorName: user.name,
      parentId: comment.id,
    });
  };

  const maxDepth = 3; // Maximum nesting level

  return (
    <div className="comment-item" style={{ marginLeft: depth > 0 ? '2rem' : '0' }}>
      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-author">{comment.authorName}</span>
          <span className="comment-date">
            {new Date(comment.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        <p className="comment-text">{comment.content}</p>

        <div className="comment-actions">
          <LikeButton
            likes={comment.likes || 0}
            onLike={handleLike}
            size="small"
          />
          {depth < maxDepth && (
            <button
              className="btn-link"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              Reply
            </button>
          )}
        </div>

        {showReplyForm && (
          <form onSubmit={handleReplySubmit} className="reply-form">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              rows={2}
            />
            <div className="reply-actions">
              <button
                type="button"
                className="btn btn-small"
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyContent('');
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-small"
                disabled={createReplyMutation.isPending || !replyContent.trim()}
              >
                {createReplyMutation.isPending ? 'Posting...' : 'Post Reply'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Render nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentItem;
