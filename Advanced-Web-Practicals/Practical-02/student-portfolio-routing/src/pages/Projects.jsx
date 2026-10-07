export default function Projects() {
  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce application with product catalog, cart, and checkout.',
      tech: ['React', 'Node.js', 'MongoDB', 'Express'],
    },
    {
      title: 'Weather Dashboard',
      description: 'Real-time weather application using OpenWeatherMap API with 5-day forecast.',
      tech: ['React', 'API Integration', 'CSS3'],
    },
    {
      title: 'Task Manager Pro',
      description: 'Productivity app with drag-and-drop task management and team collaboration.',
      tech: ['React', 'Firebase', 'Material UI'],
    },
    {
      title: 'Blog Platform',
      description: 'Full-stack blogging platform with markdown editor and user authentication.',
      tech: ['React', 'Node.js', 'JWT', 'MongoDB'],
    },
  ]

  return (
    <section className="page projects-page">
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
  )
}
