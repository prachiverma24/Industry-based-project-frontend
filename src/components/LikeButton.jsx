function LikeButton({ likes, onLike, size = 'medium' }) {
  return (
    <button
      className={`like-button ${size}`}
      onClick={onLike}
      title="Like"
    >
      <span className="like-icon">❤️</span>
      <span className="like-count">{likes}</span>
    </button>
  );
}

export default LikeButton;
