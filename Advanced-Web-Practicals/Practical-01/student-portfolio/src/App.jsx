import { useState } from 'react'
import './App.css'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  const skills = [
    { name: 'HTML5', level: 90 },
    { name: 'CSS3', level: 85 },
    { name: 'JavaScript', level: 80 },
    { name: 'React', level: 75 },
    { name: 'Node.js', level: 70 },
    { name: 'MongoDB', level: 65 },
  ]

  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce application built with React and Node.js featuring product catalog, cart, and checkout.',
      tech: ['React', 'Node.js', 'MongoDB', 'Express'],
    },
    {
      title: 'Weather Dashboard',
      description: 'Real-time weather application using OpenWeatherMap API with location search and 5-day forecast.',
      tech: ['React', 'API Integration', 'CSS3'],
    },
    {
      title: 'Task Manager Pro',
      description: 'A productivity app with drag-and-drop task management, deadlines, and team collaboration features.',
      tech: ['React', 'Firebase', 'Material UI'],
    },
  ]

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <div className="portfolio">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-brand" onClick={() => scrollToSection('hero')}>
          &lt;Dev /&gt;
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span>
        </button>
        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li onClick={() => scrollToSection('about')}>About</li>
          <li onClick={() => scrollToSection('skills')}>Skills</li>
          <li onClick={() => scrollToSection('projects')}>Projects</li>
          <li onClick={() => scrollToSection('contact')}>Contact</li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <div className="hero-content">
          <p className="hero-greeting">Hello, I'm</p>
          <h1 className="hero-name">John Doe</h1>
          <p className="hero-title">Full Stack Web Developer</p>
          <p className="hero-subtitle">
            I build modern, responsive, and user-friendly web applications
            with cutting-edge technologies.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => scrollToSection('projects')}>
              View My Work
            </button>
            <button className="btn btn-outline" onClick={() => scrollToSection('contact')}>
              Get In Touch
            </button>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
          <div className="about-image">
            <div className="image-placeholder">
              <span>👨‍💻</span>
            </div>
          </div>
          <div className="about-text">
            <p>
              I'm a passionate full-stack developer with 3+ years of experience
              in building web applications. I specialize in React, Node.js, and
              MongoDB, and I love turning complex problems into simple, beautiful
              solutions.
            </p>
            <p>
              Currently pursuing my degree in Computer Science, I am constantly
              learning and exploring new technologies. When I'm not coding, you
              can find me contributing to open-source projects or writing
              technical blog posts.
            </p>
            <div className="about-stats">
              <div className="stat">
                <span className="stat-number">15+</span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="stat">
                <span className="stat-number">3+</span>
                <span className="stat-label">Years Exp.</span>
              </div>
              <div className="stat">
                <span className="stat-number">10+</span>
                <span className="stat-label">Technologies</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills-section">
        <h2 className="section-title">My Skills</h2>
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div key={index} className="skill-card">
              <div className="skill-info">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-percent">{skill.level}%</span>
              </div>
              <div className="skill-bar">
                <div
                  className="skill-progress"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects-section">
        <h2 className="section-title">My Projects</h2>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={index} className="project-card">
              <div className="project-image">
                <span className="project-icon">🚀</span>
              </div>
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tech">
                  {project.tech.map((t, i) => (
                    <span key={i} className="tech-tag">{t}</span>
                  ))}
                </div>
                <div className="project-links">
                  <a href="#" className="project-link">Live Demo →</a>
                  <a href="#" className="project-link">Source Code →</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <h2 className="section-title">Get In Touch</h2>
        <p className="contact-subtitle">
          Feel free to reach out for collaborations or just a friendly hello!
        </p>
        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <input type="text" placeholder="Your Name" required />
          </div>
          <div className="form-group">
            <input type="email" placeholder="Your Email" required />
          </div>
          <div className="form-group">
            <textarea placeholder="Your Message" rows="5" required></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Send Message</button>
        </form>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 John Doe. All rights reserved.</p>
          <div className="social-links">
            <a href="#" className="social-link">GitHub</a>
            <a href="#" className="social-link">LinkedIn</a>
            <a href="#" className="social-link">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
