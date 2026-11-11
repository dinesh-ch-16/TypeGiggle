export const roasts = {
  terrible: [
    "Are you typing with your elbows? 💀",
    "My pet turtle just beat your score. 🐢",
    "Did you fall asleep on the keyboard? 😴",
    "I've seen faster typing from a toddler. 👶",
    "Bro, are you using a touchscreen? 💀",
    "Even my grandma is disappointed. 👵",
    "Is your keyboard broken or just your fingers? 🔧",
    "This is a typing test, not a hunting-and-pecking contest. 🐔",
    "Maybe try using all 10 fingers next time? 🖐️",
    "I think a carrier pigeon is faster than this. 🕊️"
  ],
  slow: [
    "Did you type this with one finger? 🐢",
    "You type like you're reading a dictionary. 📖",
    "My shadow types faster than you. 🌑",
    "At this speed, you'll finish your essay next year. 📝",
    "Are you sure you're not on a dial-up connection? ☎️",
    "I think my toaster has a higher WPM. 🍞",
    "You type like you're afraid of hurting the keys. 😰",
    "Step it up! This is a typing test, not a staring contest. 👀",
    "Your keyboard is begging for mercy. 😭",
    "Even the loading screen is faster. ⏳"
  ],
  average: [
    "Not bad, but my cat could do better. 🐱",
    "You're officially a normal human. Boring! 🥱",
    "Average speed. Average skills. Average roast. 😐",
    "You passed, but barely. Try again? 🤷",
    "You type like you're thinking about what to eat for dinner. 🍕",
    "Is that your final answer? 🤔",
    "Solid effort, but I expected more. 📉",
    "You're faster than 50% of people. So, exactly mediocre. 🌗",
    "Keep practicing, you're getting there... eventually. 🐌",
    "I've seen better, but I've also seen worse. 🤷‍♂️"
  ],
  fast: [
    "Pretty fast! Do you type for a living? 💼",
    "Okay, okay, we get it. You're good. 🙄",
    "Your fingers are on fire! 🔥",
    "Are you a professional typist or just showing off? 💅",
    "Fast fingers, but let's see that accuracy. 🎯",
    "You're in the top tier now. Don't let it get to your head. 👑",
    "Speed demon! 🏎️",
    "I'm impressed. And that doesn't happen often. 😲",
    "You type faster than I can read. 📖💨",
    "Blink and you'll miss it. 😉"
  ],
  legendary: [
    "Are you a robot? 🤖",
    "Bro is a keyboard wizard. 🧙‍♂️",
    "Touch grass immediately. You've peaked. 🌱",
    "Did you just break the sound barrier? 🚀",
    "The Matrix has you. 🟢",
    "I'm calling the police. This speed is illegal. 🚓",
    "You type faster than my thoughts. 🧠💨",
    "Are you secretly an AI? 👀",
    "This is inhuman. Go outside. 🌤️",
    "You have ascended to a higher plane of typing. 🌌"
  ],
  accuracyWarning: [
    "Speed is great, but what about those mistakes? 👀",
    "You type fast, but you make more mistakes than a politician. 🤥",
    "Accuracy is down bad. Fix it. 🔧",
    "Slow down, speed racer. Your typos are showing. 🛑",
    "You typed so fast you invented new words. 📖❌",
    "Speed without accuracy is just a lot of typos. 💩",
    "Your backspace key must be worn out by now. ⌨️",
    "Bro is fighting the keyboard, not typing on it. 🥊"
  ],
  perfectAccuracy: [
    "100% accuracy? Show off. 💅",
    "Perfect accuracy, but you type like a snail. 🐌🎯",
    "Flawless. Absolutely flawless. ✨",
    "You didn't make a single mistake. Are you human? 👽",
    "Precision is key, and you nailed it. 🔑"
  ]
};

// Helper function to get a random roast
export const getRandomRoast = (wpm, accuracy) => {
  let pool = [];

  if (accuracy < 85) pool = roasts.accuracyWarning;
  else if (accuracy === 100) pool = roasts.perfectAccuracy;
  else if (wpm < 20) pool = roasts.terrible;
  else if (wpm < 40) pool = roasts.slow;
  else if (wpm < 70) pool = roasts.average;
  else if (wpm < 100) pool = roasts.fast;
  else pool = roasts.legendary;

  return pool[Math.floor(Math.random() * pool.length)];
};