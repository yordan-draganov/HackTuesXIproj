const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { OpenAI } = require("openai");
// const mongoose = require("mongoose");
const math = require("mathjs");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const port = 5000;
const path = require("path");
const { json } = require("stream/consumers");

const RISK_FREE_RATE = 2.5;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/dist")));

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Connect to MongoDB
// mongoose
//  .connect(
//      `mongodb+srv://nn-admin:${process.env.MONGODB_PASSWORD}@cluster0.i0hvpv3.mongodb.net/investmentDB?retryWrites=true&w=majority&appName=Cluster0`
//  )
//  .then(() => console.log("Connected to MongoDB"))
//  .catch((err) => console.error("MongoDB connection error:", err));

// Define Investment Schema
// const investmentSchema = new mongoose.Schema({
//  responce: String,
//  createdAt: { type: Date, default: Date.now },
// });

// const Investment = mongoose.model("Investment", investmentSchema);

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
        const result = {
            stocks: [],
        };

        for (let i = 0; i < parseInt(numberOfCompanies); i++) {
            const stockData = await fetchStockData(
                wordsArray[i],
                parseInt(numberOfDays)
            );

            if (stockData.length === 0) continue;

            const { averageOpen, averageClose, averageHigh, averageLow } =
                averageData(stockData);
            console.log(averageOpen, averageClose, averageHigh, averageLow);

            const riskMetrics = calculateRiskReward(stockData);

            const aiResponce = await analyzeStock(
                wordsArray[i],
                averageOpen,
                averageClose,
                averageHigh,
                averageLow,
                parseInt(numberOfDays)
            );

            result.stocks.push({
                symbol: wordsArray[i],
                averageOpen: averageOpen,
                averageClose: averageClose,
                averageHigh: averageHigh,
                averageLow: averageLow,
                risk: riskMetrics,
                evaluation: aiResponce,
            });
        }

        // const newInvestment = new Investment({
        //  responce: JSON.stringify(result),
        // });
        // await newInvestment.save();

        res.json({
            result: result,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            error: "An error occurred while processing your request",
        });
    }
});

async function analyzeStock(
    symbol,
    averageOpen,
    averageClose,
    averageHigh,
    averageLow,
    days
) {
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            { role: "system", content: "You are a financial analyst." },
            {
                role: "user",
                content: `Make an evaluation on this stock ${symbol} based on the following information (all of the following is from the last ${days} days) - average opening price of the day: ${averageOpen}, average closing price of the day: ${averageClose}, average highest daily price: ${averageHigh}, average lowest daily price: ${averageLow}. Give your evaluation in ONLY 1 sentence that is less than 100 characters long. The information doesn't have to be real-time stock market appropriate.`,
            },
        ],
    });

    const aiResponce = response.choices[0].message.content;
    console.log(aiResponce);
    console.log("\n\n\n");

    return aiResponce;
}

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
                close: data["4. close"],
                high: data["2. high"],
                low: data["3. low"],
            };
        });

        return stockData;
    } catch (error) {
        throw new Error(
            "Error fetching stock data from Alpha Vantage: " + error.message
        );
    }
}

function calculateRiskReward(stockData) {
    const prices = stockData.map((day) => day.close);
    if (prices.length < 2) return null; // Not enough data

    const returns = prices.slice(1).map((p, i) => (p - prices[i]) / prices[i]);

    const avgReturn = math.mean(returns) * 252 * 100; // Annualized return (%)
    const stdDev = math.std(returns) * Math.sqrt(252) * 100; // Volatility (%)
    const sharpeRatio = (avgReturn - RISK_FREE_RATE) / stdDev; // Risk-adjusted return

    // Determine Risk Level
    let riskLevel;
    if (stdDev < 15 && sharpeRatio > 1.5) {
        riskLevel = "Low";
    } else if (stdDev >= 15 && stdDev <= 30 && sharpeRatio >= 1) {
        riskLevel = "Medium";
    } else {
        riskLevel = "High";
    }

    return riskLevel;
}

function averageData(data) {
    let totalOpen = 0;
    let totalClose = 0;
    let totalHigh = 0;
    let totalLow = 0;

    data.forEach((item) => {
        totalOpen += parseFloat(item.open);
        totalClose += parseFloat(item.close);
        totalHigh += parseFloat(item.high);
        totalLow += parseFloat(item.low);
    });

    const averageOpen = totalOpen / data.length;
    const averageClose = totalClose / data.length;
    const averageHigh = totalHigh / data.length;
    const averageLow = totalLow / data.length;

    console.log(averageOpen, averageClose, averageHigh, averageLow);

    return {
        averageOpen: averageOpen.toFixed(2),
        averageClose: averageClose.toFixed(2),
        averageHigh: averageHigh.toFixed(2),
        averageLow: averageLow.toFixed(2),
    };
}

const transporter = nodemailer.createTransport({
    service: "yahoo",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

function sendEmail(to, subject, text) {
    return new Promise(async (resolve, reject) => {
        try {
            const info = await transporter.sendMail({
                from: process.env.EMAIL,
                to,
                subject,
                text,
            });
            resolve({ message: "Email sent!", info });
        } catch (error) {
            reject({ error: error.message });
        }
    });
}

app.post("/send-email", async (req, res) => {
    const { to, subject, text } = req.body;
    try {
        const response = await sendEmail(to, subject, text);
        res.json(response);
    } catch (error) {
        res.status(500).json(error);
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});