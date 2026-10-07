export default function Home() {
  return (
    <section className="page hero-page">
      <div className="hero-content">
        <p className="hero-greeting">Hello, I'm</p>
        <h1 className="hero-name">John Doe</h1>
        <p className="hero-title">Full Stack Web Developer</p>
        <p className="hero-subtitle">
          Passionate about building modern, responsive web applications
          using React, Node.js, and MongoDB.
        </p>
        <div className="hero-buttons">
          <a href="/projects" className="btn btn-primary">View Projects</a>
          <a href="/contact" className="btn btn-outline">Contact Me</a>
        </div>
      </div>
      <div className="hero-decoration">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>
    </section>
  )
}
