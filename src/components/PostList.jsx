import React from 'react'
import BlogPostForm from './BlogPostForm'

export default function PostList({ posts, user, onEdit, onDelete, onUpdate, editing, cancelEdit }) {
  return (
    <ul className="list-group">
      {posts.map(post => (
        <li className="list-group-item" key={post.blog_id}>
          {editing?.blog_id === post.blog_id ? (
            <div>
              <h5 className="mb-2">Editing: {post.title}</h5>
              <BlogPostForm initial={post} onSubmit={(vals) => onUpdate(post.blog_id, vals)} />
              <button className="btn btn-outline-secondary btn-sm" onClick={cancelEdit}>Cancel</button>
            </div>
          ) : (
            <div>
              <h4>{post.title}</h4>
              <p className="mb-1">{post.body}</p>
              <small className="text-muted">By <b>{post.creator_name}</b></small>

              {user && user.user_id === post.creator_user_id && (
                <div className="mt-2">
                  <button className="btn btn-warning btn-sm me-2" onClick={() => onEdit(post)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(post.blog_id)}>Delete</button>
                </div>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}