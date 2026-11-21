import TypingTest from '../components/TypingTest';
import SEO from '../components/SEO';

export default function OneMinuteTest() {
  return (
    <div className="w-full flex flex-col items-center">
      <SEO 
        title="1 Minute Typing Test" 
        description="Take the official 1 minute typing test. Measure your WPM, accuracy, and typing speed instantly. Free and no registration required." 
      />
      
      {/* Render the typing test component with 60 seconds default */}
      <TypingTest defaultTime={60} />

      {/* SEO Content for the page */}
      <div className="w-full max-w-4xl mt-16 px-4 prose prose-invert prose-lg mx-auto text-gray-300">
        <h2 className="text-2xl font-bold text-white mb-4">Why Take a 1 Minute Typing Test?</h2>
        <p>The 1-minute typing test is the industry standard for measuring typing speed. It gives you a quick, accurate snapshot of your Words Per Minute (WPM) without requiring a massive time commitment.</p>
        
        <h3 className="text-xl font-bold text-white mt-8 mb-4">How is WPM Calculated?</h3>
        <p>Your WPM is calculated by taking the total number of correct characters you typed, dividing it by 5 (the standard word length), and then multiplying it by 60 to get the words per minute.</p>
        
        <p>Ready to test your speed? Hit the restart button above and start typing!</p>
      </div>
    </div>
  );
}