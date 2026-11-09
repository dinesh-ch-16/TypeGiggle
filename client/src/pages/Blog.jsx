import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { BookOpen, Calendar, Clock } from 'lucide-react';

export default function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const modules = import.meta.glob('../blog/*.md', { query: '?raw', import: 'default', eager: true });
    
    const loadedPosts = Object.entries(modules).map(([path, rawContent]) => {
      const slug = path.replace('../blog/', '').replace('.md', '');
      const frontmatterRegex = /^---\s*([\s\S]*?)\s*---/;
      const match = rawContent.match(frontmatterRegex);
      
      let data = {};
      let contentBody = rawContent;

      if (match) {
        const yaml = match[1];
        contentBody = rawContent.replace(frontmatterRegex, '').trim();
        
        yaml.split('\n').forEach(line => {
          const colonIndex = line.indexOf(':');
          if (colonIndex !== -1) {
            const key = line.slice(0, colonIndex).trim();
            let value = line.slice(colonIndex + 1).trim();
            value = value.replace(/^["'](.*)["']$/, '$1'); 
            data[key] = value;
          }
        });
      }

      const wordCount = contentBody.split(/\s+/).length;
      const readTime = Math.ceil(wordCount / 200);

      return {
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        image: data.image, // No default fallback image anymore
        readTime,
        hasContent: contentBody.length > 0 // Flag to check if it's an empty file
      };
    });

    // Filter out empty files and articles without a title
    const validPosts = loadedPosts.filter(post => post.title && post.hasContent);
    
    validPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    setPosts(validPosts);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-6 animate-fade-in">
      <SEO title="Typing Blog & Resources" description="Learn how to type faster, improve accuracy, and master the keyboard with TypeGiggle's guides." />
      
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 flex items-center justify-center gap-3" style={{ color: 'var(--main-color)' }}>
          <BookOpen size={40} /> Blog & Resources
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--sub-color)' }}>
          Master the keyboard with our in-depth guides on speed, accuracy, and typing techniques.
        </p>
      </div>

      {/* If no valid posts, show an empty state */}
      {posts.length === 0 ? (
        <div className="text-center py-20 rounded-3xl border border-white/5" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
          <p className="text-xl" style={{ color: 'var(--sub-color)' }}>No articles published yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link 
              to={`/blog/${post.slug}`} 
              key={post.slug} 
              className="flex flex-col rounded-2xl border border-white/10 hover:border-[var(--main-color)] transition-all duration-300 overflow-hidden group shadow-lg hover:shadow-2xl hover:-translate-y-1" 
              style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
            >
              
              {/* Only render the image container if the article has an image */}
              {post.image && (
                <div className="w-full h-48 overflow-hidden relative">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md" style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'var(--main-color)' }}>
                    Guide
                  </div>
                </div>
              )}

              {/* Content Container */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs font-semibold mb-3" style={{ color: 'var(--sub-color)' }}>
                  <span className="flex items-center gap-1"><Calendar size={14} /> {post.date || 'Recent'}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime} min read</span>
                </div>
                
                <h2 className="text-xl font-bold mb-3 leading-snug group-hover:text-[var(--main-color)] transition-colors line-clamp-2" style={{ color: 'var(--text-color)' }}>
                  {post.title}
                </h2>
                
                {post.excerpt && (
                  <p className="text-sm mb-4 line-clamp-3 flex-grow" style={{ color: 'var(--sub-color)' }}>
                    {post.excerpt}
                  </p>
                )}
                
                <div className="mt-auto pt-4 border-t border-white/5">
                  <span className="text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform" style={{ color: 'var(--text-color)' }}>
                    Read Article &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}