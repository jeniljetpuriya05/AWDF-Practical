import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get('https://jsonplaceholder.typicode.com/users')
      setUsers(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch users. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserDetails = async (userId) => {
    try {
      const [userRes, postsRes, todosRes] = await Promise.all([
        axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`),
        axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`),
        axios.get(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`),
      ])
      setSelectedUser({
        ...userRes.data,
        posts: postsRes.data,
        todos: todosRes.data,
      })
    } catch (err) {
      setError('Failed to fetch user details.')
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="app">
      <header className="header">
        <h1 className="app-title">👥 User Explorer</h1>
        <p className="app-subtitle">React API Integration with JSONPlaceholder</p>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="content-layout">
        {/* Users List */}
        <div className="users-panel">
          <h2 className="panel-title">Users ({filteredUsers.length})</h2>
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : (
            <div className="users-list">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  className={`user-card ${selectedUser?.id === user.id ? 'active' : ''}`}
                  onClick={() => fetchUserDetails(user.id)}
                >
                  <div className="user-avatar">
                    {user.name.charAt(0)}
                  </div>
                  <div className="user-brief">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                    <span className="user-company">{user.company.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Details */}
        <div className="details-panel">
          {selectedUser ? (
            <div className="user-details">
              <div className="details-header">
                <div className="details-avatar">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h2>{selectedUser.name}</h2>
                  <p className="username">@{selectedUser.username}</p>
                </div>
              </div>

              <div className="details-grid">
                <div className="detail-card">
                  <span className="detail-icon">📧</span>
                  <div>
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{selectedUser.email}</span>
                  </div>
                </div>
                <div className="detail-card">
                  <span className="detail-icon">📞</span>
                  <div>
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{selectedUser.phone}</span>
                  </div>
                </div>
                <div className="detail-card">
                  <span className="detail-icon">🌐</span>
                  <div>
                    <span className="detail-label">Website</span>
                    <span className="detail-value">{selectedUser.website}</span>
                  </div>
                </div>
                <div className="detail-card">
                  <span className="detail-icon">🏢</span>
                  <div>
                    <span className="detail-label">Company</span>
                    <span className="detail-value">{selectedUser.company.name}</span>
                  </div>
                </div>
                <div className="detail-card">
                  <span className="detail-icon">📍</span>
                  <div>
                    <span className="detail-label">Address</span>
                    <span className="detail-value">{selectedUser.address.street}, {selectedUser.address.city}</span>
                  </div>
                </div>
              </div>

              {/* Posts */}
              <div className="section">
                <h3 className="section-label">📝 Recent Posts ({selectedUser.posts.length})</h3>
                <div className="posts-list">
                  {selectedUser.posts.slice(0, 5).map(post => (
                    <div key={post.id} className="post-card">
                      <h4>{post.title}</h4>
                      <p>{post.body.substring(0, 100)}...</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Todos */}
              <div className="section">
                <h3 className="section-label">
                  ✅ Todos ({selectedUser.todos.filter(t => t.completed).length}/{selectedUser.todos.length} completed)
                </h3>
                <div className="todos-list">
                  {selectedUser.todos.slice(0, 8).map(todo => (
                    <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                      <span className="todo-check">{todo.completed ? '✅' : '⬜'}</span>
                      <span>{todo.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <span className="no-selection-icon">👈</span>
              <p>Select a user to view their details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
