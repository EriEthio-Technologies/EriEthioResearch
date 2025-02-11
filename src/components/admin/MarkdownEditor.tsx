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
  Table,
  Strikethrough,
  CheckSquare,
  AlignLeft,
  AlignCenter,
  AlignRight,
  FileText,
  Save,
  Undo,
  Redo
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
  onSave?: () => void;
  autoSave?: boolean;
}

interface ToolbarButton {
  icon: any;
  label: string;
  prefix: string;
  suffix: string;
  block?: boolean;
  shortcut?: string;
}

export default function MarkdownEditor({ 
  value, 
  onChange, 
  onImageUpload,
  onSave,
  autoSave = true 
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [textareaElement, setTextareaElement] = useState<HTMLTextAreaElement | null>(null);
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [lastSaved, setLastSaved] = useState(value);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const toolbarButtons: ToolbarButton[] = [
    { icon: Heading1, label: 'Heading 1', prefix: '# ', suffix: '', block: true, shortcut: 'Ctrl+1' },
    { icon: Heading2, label: 'Heading 2', prefix: '## ', suffix: '', block: true, shortcut: 'Ctrl+2' },
    { icon: Bold, label: 'Bold', prefix: '**', suffix: '**', shortcut: 'Ctrl+B' },
    { icon: Italic, label: 'Italic', prefix: '_', suffix: '_', shortcut: 'Ctrl+I' },
    { icon: Strikethrough, label: 'Strikethrough', prefix: '~~', suffix: '~~', shortcut: 'Ctrl+S' },
    { icon: List, label: 'Bullet List', prefix: '- ', suffix: '', block: true, shortcut: 'Ctrl+U' },
    { icon: ListOrdered, label: 'Numbered List', prefix: '1. ', suffix: '', block: true, shortcut: 'Ctrl+O' },
    { icon: CheckSquare, label: 'Task List', prefix: '- [ ] ', suffix: '', block: true, shortcut: 'Ctrl+T' },
    { icon: Quote, label: 'Quote', prefix: '> ', suffix: '', block: true, shortcut: 'Ctrl+Q' },
    { icon: Code, label: 'Code Block', prefix: '```\n', suffix: '\n```', block: true, shortcut: 'Ctrl+K' },
    { icon: Link, label: 'Link', prefix: '[', suffix: '](url)', shortcut: 'Ctrl+L' },
    { icon: Table, label: 'Table', prefix: '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |', suffix: '', block: true },
    { icon: AlignLeft, label: 'Align Left', prefix: '::: left\n', suffix: '\n:::', block: true },
    { icon: AlignCenter, label: 'Align Center', prefix: '::: center\n', suffix: '\n:::', block: true },
    { icon: AlignRight, label: 'Align Right', prefix: '::: right\n', suffix: '\n:::', block: true },
  ];

  useEffect(() => {
    // Update word and character count
    const words = value.trim().split(/\s+/).filter(Boolean).length;
    const chars = value.length;
    setWordCount(words);
    setCharCount(chars);

    // Auto-save
    if (autoSave && value !== lastSaved) {
      const timeoutId = setTimeout(() => {
        onSave?.();
        setLastSaved(value);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [value, autoSave, lastSaved, onSave]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
          case 's':
            e.preventDefault();
            onSave?.();
            break;
          case 'b':
            e.preventDefault();
            handleToolbarClick(toolbarButtons[2]); // Bold
            break;
          case 'i':
            e.preventDefault();
            handleToolbarClick(toolbarButtons[3]); // Italic
            break;
          // Add more shortcuts...
        }
      }

      // Handle tab
      if (e.key === 'Tab' && textareaElement === document.activeElement) {
        e.preventDefault();
        const start = textareaElement.selectionStart;
        const end = textareaElement.selectionEnd;
        const newValue = value.substring(0, start) + '  ' + value.substring(end);
        handleChange(newValue);
        textareaElement.selectionStart = textareaElement.selectionEnd = start + 2;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [value, textareaElement, historyIndex]);

  const handleChange = (newValue: string) => {
    onChange(newValue);
    // Add to history
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newValue]);
    setHistoryIndex(prev => prev + 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      onChange(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      onChange(history[historyIndex + 1]);
    }
  };

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
    handleChange(newValue);

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
        handleChange(newValue);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };
    input.click();
  };

  return (
    <div className="border border-neon-cyan/20 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-neon-cyan/20 bg-black/30">
        <div className="flex items-center space-x-1">
          {toolbarButtons.map((button) => (
            <button
              key={button.label}
              onClick={() => handleToolbarClick(button)}
              className="p-1.5 text-gray-400 hover:text-neon-cyan rounded tooltip group relative"
              title={`${button.label}${button.shortcut ? ` (${button.shortcut})` : ''}`}
            >
              <button.icon className="w-4 h-4" />
              <span className="tooltip-text">{button.label}</span>
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
        </div>

        <div className="flex-1" />

        <div className="flex items-center space-x-2">
          <button
            onClick={handleUndo}
            disabled={historyIndex === 0}
            className="p-1.5 text-gray-400 hover:text-neon-cyan rounded tooltip disabled:opacity-50"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex === history.length - 1}
            className="p-1.5 text-gray-400 hover:text-neon-cyan rounded tooltip disabled:opacity-50"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-gray-600" />
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="p-1.5 text-gray-400 hover:text-neon-cyan rounded tooltip"
            title={showPreview ? 'Hide Preview' : 'Show Preview'}
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          {onSave && (
            <button
              onClick={onSave}
              className="p-1.5 text-gray-400 hover:text-neon-cyan rounded tooltip"
              title="Save (Ctrl+S)"
            >
              <Save className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className={`flex ${showPreview ? 'divide-x divide-neon-cyan/20' : ''}`}>
        {/* Editor */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'}`}>
          <textarea
            ref={setTextareaElement}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
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

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-neon-cyan/20 bg-black/30 text-sm text-gray-400">
        <div>
          {wordCount} words • {charCount} characters
        </div>
        <div className="flex items-center space-x-4">
          {autoSave && (
            <div className={value === lastSaved ? 'text-green-500' : 'text-yellow-500'}>
              {value === lastSaved ? 'Saved' : 'Unsaved changes...'}
            </div>
          )}
          <div>Markdown</div>
        </div>
      </div>
    </div>
  );
} 