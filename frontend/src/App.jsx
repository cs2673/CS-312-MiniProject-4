import React, { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { getSession, logout } from './api'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Home from './components/Home'

export default function App() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getSession().then(setUser)
  }, [])

  const onLogout = async () => {
    await logout()
    setUser(null)
    navigate('/')
  }

  return (
    <div className="container py-3">
      <header className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">CS312 Blog</h3>
        <div>
          {user ? (
            <>
              <span className="me-2">Welcome, <b>{user.name}</b></span>
              <button className="btn btn-outline-secondary btn-sm" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn btn-primary btn-sm me-2" to="/signin">Sign In</Link>
              <Link className="btn btn-secondary btn-sm" to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/signin" element={<SignIn onSignedIn={setUser} />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  )
}
