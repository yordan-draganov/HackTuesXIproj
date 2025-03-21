const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { OpenAI } = require("openai");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = 5000;
const path = require("path");
const { json } = require("stream/consumers");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// API Keys from .env
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Connect to MongoDB
mongoose
	.connect(
		`mongodb+srv://nn-admin:${process.env.MONGODB_PASSWORD}@cluster0.i0hvpv3.mongodb.net/investmentDB?retryWrites=true&w=majority&appName=Cluster0`
	)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("MongoDB connection error:", err));

// Define Investment Schema
const investmentSchema = new mongoose.Schema({
	responce: String,
	createdAt: { type: Date, default: Date.now },
});

const Investment = mongoose.model("Investment", investmentSchema);

// Initialize OpenAI
const openai = new OpenAI({
	apiKey: OPENAI_API_KEY,
});

// API Routes
app.get("/api/word", (req, res) => {
	res.json({ word: "boop" });
});

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Route to handle user input, suggest a stock, fetch data, and analyze it
app.post("/api/prompt", async (req, res) => {
	console.log(req);
	const { depositAmount, numberOfDays, numberOfCompanies, profitAmount } =
		req.body;

	console.log(
		"Received data:",
		depositAmount,
		numberOfDays,
		numberOfCompanies,
		profitAmount
	);

	try {
		const stocksSuggestion = await suggestStockMarket(
			depositAmount,
			numberOfDays,
			numberOfCompanies,
			profitAmount
		);
		console.log("Suggested Stock:", stocksSuggestion);

		const wordsArray = stocksSuggestion.split(", ");
		const result = [];

		for (let i = 0; i < parseInt(numberOfCompanies); i++) {
			const stockData = await fetchStockData(
				wordsArray[i],
				parseInt(numberOfDays)
			);
			result.push(stockData);
		}

		// const analysis = await analyzeStockData(stockData);

		const newInvestment = new Investment({
			responce: JSON.stringify(result),
		});
		await newInvestment.save();

		res.json({
			result: JSON.stringify(result),
			// stockAnalysis: analysis,
		});
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({
			error: "An error occurred while processing your request",
		});
	}
});

// Function to suggest a stock market based on user input
async function suggestStockMarket(
	depositAmount,
	numberOfDays,
	numberOfCompanies,
	profitAmount
) {
	try {
		const response = await openai.chat.completions.create({
			model: "gpt-4",
			messages: [
				{
					role: "system",
					content:
						"You are a financial advisor suggesting stock markets based on investment preferences.",
				},
				{
					role: "user",
					content: `I have ${depositAmount}$ to invest for ${numberOfDays} days aiming for a profit goal of ${profitAmount}$. Return ONLY the stock market symbols, seperated by commas, for the best ${numberOfCompanies} assets that for my specifications. No extra information or text, just the symbols seperated by commas. The information doesn't have to be real-time stock market appropriate.`,
				},
			],
		});

		return response.choices[0].message.content.trim(); // The suggested stock symbol
	} catch (error) {
		throw new Error("Error suggesting a stock market: " + error.message);
	}
}

// Function to fetch stock data from Alpha Vantage
async function fetchStockData(symbol, days) {
	try {
		const response = await axios.get("https://www.alphavantage.co/query", {
			params: {
				function: "TIME_SERIES_DAILY",
				symbol: symbol,
				apikey: ALPHA_VANTAGE_API_KEY,
			},
		});

		const timeSeries = response.data["Time Series (Daily)"];
		const lastNDays = Object.keys(timeSeries).slice(0, days);

		const stockData = lastNDays.map((day) => {
			const data = timeSeries[day];
			return {
				date: day,
				open: data["1. open"],
				high: data["2. high"],
				low: data["3. low"],
				close: data["4. close"],
				volume: data["5. volume"],
			};
		});

		return stockData;
	} catch (error) {
		throw new Error(
			"Error fetching stock data from Alpha Vantage: " + error.message
		);
	}
}

// Function to analyze stock data with OpenAI
// async function analyzeStockData(stockData) {
//   try {
//     const stockText = stockData
//       .map(day => {
//         return `Date: ${day.date}, Open: ${day.open}, High: ${day.high}, Low: ${day.low}, Close: ${day.close}, Volume: ${day.volume}`;
//       })
//       .join("\n");

//     const response = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [
//         { role: "system", content: "You are a financial analyst." },
//         { role: "user", content: `Analyze the following stock data for trends and insights:\n\n${stockText}` },
//       ],
//     });

//     return response.choices[0].message.content;
//   } catch (error) {
//     throw new Error("Error analyzing stock data with OpenAI: " + error.message);
//   }
// }

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
