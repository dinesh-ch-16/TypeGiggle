export const commonWords = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "not", "on", "with", 
  "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", 
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", 
  "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", 
  "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", 
  "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", 
  "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", 
  "us", "is", "was", "are", "been", "has", "had", "were", "said", "did", "having", "may", "should", "am", "been",
  "program", "code", "computer", "keyboard", "screen", "mouse", "website", "internet", "data", "design", 
  "system", "software", "network", "speed", "fast", "slow", "test", "fun", "game", "play", "win", "lose", 
  "best", "top", "great", "small", "large", "long", "short", "high", "low", "easy", "hard", "simple", "complex"
];

export const punctuation = [".", ",", "!", "?", ";", ":"];

// Helper to get a random word
export const getRandomWord = () => {
  return commonWords[Math.floor(Math.random() * commonWords.length)];
}

export const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "20", "50", "100", "500", "1000"];