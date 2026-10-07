export default function About() {
  return (
    <section className="page about-page">
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
  )
}
