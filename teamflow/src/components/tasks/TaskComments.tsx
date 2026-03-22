import React, { useState } from 'react';
import './TaskComments.css';
import Avatar from '../common/Avatar';
import { formatDate } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';

interface CommentAuthor {
  id?: string;
  name?: string;
  avatarUrl?: string | null;
}

interface Comment {
  id?: string;
  author?: CommentAuthor | null;
  text: string;
  createdAt?: string;
}

interface TaskCommentsProps {
  taskId: string;
  comments: Comment[];
}

export default function TaskComments({ taskId, comments }: TaskCommentsProps) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    // TODO: wire up to API
    console.log('Submitting comment for task:', taskId, newComment);
    setNewComment('');
    setSubmitting(false);
  };

  return (
    <div className="task-comments">
      <h3 className="task-comments__title">
        Comments ({comments.length})
      </h3>

      <div className="task-comments__list">
        {comments.length === 0 ? (
          <p className="task-comments__empty">No comments yet</p>
        ) : (
          comments.map((comment, idx) => (
            <div key={comment.id || idx} className="task-comments__item">
              <Avatar user={comment.author} size="sm" />
              <div className="task-comments__content">
                <div className="task-comments__meta">
                  <span className="task-comments__author">
                    {comment.author?.name || 'Unknown'}
                  </span>
                  <span className="task-comments__time">
                    {comment.createdAt ? formatDate(comment.createdAt, 'relative') : ''}
                  </span>
                </div>
                <p className="task-comments__text">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {user && (
        <form className="task-comments__form" onSubmit={handleSubmit}>
          <Avatar user={user} size="sm" />
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="task-comments__input"
          />
          <button type="submit" className="task-comments__submit" disabled={!newComment.trim()}>
            Post
          </button>
        </form>
      )}
    </div>
  );
}
