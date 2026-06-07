const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const {
      category = "general",
      page = 1,
      pageSize = 5,
    } = req.query;

    const url =
      `https://gnews.io/api/v4/top-headlines` +
      `?category=${category}` +
      `&lang=en` +
      `&country=in` +
      `&max=${pageSize}` +
      `&page=${page}` +
      `&apikey=${process.env.GNEWS_API_KEY}`;

    const response = await axios.get(url);

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch news",
    });
  }
});

module.exports = router;