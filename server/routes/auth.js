const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Resend } = require('resend');
const User = require('../models/User');
const SiteStats = require('../models/SiteStats');

const resend = new Resend(process.env.RESEND_API_KEY);

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    let user = await User.findOne({ email });
    if (user && user.isVerified) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    if (user && !user.isVerified) {
      user.username = username;
      user.password = hashedPassword;
      user.verificationCode = code;
      await user.save();
    } else {
      user = new User({ 
        username, 
        email, 
        password: hashedPassword, 
        verificationCode: code,
        isVerified: false 
      });
      await user.save();
    }

    try {
      await resend.emails.send({
        from: 'TypeGiggle <noreply@typegiggle.com>', // UPDATED
        to: email,
        subject: 'Verify your TypeGiggle Account',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: white; border-radius: 10px; max-width: 500px; margin: auto;">
            <h2 style="color: #8b5cf6; text-align: center;">Welcome to TypeGiggle!</h2>
            <p style="text-align: center;">Your verification code is:</p>
            <h1 style="color: #22d3ee; font-size: 40px; letter-spacing: 10px; text-align: center; margin: 20px 0;">${code}</h1>
            <p style="text-align: center;">Enter this code on the website to activate your account.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Resend Error (Verification):", emailError);
    }

    res.status(201).json({ message: 'Verification code sent to your email.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// VERIFY EMAIL
router.post('/verify', async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.verificationCode !== code) return res.status(400).json({ message: 'Invalid verification code' });

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email first.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access Denied' });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

// HELPER: Update Global Site Stats
const updateSiteStats = async (wpm, seconds) => {
  try {
    let stats = await SiteStats.findOne();
    if (!stats) {
      stats = new SiteStats();
    }
    
    stats.totalTestsStarted += 1;
    stats.totalTestsCompleted += 1;
    stats.totalSecondsTyped += seconds;

    let bucketIndex = Math.floor(wpm / 10);
    if (bucketIndex >= 30) bucketIndex = 29;
    if (bucketIndex >= 0) stats.wpmDistribution[bucketIndex] += 1;

    await stats.save();
  } catch (err) {
    console.error("Failed to update site stats", err);
  }
};

// SAVE SCORE (For Logged-in Users)
router.post('/save-score', verifyToken, async (req, res) => {
  try {
    const { wpm, rawWpm, consistency, accuracy, mode } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.history.push({ wpm, rawWpm, consistency, accuracy, mode });
    await user.save();

    // Update global stats too
    const seconds = parseInt(mode) || 30;
    await updateSiteStats(wpm, seconds);

    res.status(200).json({ message: 'Score saved' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// TRACK GUEST SCORE (For Users NOT Logged In)
router.post('/track-guest', async (req, res) => {
  try {
    const { wpm, seconds } = req.body;
    await updateSiteStats(wpm, seconds);
    res.status(200).json({ message: 'Guest score tracked' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find({}, 'username history');
    let allScores = [];

    users.forEach(user => {
      if (user.history && user.history.length > 0) {
        const bests = {};
        user.history.forEach(score => {
          if (!bests[score.mode] || score.wpm > bests[score.mode].wpm) {
            bests[score.mode] = score;
          }
        });
        Object.values(bests).forEach(bestScore => {
          allScores.push({
            username: user.username,
            wpm: bestScore.wpm,
            rawWpm: bestScore.rawWpm || bestScore.wpm,
            accuracy: bestScore.accuracy,
            consistency: bestScore.consistency || 0,
            mode: bestScore.mode,
            date: bestScore.date
          });
        });
      }
    });

    allScores.sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy);
    res.json(allScores);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET SITE STATS (Now reads from global counter)
router.get('/stats', async (req, res) => {
  try {
    const stats = await SiteStats.findOne();
    
    if (!stats) {
      return res.json({ totalTests: 0, totalHours: "0.00", chartData: [] });
    }

    const chartData = stats.wpmDistribution.map((count, index) => ({
      range: `${index * 10}-${index * 10 + 9}`,
      users: count
    })).filter(data => data.users > 0);

    res.json({ 
      totalTests: stats.totalTestsCompleted, 
      totalHours: (stats.totalSecondsTyped / 3600).toFixed(2), 
      chartData 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const recentHistory = [...user.history].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 20);
    
    res.json({
      username: user.username,
      email: user.email,
      history: recentHistory,
      totalTests: user.history.length
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = code;
    await user.save();

    try {
      await resend.emails.send({
        from: 'TypeGiggle <noreply@typegiggle.com>', // UPDATED
        to: email,
        subject: 'Reset your TypeGiggle Password',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: white; border-radius: 10px; max-width: 500px; margin: auto;">
            <h2 style="color: #8b5cf6; text-align: center;">Reset Password</h2>
            <p style="text-align: center;">Your password reset code is:</p>
            <h1 style="color: #22d3ee; font-size: 40px; letter-spacing: 10px; text-align: center; margin: 20px 0;">${code}</h1>
            <p style="text-align: center;">If you did not request this, you can ignore this email.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Resend Error (Reset):", emailError);
    }

    res.json({ message: 'Reset code sent to your email.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.resetCode !== code) return res.status(400).json({ message: 'Invalid reset code' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetCode = null;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;