import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { postsApi } from '../api/postsApi';

function NewPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

  const titleInputRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Autofocus title input on mount
  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: postsApi.createPost,
    onSuccess: () => {
      navigate('/feed');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to create post. Please try again.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    // Parse tags
    const tagArray = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    // Create post
    createPostMutation.mutate({
      title: title.trim(),
      content: content.trim(),
      tags: tagArray,
      authorId: user.id,
      authorName: user.name,
    });
  };

  return (
    <div className="new-post">
      <div className="new-post-header">
        <h1>Create New Post</h1>
        <button className="btn" onClick={() => navigate('/feed')}>
          Cancel
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            ref={titleInputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            maxLength={200}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content here..."
            rows={12}
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma separated)</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., javascript, react, web-development"
          />
          <small>Separate tags with commas</small>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn"
            onClick={() => navigate('/feed')}
            disabled={createPostMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={createPostMutation.isPending}
          >
            {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewPost;
