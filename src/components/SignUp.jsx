import React, { useState } from 'react'
import { signup } from '../api'
import { useNavigate } from 'react-router-dom'

export default function SignUp() {
  const [user_id, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      await signup({ user_id, password, name })
      navigate('/signin')
    } catch (e) {
      setError('User ID already taken')
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-6">
        {error && <div className="alert alert-danger text-center">{error}</div>}
        <form onSubmit={submit} className="text-center">
          <div className="mb-3">
            <input className="form-control" placeholder="User ID" value={user_id} onChange={e=>setUserId(e.target.value)} required />
          </div>
          <div className="mb-3">
            <input type="password" className="form-control" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <div className="mb-3">
            <input className="form-control" placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} required />
          </div>
          <button className="btn btn-success">Sign Up</button>
        </form>
      </div>
    </div>
  )
}