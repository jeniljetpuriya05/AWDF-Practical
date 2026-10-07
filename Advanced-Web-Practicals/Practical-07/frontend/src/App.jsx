import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect, createContext, useContext } from 'react'
import axios from 'axios'
import './App.css'

const API = 'http://localhost:5000/api'
const AuthContext = createContext()

const useAuth = () => useContext(AuthContext)

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      setUser(parsed)
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading"><div className="spinner"></div></div>
  return user ? children : <Navigate to="/login" />
}

// Login Page
function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password })
      login(res.data.data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your account</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="btn btn-primary">Sign In</button>
        </form>
        <p className="auth-link">Don't have an account? <NavLink to="/register">Sign Up</NavLink></p>
      </div>
    </div>
  )
}

// Register Page
function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${API}/auth/register`, { name, email, password })
      login(res.data.data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join our blog community</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="btn btn-primary">Sign Up</button>
        </form>
        <p className="auth-link">Already have an account? <NavLink to="/login">Sign In</NavLink></p>
      </div>
    </div>
  )
}

// Dashboard Page
function Dashboard() {
  const [posts, setPosts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const { user, logout } = useAuth()

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API}/posts`)
      setPosts(res.data.data)
    } catch (err) { console.error(err) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingPost) {
        await axios.put(`${API}/posts/${editingPost._id}`, { title, content })
      } else {
        await axios.post(`${API}/posts`, { title, content })
      }
      setTitle(''); setContent(''); setShowForm(false); setEditingPost(null)
      fetchPosts()
    } catch (err) { console.error(err) }
  }

  const handleEdit = (post) => {
    setTitle(post.title); setContent(post.content)
    setEditingPost(post); setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this post?')) {
      await axios.delete(`${API}/posts/${id}`)
      fetchPosts()
    }
  }

  return (
    <div className="dashboard">
      <nav className="dash-nav">
        <h1 className="brand">📝 BlogSpace</h1>
        <div className="nav-right">
          <span className="user-name">Hi, {user.name}</span>
          <button className="btn btn-outline btn-sm" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="dash-content">
        <div className="dash-header">
          <h2>All Posts</h2>
          <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditingPost(null); setTitle(''); setContent('') }}>
            + New Post
          </button>
        </div>

        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>{editingPost ? 'Edit Post' : 'New Post'}</h2>
              <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Post title" value={title} onChange={e => setTitle(e.target.value)} required />
                <textarea placeholder="Write your post..." rows="8" value={content} onChange={e => setContent(e.target.value)} required></textarea>
                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{editingPost ? 'Update' : 'Publish'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="posts-grid">
          {posts.length === 0 ? (
            <div className="empty">
              <p>No posts yet. Be the first to write something!</p>
            </div>
          ) : posts.map(post => (
            <article key={post._id} className="post-card">
              <h3>{post.title}</h3>
              <p className="post-content">{post.content}</p>
              <div className="post-meta">
                <span className="post-author">By {post.author?.name || 'Unknown'}</span>
                <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              {post.author?._id === user._id && (
                <div className="post-actions">
                  <button onClick={() => handleEdit(post)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(post._id)}>🗑️ Delete</button>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
