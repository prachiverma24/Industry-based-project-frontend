import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { postsApi } from '../api/postsApi';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';

function Feed() {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: postsApi.getPosts,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Failed to load posts. Please try again later.</p>
        <p className="error-details">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="feed">
      <div className="feed-header">
        <h1>Community Forum</h1>
        <Link to="/new" className="btn btn-primary">
          Create Post
        </Link>
      </div>

      <div className="posts-grid">
        {posts && posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="empty-state">
            <p>No posts yet. Be the first to create one!</p>
            <Link to="/new" className="btn btn-primary">
              Create Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;
