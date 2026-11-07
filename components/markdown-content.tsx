"use client";

import React from 'react';

function InlineMarkdown({ text }: { text: string }) {
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^\s)]+\))/g;
  const parts = text.split(pattern);
  return <>{parts.map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (link) return <a key={index} href={link[2]} target="_blank" rel="noreferrer">{link[1]}</a>;
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    return <React.Fragment key={index}>{part}</React.Fragment>;
  })}</>;
}

export default function MarkdownContent({ content }: { content: string }) {
  const lines = content.replace(/\r/g, '').trim().split('\n');
  const blocks: React.ReactNode[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push(<p key={`p-${blocks.length}`}><InlineMarkdown text={paragraph.join(' ')} /></p>);
      paragraph = [];
    }
  };
  const flushList = () => {
    if (!list.length || !listType) return;
    const Tag = listType;
    blocks.push(<Tag key={`list-${blocks.length}`}>{list.map((item, i) => <li key={i}><InlineMarkdown text={item} /></li>)}</Tag>);
    list = [];
    listType = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flushParagraph(); flushList(); continue; }
    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      flushParagraph(); flushList();
      const Tag = heading[1].length === 2 ? 'h2' : 'h3';
      blocks.push(<Tag key={`h-${blocks.length}`}><InlineMarkdown text={heading[2]} /></Tag>);
      continue;
    }
    const bullet = line.match(/^[-*]\s+(.+)$/);
    const numbered = line.match(/^\d+[.)]\s+(.+)$/);
    if (bullet || numbered) {
      flushParagraph();
      const nextType = bullet ? 'ul' : 'ol';
      if (listType && listType !== nextType) flushList();
      listType = nextType;
      list.push((bullet || numbered)![1]);
      continue;
    }
    flushList();
    paragraph.push(line);
  }
  flushParagraph(); flushList();

  return <div className="article-markdown">{blocks}</div>;
}
