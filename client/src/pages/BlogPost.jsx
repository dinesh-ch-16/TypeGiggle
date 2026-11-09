
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import SEO from '../components/SEO';

import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Copy,
  Check,
  MessageCircle,
  ExternalLink
} from 'lucide-react';

export default function BlogPost() {
  const { slug } = useParams();

  const [content, setContent] = useState(null);
  const [meta, setMeta] = useState({});
  const [copied, setCopied] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Load Markdown blog posts
  useEffect(() => {
    const modules = import.meta.glob('../blog/*.md', {
      query: '?raw',
      import: 'default',
      eager: true
    });

    const path = `../blog/${slug}.md`;

    // Reset states when slug changes
    setContent(null);
    setMeta({});
    setNotFound(false);
    setCopied(false);

    if (modules[path]) {
      const rawContent = modules[path];

      // Extract frontmatter
      const frontmatterRegex = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/;
      const match = rawContent.match(frontmatterRegex);

      let parsedMeta = {};
      let parsedContent = rawContent;

      if (match) {
        const yaml = match[1];

        parsedContent = rawContent
          .replace(frontmatterRegex, '')
          .trim();

        yaml.split('\n').forEach(line => {
          const colonIndex = line.indexOf(':');

          if (colonIndex !== -1) {
            const key = line.slice(0, colonIndex).trim();

            let value = line.slice(colonIndex + 1).trim();

            // Remove surrounding quotes
            value = value.replace(/^["'](.*)["']$/, '$1');

            parsedMeta[key] = value;
          }
        });
      }

      setContent(parsedContent);
      setMeta(parsedMeta);
    } else {
      setNotFound(true);
    }
  }, [slug]);

  // Calculate reading time
  const wordCount = content
    ? content.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Hero image
  const heroImage =
    meta.image ||
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80';

  // Article sharing details
  const shareUrl =
    typeof window !== 'undefined' ? window.location.href : '';

  const shareTitle = meta.title || 'TypeGiggle Blog';

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);

  // Copy article link
  const copyArticleLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (error) {
      console.error('Unable to copy article link:', error);
    }
  };

  // Native mobile sharing
  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url: shareUrl
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Sharing failed:', error);
        }
      }
    }
  };

  // Loading state
  if (!content && !notFound) {
    return (
      <div
        className="text-center py-20"
        style={{ color: 'var(--text-color)' }}
      >
        Loading article...
      </div>
    );
  }

  // Article not found
  if (notFound) {
    return (
      <div
        className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6"
        style={{ color: 'var(--text-color)' }}
      >
        <h1 className="text-3xl font-extrabold mb-4">
          Article Not Found
        </h1>

        <p
          className="mb-8"
          style={{ color: 'var(--sub-color)' }}
        >
          Sorry, the article you are looking for does not exist.
        </p>

        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold"
          style={{
            backgroundColor: 'var(--main-color)',
            color: '#171717'
          }}
        >
          <ArrowLeft size={18} />
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in pb-20">

      {/* SEO */}
      <SEO
        title={meta.title || 'Blog Post'}
        description={meta.excerpt || ''}
      />

      {/* Hero Header */}
      <div className="relative w-full h-[50vh] md:h-[60vh] flex items-end justify-center pb-12 overflow-hidden">

        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt={meta.title || 'TypeGiggle article cover'}
            className="w-full h-full object-cover"
            fetchPriority="high"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-[var(--bg-color)]/80 to-transparent"></div>
        </div>

        {/* Title Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center animate-fade-in-up">

          <Link
            to="/blog"
            className="inline-flex items-center gap-2 mb-6 text-sm font-bold hover:underline px-4 py-2 rounded-full backdrop-blur-md"
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'var(--text-color)'
            }}
          >
            <ArrowLeft size={16} />
            Back to all articles
          </Link>

          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-white drop-shadow-lg"
            style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.8)'
            }}
          >
            {meta.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-bold text-white/80">

            {meta.date && (
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                {meta.date}
              </span>
            )}

            <span className="flex items-center gap-2">
              <Clock size={16} />
              {readTime} min read
            </span>

          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="w-full max-w-3xl mx-auto px-6 relative z-10 -mt-8">

        <div className="prose prose-invert prose-lg max-w-none
          prose-headings:text-[var(--text-color)]
          prose-h2:border-b
          prose-h2:border-white/10
          prose-h2:pb-2
          prose-a:text-[var(--main-color)]
          prose-img:rounded-2xl
          prose-img:shadow-2xl
          prose-blockquote:border-l-[var(--main-color)]
          prose-blockquote:bg-white/5
          prose-blockquote:py-2
          prose-blockquote:px-6
          prose-blockquote:rounded-r-lg
        ">

          <ReactMarkdown
            components={{
              // External links open in a new tab
              a: ({ href, children, ...props }) => {
                const isExternal = href?.startsWith('http');

                return (
                  <a
                    href={href}
                    {...props}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                  >
                    {children}
                  </a>
                );
              },

              // Responsive article images
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt || 'TypeGiggle blog illustration'}
                  loading="lazy"
                  className="w-full rounded-2xl shadow-2xl my-8"
                />
              )
            }}
          >
            {content}
          </ReactMarkdown>

        </div>
      </div>

      {/* Social Sharing Section */}
      <div className="max-w-3xl mx-auto px-6 mt-12">

        <div className="border-t border-white/10 pt-8">

          <h3
            className="text-xl font-bold mb-5 flex items-center gap-2"
            style={{ color: 'var(--text-color)' }}
          >
            <Share2 size={20} style={{ color: 'var(--main-color)' }} />
            Enjoyed this article? Share it!
          </h3>

          <div className="flex flex-wrap items-center gap-3">

            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
              style={{ color: 'var(--text-color)' }}
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>

            {/* LinkedIn */}
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
              style={{ color: 'var(--text-color)' }}
            >
              <Share2 size={18} />
              LinkedIn
            </a>

            {/* X */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on X"
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
              style={{ color: 'var(--text-color)' }}
            >
              <ExternalLink size={18} />
              X
            </a>

            {/* Copy Link */}
            <button
              onClick={copyArticleLink}
              className="px-4 py-3 rounded-xl border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
              style={{ color: 'var(--text-color)' }}
            >
              {copied ? (
                <Check size={18} />
              ) : (
                <Copy size={18} />
              )}

              {copied ? 'Copied!' : 'Copy Link'}
            </button>

            {/* Native Share */}
            {typeof navigator !== 'undefined' && navigator.share && (
              <button
                onClick={nativeShare}
                className="px-4 py-3 rounded-xl border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
                style={{ color: 'var(--text-color)' }}
              >
                <ExternalLink size={18} />
                More
              </button>
            )}

          </div>

          <p
            className="text-sm mt-5"
            style={{ color: 'var(--sub-color)' }}
          >
            Help others discover useful typing tips by sharing this guide.
          </p>

        </div>
      </div>

      {/* Back to Blog */}
      <div className="max-w-3xl mx-auto px-6 mt-12">

        <Link
          to="/blog"
          className="inline-flex items-center gap-2 font-bold hover:gap-3 transition-all"
          style={{ color: 'var(--main-color)' }}
        >
          <ArrowLeft size={18} />
          Explore More Articles
        </Link>

      </div>

    </div>
  );
}
