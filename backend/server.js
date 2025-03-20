const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000;
const path = require("path");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// API Routes
app.get("/api/word", (req, res) => {
	res.json({ word: "boop" });
});

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.post("/api/prompt", async (req, res) => {
	const { moneyToInvest, numberOfDays, numberOfAssests, profitGoal } =
		req.body;

	console.log(
		"Received data:",
		moneyToInvest,
		numberOfDays,
		numberOfAssests,
		profitGoal
	);

	// const result = `uno:${moneyToInvest}   dos:${numberOfDays}      tres:${numberOfAssests}     quatro:${profitGoal}`;
	res.json({ result });
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
