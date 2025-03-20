import "../css/Investing.css";
import { Link } from "react-router-dom";

function Investing() {
  return (
    <div className="investing-container">
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Plan Your Investment</h1>
          <p className="hero-subtitle">
            Let's create a tailored investment strategy for your future.
          </p>
        </div>
      </div>

      <div className="investment-form-section">
        <h2 className="section-title">Investment Details</h2>
        <div className="investment-form">
          <div className="form-group">
            <label htmlFor="deposit">Deposit Amount</label>
            <input type="number" id="deposit" placeholder="Enter your deposit" />
          </div>

          <div className="form-group">
            <label htmlFor="timeframe">Time Frame (Months)</label>
            <select id="timeframe">
              <option value="1">1 Month</option>
              <option value="3">3 Months</option>
              <option value="6">6 Months</option>
              <option value="10">10 Months</option>
              <option value="12">12 Months</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="profit">Expected Profit (%)</label>
            <input type="number" id="profit" placeholder="Expected profit percentage" />
          </div>

          <div className="form-group">
            <label htmlFor="companies">Number of Companies</label>
            <select id="companies">
              {[...Array(10).keys()].map(i => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="cta">
            <Link to="/investment-summary" className="cta-button">
              Calculate Investment
            </Link>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to start investing?</h2>
        <p>Fill out the form above and take your first step towards smarter investing.</p>
        <Link to="/about" className="about-link">
          Learn more about our approach <span className="arrow-icon">→</span>
        </Link>
      </div>
    </div>
  );
}

export default Investing;