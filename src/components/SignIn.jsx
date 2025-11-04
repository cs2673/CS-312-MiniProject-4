import React, { useState } from 'react'
import { signin } from '../api'
import { useNavigate } from 'react-router-dom'

export default function SignIn({ onSignedIn }) {
  const [user_id, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const user = await signin(user_id, password)
      onSignedIn(user)
      navigate('/')
    } catch (e) {
      setError('Invalid user_id or password')
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
          <button className="btn btn-primary">Sign In</button>
        </form>
      </div>
    </div>
  )
}