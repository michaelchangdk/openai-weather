// COMMENTED OUT FROM PACKAGE.JSON FOR BACKEND:
// "start:backend": "nodemon backend.js",
// "start:frontend": "react-scripts start",

const PORT = 8000;
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const OpenAI = require("openai-api");
require("dotenv").config();
const openai = new OpenAI(process.env.REACT_APP_OPENAI_API_KEY);
const WEATHER_API_KEY = process.env.REACT_APP_WEATHERAPP_API_KEY;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get("/", (req, res) => {
  res.json("hi");
});

// Fetch Weather
app.get("/weather", (req, res) => {
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;

  const options = {
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,daily&lang=en&units=metric&appid=${WEATHER_API_KEY}`,
  };

  axios.request(options).then((results) => {
    res.send(results.data);
  });
});

// Fetch City
app.get("/city", (req, res) => {
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;

  const options = {
    method: "GET",
    url: `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${WEATHER_API_KEY}`,
  };

  axios.request(options).then((results) => {
    res.send(results.data);
  });
});

// Fetch OpenAI Weather Description - Buggy
app.get("/aidescription", (req, res) => {
  const aiPrompt = decodeURI(req.query.aiPrompt);
  openai
    .complete({
      engine: "text-davinci-002",
      prompt: aiPrompt,
      temperature: 1,
      maxTokens: 120,
      top_p: 1,
      frequency_penalty: 2,
      presence_penalty: 1,
    })
    .then((results) => {
      res.send(results.data);
    });
});

// Fetch OpenAI Disclaimer
app.get("/aiwarning", (req, res) => {
  openai
    .complete({
      engine: "text-davinci-002",
      prompt:
        "Write a broken, dramatic, and ominous disclaimer about how a subjective AI doesn't understand weather and can't predict the future from a first-person perspective. Include legal jargon.",
      temperature: 1,
      maxTokens: 120,
      top_p: 1,
      frequency_penalty: 2,
      presence_penalty: 1,
    })
    .then((results) => {
      res.send(results.data);
    });
});

app.listen(PORT, () => console.log(`Backend is running on port ${PORT}`));
