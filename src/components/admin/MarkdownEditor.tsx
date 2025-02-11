'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bold, 
  Italic, 
  List, 
  Link, 
  Code, 
  Image as ImageIcon,
  Eye,
  EyeOff,
  Heading1,
  Heading2,
  Quote,
  ListOrdered,
  Table
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
}

interface ToolbarButton {
  icon: any;
  label: string;
  prefix: string;
  suffix: string;
  block?: boolean;
}

export default function MarkdownEditor({ value, onChange, onImageUpload }: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [textareaElement, setTextareaElement] = useState<HTMLTextAreaElement | null>(null);

  const toolbarButtons: ToolbarButton[] = [
    { icon: Heading1, label: 'Heading 1', prefix: '# ', suffix: '', block: true },
    { icon: Heading2, label: 'Heading 2', prefix: '## ', suffix: '', block: true },
    { icon: Bold, label: 'Bold', prefix: '**', suffix: '**' },
    { icon: Italic, label: 'Italic', prefix: '_', suffix: '_' },
    { icon: List, label: 'Bullet List', prefix: '- ', suffix: '', block: true },
    { icon: ListOrdered, label: 'Numbered List', prefix: '1. ', suffix: '', block: true },
    { icon: Quote, label: 'Quote', prefix: '> ', suffix: '', block: true },
    { icon: Code, label: 'Code', prefix: '```\n', suffix: '\n```', block: true },
    { icon: Link, label: 'Link', prefix: '[', suffix: '](url)' },
    { icon: Table, label: 'Table', prefix: '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |', suffix: '', block: true },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && textareaElement === document.activeElement) {
        e.preventDefault();
        const start = textareaElement.selectionStart;
        const end = textareaElement.selectionEnd;
        const newValue = value.substring(0, start) + '  ' + value.substring(end);
        onChange(newValue);
        textareaElement.selectionStart = textareaElement.selectionEnd = start + 2;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [value, onChange, textareaElement]);

  const handleToolbarClick = (button: ToolbarButton) => {
    if (!textareaElement) return;

    const start = textareaElement.selectionStart;
    const end = textareaElement.selectionEnd;
    const selectedText = value.substring(start, end);

    let newText = '';
    if (button.block) {
      // For block-level elements, apply to each line
      const lines = selectedText.split('\n');
      newText = lines.map(line => button.prefix + line).join('\n');
    } else {
      newText = button.prefix + selectedText + button.suffix;
    }

    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange(newValue);

    // Restore selection
    const newCursorPos = start + newText.length;
    textareaElement.focus();
    textareaElement.selectionStart = textareaElement.selectionEnd = newCursorPos;
  };

  const handleImageUploadClick = async () => {
    if (!onImageUpload) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const imageUrl = await onImageUpload(file);
        const imageMarkdown = `![${file.name}](${imageUrl})`;
        
        const newValue = value + '\n' + imageMarkdown;
        onChange(newValue);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };
    input.click();
  };

  return (
    <div className="border border-neon-cyan/20 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center space-x-1 p-2 border-b border-neon-cyan/20 bg-black/30 overflow-x-auto">
        {toolbarButtons.map((button) => (
          <button
            key={button.label}
            onClick={() => handleToolbarClick(button)}
            className="p-1.5 text-gray-400 hover:text-neon-cyan rounded tooltip"
            title={button.label}
          >
            <button.icon className="w-4 h-4" />
          </button>
        ))}

        {onImageUpload && (
          <button
            onClick={handleImageUploadClick}
            className="p-1.5 text-gray-400 hover:text-neon-cyan rounded tooltip"
            title="Upload Image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
        )}

        <div className="flex-1" />

        <button
          onClick={() => setShowPreview(!showPreview)}
          className="p-1.5 text-gray-400 hover:text-neon-cyan rounded tooltip"
          title={showPreview ? 'Hide Preview' : 'Show Preview'}
        >
          {showPreview ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className={`flex ${showPreview ? 'divide-x divide-neon-cyan/20' : ''}`}>
        {/* Editor */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'}`}>
          <textarea
            ref={setTextareaElement}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-[500px] p-4 bg-black/30 text-gray-300 focus:outline-none font-mono"
            placeholder="Write your content in Markdown..."
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="w-1/2 h-[500px] overflow-auto p-4 bg-black/30">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={atomDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
              className="prose prose-invert max-w-none prose-pre:bg-black/50 prose-pre:p-0"
            >
              {value}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
} 