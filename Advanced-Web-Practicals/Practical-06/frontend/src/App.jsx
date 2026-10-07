import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = 'http://localhost:5000/api/notes'

function App() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [formData, setFormData] = useState({
    title: '', content: '', category: 'personal', color: '#6c63ff'
  })

  const categories = ['personal', 'work', 'study', 'other']
  const colors = ['#6c63ff', '#ff6584', '#43e97b', '#f7971e', '#e44d26', '#00b4d8']

  useEffect(() => { fetchNotes() }, [activeCategory, searchTerm])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      const params = {}
      if (activeCategory) params.category = activeCategory
      if (searchTerm) params.search = searchTerm
      const res = await axios.get(API_URL, { params })
      setNotes(res.data.data)
    } catch (err) {
      console.error('Failed to fetch notes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingNote) {
        await axios.put(`${API_URL}/${editingNote._id}`, formData)
      } else {
        await axios.post(API_URL, formData)
      }
      setFormData({ title: '', content: '', category: 'personal', color: '#6c63ff' })
      setShowForm(false)
      setEditingNote(null)
      fetchNotes()
    } catch (err) {
      console.error('Failed to save note:', err)
    }
  }

  const handleEdit = (note) => {
    setFormData({ title: note.title, content: note.content, category: note.category, color: note.color })
    setEditingNote(note)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this note?')) {
      await axios.delete(`${API_URL}/${id}`)
      fetchNotes()
    }
  }

  const handlePin = async (id) => {
    await axios.patch(`${API_URL}/${id}/pin`)
    fetchNotes()
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="app-title">📝 Notes App</h1>
        <p className="app-subtitle">Full-Stack MERN Application</p>
      </header>

      <div className="toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditingNote(null); setFormData({ title: '', content: '', category: 'personal', color: '#6c63ff' }) }}>
          + New Note
        </button>
      </div>

      <div className="categories">
        <button
          className={`cat-btn ${activeCategory === '' ? 'active' : ''}`}
          onClick={() => setActiveCategory('')}
        >All</button>
        {categories.map(cat => (
          <button
            key={cat}
            className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >{cat}</button>
        ))}
      </div>

      {/* Note Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingNote ? 'Edit Note' : 'New Note'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Note title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Note content..."
                rows="5"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              ></textarea>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="color-picker">
                {colors.map(color => (
                  <div
                    key={color}
                    className={`color-dot ${formData.color === color ? 'active' : ''}`}
                    style={{ background: color }}
                    onClick={() => setFormData({ ...formData, color })}
                  ></div>
                ))}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingNote ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      {loading ? (
        <div className="loading"><div className="spinner"></div><p>Loading notes...</p></div>
      ) : notes.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <p>No notes yet. Create your first note!</p>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map(note => (
            <div key={note._id} className="note-card" style={{ borderTopColor: note.color }}>
              {note.isPinned && <span className="pin-badge">📌</span>}
              <div className="note-header">
                <h3>{note.title}</h3>
                <span className="note-category">{note.category}</span>
              </div>
              <p className="note-content">{note.content}</p>
              <div className="note-footer">
                <span className="note-date">{new Date(note.updatedAt).toLocaleDateString()}</span>
                <div className="note-actions">
                  <button onClick={() => handlePin(note._id)} title="Pin">📌</button>
                  <button onClick={() => handleEdit(note)} title="Edit">✏️</button>
                  <button onClick={() => handleDelete(note._id)} title="Delete">🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
