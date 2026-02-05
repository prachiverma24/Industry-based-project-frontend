import { useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { postsApi } from '../api/postsApi';
import LikeButton from '../components/LikeButton';
import Loader from '../components/Loader';

// Lazy load comments section
const CommentSection = lazy(() => import('../components/CommentSection'));

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);

  // Fetch post data
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postsApi.getPostById(id),
  });

  // Increment views mutation
  const viewsMutation = useMutation({
    mutationFn: postsApi.incrementViews,
  });

  // Increment views when component mounts
  useEffect(() => {
    if (id) {
      viewsMutation.mutate(id);
    }
  }, [id]);

  // Like mutation with optimistic update
  const likeMutation = useMutation({
    mutationFn: postsApi.likePost,
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['post', postId] });

      // Snapshot previous value
      const previousPost = queryClient.getQueryData(['post', postId]);

      // Optimistically update
      queryClient.setQueryData(['post', postId], (old) => ({
        ...old,
        likes: old.likes + 1,
      }));

      return { previousPost };
    },
    onError: (err, postId, context) => {
      // Rollback on error
      queryClient.setQueryData(['post', postId], context.previousPost);
    },
    onSettled: (data, error, postId) => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });

  const handleLike = () => {
    likeMutation.mutate(id);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Failed to load post. Please try again later.</p>
        <button className="btn" onClick={() => navigate('/feed')}>
          Back to Feed
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="error-container">
        <p>Post not found.</p>
        <button className="btn" onClick={() => navigate('/feed')}>
          Back to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="post-detail">
      <button className="btn btn-back" onClick={() => navigate('/feed')}>
        ← Back to Feed
      </button>

      <article className="post-content">
        <header className="post-header">
          <h1>{post.title}</h1>
          <div className="post-meta">
            <span className="author">By {post.authorName}</span>
            <span className="date">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="tags">
              {post.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="post-body">
          <p>{post.content}</p>
        </div>

        <footer className="post-footer">
          <div className="post-stats">
            <LikeButton likes={post.likes} onLike={handleLike} />
            <span className="stat">
              <span className="icon">👁️</span> {post.views || 0} views
            </span>
            <span className="stat">
              <span className="icon">💬</span> {post.commentsCount || 0} comments
            </span>
          </div>
        </footer>
      </article>

      {/* Lazy loaded comments section */}
      <Suspense fallback={<Loader message="Loading comments..." />}>
        <CommentSection postId={id} />
      </Suspense>
    </div>
  );
}

export default PostDetail;
