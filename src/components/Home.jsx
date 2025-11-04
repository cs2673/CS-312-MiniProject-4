import React, { useEffect, useState } from 'react'
import { fetchBlogs, createBlog, updateBlog, deleteBlog } from '../api'
import BlogPostForm from './BlogPostForm'
import PostList from './PostList'

export default function Home({ user }) {
  const [posts, setPosts] = useState([])
  const [editing, setEditing] = useState(null)

  const load = async () => setPosts(await fetchBlogs())
  useEffect(() => { load() }, [])

  const onCreate = async (values) => {
    const created = await createBlog(values)
    setPosts(p => [created, ...p])
  }

  const onUpdate = async (id, values) => {
    const updated = await updateBlog(id, values)
    setPosts(p => p.map(x => x.blog_id === id ? updated : x))
    setEditing(null)
  }

  const onDelete = async (id) => {
    await deleteBlog(id)
    setPosts(p => p.filter(x => x.blog_id !== id))
  }

  return (
    <>
      {user && !editing && (
        <BlogPostForm onSubmit={onCreate} />
      )}
      <PostList
        posts={posts}
        user={user}
        onEdit={setEditing}
        onDelete={onDelete}
        onUpdate={onUpdate}
        cancelEdit={() => setEditing(null)}
        editing={editing}
      />
    </>
  )
}