import React from 'react';
import ReactMarkdown from 'react-markdown';

export function MarkdownViewer({content, className = ""}) {
  return (
    <div style={{whiteSpace: "pre-wrap"}} className={`${className} markdown `}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
