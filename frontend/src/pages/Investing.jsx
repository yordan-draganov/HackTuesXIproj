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
  const [stocksData, setStocksData] = useState(null); // Changed to store parsed object
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [touchedFields, setTouchedFields] = useState({ deposit: false, profit: false });

  // Handle deposit input change and restrict to numbers only
  const handleDepositChange = (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setDepositAmount(numericValue);
    setTouchedFields({ ...touchedFields, deposit: true });
    
    // Clear error message when user types
    if (numericValue && errorMessage) {
      setErrorMessage("");
    }
  };

  // Handle profit input change and restrict to numbers only
  const handleProfitChange = (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setProfitAmount(numericValue);
    setTouchedFields({ ...touchedFields, profit: true });
    
    // Clear error message when user types
    if (numericValue && errorMessage) {
      setErrorMessage("");
    }
  };

  // Handle timeframe change and calculate the number of days
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

  // Handle number of companies change
  const handleNumberOfCompaniesChange = (e) => {
    const selectedNumberOfCompanies = e.target.value;
    setNumberOfCompanies(selectedNumberOfCompanies);
  };

  // Validate form fields and return error message if invalid
  const validateForm = () => {
    // Check if both deposit and profit fields are empty
    if (!depositAmount && !profitAmount) {
      return "Please fill out both the deposit amount and profit amount fields.";
    }
    // Check if deposit field is empty
    else if (!depositAmount) {
      return "Please enter a deposit amount.";
    }
    // Check if profit field is empty
    else if (!profitAmount) {
      return "Please enter your desired profit amount.";
    }
    
    return ""; // No errors
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");

    // Mark both fields as touched when submitting
    setTouchedFields({ deposit: true, profit: true });
    
    // Validate the form
    const error = validateForm();
    if (error) {
      console.log("Validation failed: " + error);
      setErrorMessage(error);
      return; // Stop the function if validation fails
    }

    // Clear any previous error messages
    setErrorMessage("");

    setIsLoading(true); // Start loading
    setShowMessage(false); // Hide previous result

    // Prepare the payload
    const payload = {
      depositAmount,
      numberOfDays,
      numberOfCompanies,
      profitAmount,
    };

    console.log("Making API call with payload:", payload);

    // Make the API call
    fetch("http://localhost:5000/api/prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data);
        
        // Check if result is a string that needs parsing
        if (data.result && typeof data.result === 'string') {
          try {
            setStocksData(JSON.parse(data.result)); // Parse JSON string
          } catch (error) {
            console.error("Error parsing JSON:", error);
            setStocksData(data.result); // If it fails, use as is
          }
        } else {
          // If result is already an object
          setStocksData(data.result || data);
        }
        
        setShowMessage(true); // Show the result message
      })
      .catch((error) => {
        console.error("Error processing data:", error);
        setErrorMessage("An error occurred while processing your request."); // Handle errors
        setShowMessage(false);
      })
      .finally(() => {
        setIsLoading(false); // Stop loading
      });
  };

  // Determine if a field is invalid (empty and touched)
  const isFieldInvalid = (field, value) => {
    return touchedFields[field] && !value;
  };

  // Function to render stock results
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
      {/* Loading Overlay */}
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
          {/* Deposit Amount Input */}
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

          {/* Timeframe Dropdown */}
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

          {/* Profit Amount Input */}
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

          {/* Number of Companies Dropdown */}
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

          {/* Main Error Message */}
          {errorMessage && (
            <div className="error-message">
              <p>{errorMessage}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="cta">
            <button
              type="submit"
              className="cta-button"
              disabled={isLoading}
            >
              {isLoading ? "Calculating..." : "Calculate Investment"}
            </button>
          </div>

          {/* Display the stock results in a formatted way */}
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