import "../css/Home.css";
import { Link } from "react-router-dom";
import React from "react"

function Home() {
  return (
    <div className="home-container">
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Invest Smarter, Grow Faster</h1>
          <p className="hero-subtitle">
            Your journey to financial freedom starts with one smart decision.
          </p>
          <div className="hero-cta">
            <Link to="/signup" className="cta-button">
              Get Started <span className="arrow-icon">→</span>
            </Link>
            <Link to="/demo" className="secondary-button">
              Watch Demo
            </Link>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Why we are better</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon trending-icon">📈</div>
            <h3>Market Insights</h3>
            <p>Advanced research and proffesional advice that is the best on the market.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon security-icon">🔒</div>
            <h3>Secure Investing</h3>
            <p>Getting info from proffesionals meaning that you are always safe.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon expert-icon">🏆</div>
            <h3>Expert Guidance</h3>
            <p>Experts, what else do we need to say.</p>
          </div>
        </div>
      </div>

      <div className="testimonials-section">
        <h2 className="section-title">What do people think</h2>
        <div className="testimonial-card">
          <p className="testimonial-text">
            "This platform made me able to invest even with little to no prior knowledge in the sector."
          </p>
          <p className="testimonial-author">- Momchil Vladimirov HackTues volunteer, Client Since 2025</p>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to grow your wealth?</h2>
        <p>Join thousands of investors who have already started their journey.</p>
        <Link to="/about" className="about-link">
          Learn more about our approach <span className="arrow-icon">→</span>
        </Link>
      </div>
    </div>
  );
}

export default Home;