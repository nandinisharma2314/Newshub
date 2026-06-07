const express = require("express");
const cors = require("cors");
require("dotenv").config();

const newsRoutes = require("./routes/news");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/news", newsRoutes);

app.get("/", (req, res) => {
  res.send("News API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});