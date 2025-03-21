import "../css/Investing.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Investing() {
  const [depositAmount, setDepositAmount] = useState("");
  const [profitAmount, setProfitAmount] = useState("");
  const [timeframe, setTimeframe] = useState("1");
  const [numberOfDays, setNumberOfDays] = useState(30);
  const [numberOfCompanies, setNumberOfCompanies] = useState("1");
  const [showMessage, setShowMessage] = useState(false);
  const [stocksData, setStocksData] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [touchedFields, setTouchedFields] = useState({ deposit: false, profit: false });

  const handleDepositChange = (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setDepositAmount(numericValue);
    setTouchedFields({ ...touchedFields, deposit: true });
    
    if (numericValue && errorMessage) {
      setErrorMessage("");
    }
  };

  const handleProfitChange = (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setProfitAmount(numericValue);
    setTouchedFields({ ...touchedFields, profit: true });
    
    if (numericValue && errorMessage) {
      setErrorMessage("");
    }
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

  const handleNumberOfCompaniesChange = (e) => {
    const selectedNumberOfCompanies = e.target.value;
    setNumberOfCompanies(selectedNumberOfCompanies);
  };

  const validateForm = () => {
    if (!depositAmount && !profitAmount) {
      return "Please fill out both the deposit amount and profit amount fields.";
    }
    else if (!depositAmount) {
      return "Please enter a deposit amount.";
    }
    else if (!profitAmount) {
      return "Please enter your desired profit amount.";
    }
    
    return ""; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
  
    setTouchedFields({ deposit: true, profit: true });
  
    const error = validateForm();
    if (error) {
      console.log("Validation failed: " + error);
      setErrorMessage(error);
      return;
    }
  
    setErrorMessage("");
    setIsLoading(true);
    setShowMessage(false);
  
    const emailData = {
      to: "ralchev.nikola@gmail.com",
      subject: "Hello from Express",
      text: "This is a test email.",
    };
  
    try {
      const emailResponse = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });
      const emailResult = await emailResponse.json();
      console.log("Email Response:", emailResult);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  
    const payload = {
      depositAmount,
      numberOfDays,
      numberOfCompanies,
      profitAmount,
    };
  
    console.log("Making API call with payload:", payload);
  
    fetch("http://localhost:5000/api/prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data);
  
        if (data.result && typeof data.result === "string") {
          try {
            setStocksData(JSON.parse(data.result));
          } catch (error) {
            console.error("Error parsing JSON:", error);
            setStocksData(data.result);
          }
        } else {
          setStocksData(data.result || data);
        }
  
        setShowMessage(true);
      })
      .catch((error) => {
        console.error("Error processing data:", error);
        setErrorMessage("An error occurred while processing your request.");
        setShowMessage(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  

  const isFieldInvalid = (field, value) => {
    return touchedFields[field] && !value;
  };

  const renderStockResults = () => {
    if (!stocksData || !stocksData.stocks || stocksData.stocks.length === 0) {
      return <p>No stock data available.</p>;
    }

    return (
      <div className="stocks-results">
        <h3>Recommended Stocks</h3>
        <div className="stocks-grid">
          {stocksData.stocks.map((stock, index) => (
            <div key={index} className="stock-card">
              <h4 className="stock-symbol">{stock.symbol}</h4>
              <div className="stock-detail">
                <span className="detail-label">Average Open:</span> 
                <span className="detail-value">${stock.averageOpen}</span>
              </div>
              <div className="stock-detail">
                <span className="detail-label">Risk Level:</span> 
                <span className={`detail-value risk-${stock.risk.toLowerCase()}`}>{stock.risk}</span>
              </div>
              <div className="stock-evaluation">
                <p>{stock.evaluation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="investing-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

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
        <form className="investment-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="deposit">Deposit Amount <span className="required">*</span></label>
            <input
              type="text"
              id="deposit"
              placeholder="Enter your deposit"
              value={depositAmount}
              onChange={handleDepositChange}
              className={isFieldInvalid("deposit", depositAmount) ? "invalid-input" : ""}
              required
              disabled={isLoading}
            />
            {isFieldInvalid("deposit", depositAmount) && (
              <p className="field-error-message">Deposit amount is required</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="timeframe">Time Frame (Months)</label>
            <select
              id="timeframe"
              value={timeframe}
              onChange={handleTimeframeChange}
              required
              disabled={isLoading}
            >
              <option value="1">1 Month</option>
              <option value="3">3 Months</option>
              <option value="6">6 Months</option>
              <option value="10">10 Months</option>
              <option value="12">12 Months</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="profit">Requested Profit <span className="required">*</span></label>
            <input
              type="text"
              id="profit"
              placeholder="Enter your desired profit"
              value={profitAmount}
              onChange={handleProfitChange}
              className={isFieldInvalid("profit", profitAmount) ? "invalid-input" : ""}
              required
              disabled={isLoading}
            />
            {isFieldInvalid("profit", profitAmount) && (
              <p className="field-error-message">Profit amount is required</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="nOfCompanies">Number of Companies</label>
            <select
              id="nOfCompanies"
              value={numberOfCompanies}
              onChange={handleNumberOfCompaniesChange}
              required
              disabled={isLoading}
            >
              {[...Array(4).keys()].map((i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          {errorMessage && (
            <div className="error-message">
              <p>{errorMessage}</p>
            </div>
          )}

          <div className="cta">
            <button
              type="submit"
              className="cta-button"
              disabled={isLoading}
            >
              {isLoading ? "Calculating..." : "Calculate Investment"}
            </button>
          </div>

          {showMessage && (
            <div className="result-box">
              {renderStockResults()}
            </div>
          )}
        </form>
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