const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const usernames = [
  "kar10arora",
  "rrrautela",
  "harshbisht",
  "kashishkhatter",
  "gaurav_yadav_12"
];

const fetchLeetCodeData = async (username) => {
  try {
    const { data } = await axios.get(`https://leetcode-stats-api.herokuapp.com/${username}`);

    return {
      username,
      profileUrl: `https://leetcode.com/u/${username}/`,
      contestRating: data.contestRating,
      worldwideRank: data.ranking,
      problemsSolved: data.totalSolved,
      easySolved: data.easySolved,
      mediumSolved: data.mediumSolved,
      hardSolved: data.hardSolved,
    };
  } catch (err) {
    console.error(`❌ Error fetching ${username}:`, err.message);
    return null;
  }
};

app.get('/api/participants', async (req, res) => {
  const results = await Promise.all(usernames.map(fetchLeetCodeData));
  res.json(results.filter(Boolean));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
