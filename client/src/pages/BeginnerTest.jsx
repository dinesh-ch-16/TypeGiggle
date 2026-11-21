import TypingTest from '../components/TypingTest';
import SEO from '../components/SEO';

export default function BeginnerTest() {
  return (
    <div className="w-full flex flex-col items-center">
      <SEO 
        title="Typing Test for Beginners" 
        description="Learn how to type with our beginner-friendly typing test. Improve your accuracy and build muscle memory at your own pace." 
      />
      
      <TypingTest defaultTime={30} />

      <div className="w-full max-w-4xl mt-16 px-4 prose prose-invert prose-lg mx-auto text-gray-300">
        <h2 className="text-2xl font-bold text-white mb-4">The Best Typing Test for Beginners</h2>
        <p>If you're new to touch typing, starting with a 60-second or 15-second test can be intimidating. This 30-second test is designed for beginners to help you focus on accuracy first, and speed second.</p>
        
        <h3 className="text-xl font-bold text-white mt-8 mb-4">Tips for Beginners</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Don't look down at your keyboard. Keep your eyes on the screen.</li>
          <li>Use the correct finger positions (home row).</li>
          <li>Focus on accuracy before trying to type fast.</li>
        </ul>
      </div>
    </div>
  );
}