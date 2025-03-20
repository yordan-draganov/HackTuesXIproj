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
app.get("/api/message", (req, res) => {
	res.json({ word: "boop" });
});

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
