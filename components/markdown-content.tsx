import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="article-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          a({ href, children, ...props }) {
            const safe = href && /^https?:\/\//i.test(href);
            return safe
              ? <a {...props} href={href} target="_blank" rel="noopener noreferrer">{children}</a>
              : <span>{children}</span>;
          },
          table({ children, ...props }) {
            return <div className="article-table-scroll" role="region" aria-label="جدول المقال" tabIndex={0}><table {...props}>{children}</table></div>;
          },
        }}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  );
}
