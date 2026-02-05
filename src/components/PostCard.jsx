import { Link } from 'react-router-dom';

function PostCard({ post }) {
  // Truncate content for preview
  const getPreview = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Link to={`/posts/${post.id}`} className="post-card">
      <div className="card-header">
        <h2 className="card-title">{post.title}</h2>
        {post.tags && post.tags.length > 0 && (
          <div className="tags">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <p className="card-content">{getPreview(post.content)}</p>

      <div className="card-footer">
        <div className="card-meta">
          <span className="author">By {post.authorName}</span>
          <span className="date">
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        <div className="card-stats">
          <span className="stat">
            <span className="icon">❤️</span> {post.likes || 0}
          </span>
          <span className="stat">
            <span className="icon">💬</span> {post.commentsCount || 0}
          </span>
          <span className="stat">
            <span className="icon">👁️</span> {post.views || 0}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
