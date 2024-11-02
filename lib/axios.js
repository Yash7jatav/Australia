const axios = require("axios");
require("dotenv").config();

const axiosInstance = axios.create({
  baseURL: "https://api.unsplash.com",
  headers: {
    "Content-Type": "application/json",
    CLIENT_ID: process.env.UNSPLASH_ACCESS_KEY,
    CLIENT_SECRET: process.env.UNSPLASH_SECRET_KEY,
  },
});

module.exports = axiosInstance;
