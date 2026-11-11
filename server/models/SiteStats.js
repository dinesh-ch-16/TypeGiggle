const mongoose = require('mongoose');

const siteStatsSchema = new mongoose.Schema({
  totalTestsStarted: { type: Number, default: 0 },
  totalTestsCompleted: { type: Number, default: 0 },
  totalSecondsTyped: { type: Number, default: 0 },
  wpmDistribution: { type: [Number], default: Array(30).fill(0) }
});

module.exports = mongoose.model('SiteStats', siteStatsSchema);