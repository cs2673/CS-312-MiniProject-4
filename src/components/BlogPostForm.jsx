import React, { useState } from 'react'

export default function BlogPostForm({ onSubmit, initial }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [body, setBody] = useState(initial?.body || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ title, body })
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-2">
        <input className="form-control" placeholder="Post Title" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div className="mb-2">
        <textarea className="form-control" rows={4} placeholder="Post Content" value={body} onChange={e => setBody(e.target.value)} required />
      </div>
      <button className="btn btn-success">{initial ? 'Update' : 'Submit'}</button>
    </form>
  )
}