import "../css/Investing.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Investing() {
  const [depositAmount, setDepositAmount] = useState("");
  const [profitAmount, setProfitAmount] = useState("");
  const [timeframe, setTimeframe] = useState("1"); 
  const [numberOfDays, setNumberOfDays] = useState(0); 
  const [numberOfCompanies, setNumberOfCompanies] = useState("1");
  const [showMessage, setShowMessage] = useState(false);

  const GetInputDeposit = (e) => {
    e.preventDefault();
    console.log("Deposit amount:", depositAmount);
  };

  const handleDepositChange = (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setDepositAmount(numericValue);
  };

  const GetInputProfit = (e) => {
    e.preventDefault();
    console.log("Profit amount:", profitAmount);
  };

  const handleProfitChange = (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setProfitAmount(numericValue);
  };

  const handleTimeframeChange = (e) => {
    const selectedTimeframe = e.target.value;
    setTimeframe(selectedTimeframe);

    let days;
    switch (selectedTimeframe) {
      case "1":
        days = 30;
        break;
      case "3":
        days = 90;
        break;
      case "6":
        days = 180;
        break;
      case "10":
        days = 300;
        break;
      case "12":
        days = 365;
        break;
      default:
        days = 0; 
    }
    setNumberOfDays(days);
  };

  const handleTimeframeSubmit = (e) => {
    e.preventDefault();
    console.log("Selected timeframe (months):", timeframe);
    console.log("Number of days:", numberOfDays);
  };

  const handleNumberOfCompaniesChange = (e) => {
    const selectedNumberOfCompanies = e.target.value;
    setNumberOfCompanies(selectedNumberOfCompanies);
  };

  const handleNumberOfCompaniesSubmit = (e) => {
    e.preventDefault();
    console.log("Number of companies:", numberOfCompanies);
  };

  const handleCalculateInvestment = () => {
    console.log("--- Investment Summary ---");
    console.log("Deposit amount:", depositAmount);
    console.log("Profit amount:", profitAmount);
    console.log("Selected timeframe (months):", timeframe);
    console.log("Number of days:", numberOfDays);
    console.log("Number of companies:", numberOfCompanies);

    // Show the "Hello" message
    setShowMessage(true);

    // Navigate to /investment-summary after handling the logic
  };

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
          {/* Deposit Amount Form */}
          <div className="form-group">
            <form onSubmit={GetInputDeposit}>
              <label htmlFor="deposit">Deposit Amount</label>
              <input
                type="text"
                id="deposit"
                placeholder="Enter your deposit"
                value={depositAmount}
                onChange={handleDepositChange}
              />
              <button type="submit">Submit</button>
            </form>
          </div>

          {/* Timeframe Form */}
          <div className="form-group">
            <form onSubmit={handleTimeframeSubmit}>
              <label htmlFor="timeframe">Time Frame (Months)</label>
              <select
                id="timeframe"
                value={timeframe}
                onChange={handleTimeframeChange}
              >
                <option value="1">1 Month</option>
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="10">10 Months</option>
                <option value="12">12 Months</option>
              </select>
              <button type="submit">Submit Timeframe</button>
            </form>
          </div>

          {/* Profit Form */}
          <div className="form-group">
            <form onSubmit={GetInputProfit}>
              <label htmlFor="profit">Requested Profit</label>
              <input
                type="text"
                id="profit"
                placeholder="Enter your desired profit"
                value={profitAmount}
                onChange={handleProfitChange}
              />
              <button type="submit">Submit</button>
            </form>
          </div>

          {/* Number of Companies Form */}
          <div className="form-group">
            <form onSubmit={handleNumberOfCompaniesSubmit}>
              <label htmlFor="nOfCompanies">Number of Companies</label>
              <select
                id="nOfCompanies"
                value={numberOfCompanies}
                onChange={handleNumberOfCompaniesChange}
              >
                {[...Array(10).keys()].map((i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <button type="submit">Submit</button>
            </form>
          </div>

          {/* Calculate Investment Button */}
          <div className="cta">
            <button
              className="cta-button"
              onClick={handleCalculateInvestment} // Use onClick handler
            >
              Calculate Investment
            </button>
            {/* Display "Hello" message if showMessage is true */}
            {showMessage && <p className="hello-message">Hello</p>}
          </div>
          
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to start investing?</h2>
        <p>
          Fill out the form above and take your first step towards smarter
          investing.
        </p>
        <Link to="/" className="about-link">
          Learn more about our approach <span className="arrow-icon">→</span>
        </Link>
      </div>
    </div>
  );
}

export default Investing;