import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SEO from '../components/SEO';
import { ArrowLeft, Calendar, Clock, Share2, Copy, Check, MessageCircle, ExternalLink, List, ArrowRight } from 'lucide-react';

export default function BlogPost() {
  const { slug } = useParams();
  const [content, setContent] = useState(null);
  const [meta, setMeta] = useState({});
  const [copied, setCopied] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [headings, setHeadings] = useState([]);
  const [otherPosts, setOtherPosts] = useState([]);

  useEffect(() => {
    // THE FIX: Scroll to top instantly when the slug changes
    window.scrollTo(0, 0);

    const modules = import.meta.glob('../blog/*.md', { query: '?raw', import: 'default', eager: true });
    const path = `../blog/${slug}.md`;
    
    setContent(null);
    setMeta({});
    setNotFound(false);
    setCopied(false);
    setHeadings([]);
    setOtherPosts([]);

    if (modules[path]) {
      const rawContent = modules[path];
      const frontmatterRegex = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/;
      const match = rawContent.match(frontmatterRegex);
      
      let parsedMeta = {};
      let parsedContent = rawContent;

      if (match) {
        const yaml = match[1];
        parsedContent = rawContent.replace(frontmatterRegex, '').trim();
        
        yaml.split('\n').forEach(line => {
          const colonIndex = line.indexOf(':');
          if (colonIndex !== -1) {
            const key = line.slice(0, colonIndex).trim();
            let value = line.slice(colonIndex + 1).trim();
            value = value.replace(/^["'](.*)["']$/, '$1'); 
            parsedMeta[key] = value;
          }
        });
      }

      const headingRegex = /^(##|###)\s+(.*)$/gm;
      let headingMatch;
      const extractedHeadings = [];
      while ((headingMatch = headingRegex.exec(parsedContent)) !== null) {
        extractedHeadings.push({
          level: headingMatch[1].length,
          text: headingMatch[2],
          id: headingMatch[2].toLowerCase().replace(/[^\w]+/g, '-')
        });
      }

      setHeadings(extractedHeadings);
      setContent(parsedContent);
      setMeta(parsedMeta);

      // Load other posts
      const allPosts = Object.entries(modules).map(([p, raw]) => {
        const postSlug = p.replace('../blog/', '').replace('.md', '');
        const fmMatch = raw.match(frontmatterRegex);
        let data = {};
        if (fmMatch) {
          fmMatch[1].split('\n').forEach(line => {
            const idx = line.indexOf(':');
            if (idx !== -1) {
              const k = line.slice(0, idx).trim();
              let v = line.slice(idx + 1).trim().replace(/^["'](.*)["']$/, '$1');
              data[k] = v;
            }
          });
        }
        return { slug: postSlug, title: data.title, excerpt: data.excerpt, image: data.image, date: data.date, readTime: Math.ceil(raw.split(/\s+/).length / 200) };
      });
      
      const filtered = allPosts.filter(p => p.slug !== slug && p.title).slice(0, 3);
      setOtherPosts(filtered);

    } else {
      setNotFound(true);
    }
  }, [slug]);

  const wordCount = content ? content.trim().split(/\s+/).filter(Boolean).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  const heroImage = meta.image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80';

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(meta.title || 'TypeGiggle Blog');

  const copyArticleLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (error) { console.error(error); }
  };

  const handleTocClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (!content && !notFound) return <div className="text-center py-20 text-white">Loading article...</div>;
  if (notFound) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 text-white">
      <h1 className="text-4xl font-extrabold mb-4">Article Not Found</h1>
      <Link to="/blog" className="px-6 py-3 rounded-xl font-bold bg-[var(--main-color)] text-black">Back to Blog</Link>
    </div>
  );

  return (
    <div className="w-full animate-fade-in pb-20">
      <SEO title={meta.title || 'Blog Post'} description={meta.excerpt || ''} />
      
      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-16">
        <Link to="/blog" className="inline-flex items-center gap-2 mb-8 text-sm font-bold text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Journal
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider mb-6 text-[var(--main-color)]">
              <span>Typing Guide</span>
              <span className="w-1 h-1 rounded-full bg-gray-600"></span>
              <span className="flex items-center gap-1"><Calendar size={14} /> {meta.date}</span>
              <span className="w-1 h-1 rounded-full bg-gray-600"></span>
              <span className="flex items-center gap-1"><Clock size={14} /> {readTime} min read</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-[1.1] mb-6 text-white">
              {meta.title}
            </h1>
            
            <p className="text-xl leading-relaxed mb-8 text-gray-300">
              {meta.excerpt}
            </p>
            
            <div className="flex items-center gap-4 border-t border-white/10 pt-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg bg-[var(--main-color)] text-black">T</div>
              <div>
                <p className="font-bold text-sm text-white">TypeGiggle Team</p>
                <p className="text-xs text-gray-400">Editorial</p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <img src={heroImage} alt={meta.title} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-12 items-start">
          
          {/* Sticky Table of Contents */}
          <aside className="hidden lg:block sticky top-28">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-400 flex items-center gap-2">
              <List size={14} /> Table of Contents
            </h4>
            <nav className="flex flex-col gap-3 border-l border-white/10">
              {headings.map((heading, idx) => (
                <a 
                  key={idx} 
                  href={`#${heading.id}`}
                  onClick={(e) => handleTocClick(e, heading.id)}
                  className={`text-sm text-gray-400 hover:text-[var(--main-color)] transition-colors pl-4 border-l-2 -ml-[1px] ${heading.level === 3 ? 'ml-4 text-xs' : ''}`}
                  style={{ borderColor: 'transparent' }}
                >
                  {heading.text}
                </a>
              ))}
            </nav>
            
            <div className="mt-10 pt-6 border-t border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-400">Share this story</h4>
              <button onClick={copyArticleLink} className="flex items-center gap-2 text-sm font-bold text-white hover:text-[var(--main-color)] transition-opacity">
                {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Link Copied!' : 'Copy Link'}
              </button>
            </div>
          </aside>

          {/* Article Content & Bottom Sections */}
          <div className="w-full max-w-3xl">
            <div className="prose prose-lg max-w-none 
              prose-headings:font-serif prose-headings:font-bold prose-headings:text-white
              prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-lg
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
              prose-a:text-[var(--main-color)] prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-md
              prose-blockquote:border-l-4 prose-blockquote:border-[var(--main-color)] prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:text-gray-300 prose-blockquote:italic
              prose-strong:text-white
              prose-table:border-collapse prose-table:w-full prose-table:my-8
              prose-th:bg-white/5 prose-th:p-4 prose-th:text-left prose-th:text-white prose-th:border prose-th:border-white/10
              prose-td:p-4 prose-td:text-gray-300 prose-td:border prose-td:border-white/10
              prose-ul:text-gray-300 prose-li:text-gray-300
            ">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children, ...props }) => {
                    const id = children.toString().toLowerCase().replace(/[^\w]+/g, '-');
                    return <h2 id={id} className="scroll-mt-32" {...props}>{children}</h2>;
                  },
                  h3: ({ children, ...props }) => {
                    const id = children.toString().toLowerCase().replace(/[^\w]+/g, '-');
                    return <h3 id={id} className="scroll-mt-32" {...props}>{children}</h3>;
                  },
                  a: ({ href, children, ...props }) => (
                    <a href={href} {...props} target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{children}</a>
                  ),
                  img: ({ src, alt }) => (
                    <img src={src} alt={alt || 'Blog image'} loading="lazy" className="w-full rounded-xl shadow-md my-8 object-cover" />
                  )
                }}
              >
                {content}
              </ReactMarkdown>
            </div>

            {/* Premium Share Section */}
            <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-white">
                  <Share2 size={20} className="text-[var(--main-color)]" /> Enjoyed this article?
                </h3>
                <p className="text-sm text-gray-400">Help others discover useful typing tips.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-[var(--main-color)] hover:text-black transition-all flex items-center justify-center">
                  <MessageCircle size={20} />
                </a>
                <a href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-[var(--main-color)] hover:text-black transition-all flex items-center justify-center">
                  <ExternalLink size={20} />
                </a>
                <button onClick={copyArticleLink} className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-[var(--main-color)] hover:text-black transition-all flex items-center justify-center">
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            {/* PREMIUM "READ NEXT" SECTION */}
            {otherPosts.length > 0 && (
              <div className="mt-20 pt-12 border-t border-white/10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-serif font-bold text-white">Keep Reading</h3>
                  <Link to="/blog" className="text-sm font-bold text-[var(--main-color)] hover:underline flex items-center gap-1">
                    View all <ArrowRight size={14} />
                  </Link>
                </div>
                
                <div className="flex flex-col gap-8">
                  {otherPosts.map((post) => (
                    <Link key={post.slug} to={`/blog/${post.slug}`} className="group flex flex-col md:flex-row gap-6 items-center">
                      {post.image && (
                        <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                          <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="w-full md:w-2/3">
                        <p className="text-xs font-bold text-[var(--main-color)] mb-2 uppercase tracking-wider">
                          {post.date} <span className="mx-2 text-gray-600">•</span> {post.readTime} min read
                        </p>
                        <h4 className="text-2xl font-serif font-bold text-white mb-3 leading-snug group-hover:text-[var(--main-color)] transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:gap-3 transition-all">
                          Read Article <ArrowRight size={16} className="text-[var(--main-color)]" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}