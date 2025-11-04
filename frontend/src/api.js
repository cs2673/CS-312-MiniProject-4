import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

export async function fetchBlogs() {
  const { data } = await api.get('/blogs')
  return data
}

export async function createBlog(payload) {
  const { data } = await api.post('/blogs', payload)
  return data
}

export async function updateBlog(id, payload) {
  const { data } = await api.put(`/blogs/${id}`, payload)
  return data
}

export async function deleteBlog(id) {
  const { data } = await api.delete(`/blogs/${id}`)
  return data
}

export async function getSession() {
  const { data } = await api.get('/session')
  return data.user
}

export async function signin(user_id, password) {
  const { data } = await api.post('/signin', { user_id, password })
  return data.user
}

export async function signup(user) {
  const { data } = await api.post('/signup', user)
  return data
}

export async function logout() {
  await api.post('/logout')
}
