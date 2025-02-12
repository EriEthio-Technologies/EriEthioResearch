'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Save, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import Editor from '@monaco-editor/react';

interface TestCase {
  input: string;
  expected_output: string;
  hidden?: boolean;
}

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  testCases?: TestCase[];
  onSave?: (code: string) => void;
  onSubmit?: (code: string, results: any) => void;
  readOnly?: boolean;
}

export default function CodeEditor({
  initialCode = '',
  language = 'python',
  testCases = [],
  onSave,
  onSubmit,
  readOnly = false
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [theme, setTheme] = useState('vs-dark');

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Running...');

    try {
      // Here we'll integrate with a code execution service
      // For now, we'll simulate the execution
      const response = await fetch('/api/execute-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          testCases: testCases.filter(tc => !tc.hidden)
        })
      });

      const data = await response.json();
      setOutput(data.output);
      setTestResults(data.testResults || []);
    } catch (error) {
      setOutput('Error running code: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsRunning(true);
    setOutput('Running all tests...');

    try {
      // Run against all test cases, including hidden ones
      const response = await fetch('/api/execute-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          testCases,
          mode: 'submit'
        })
      });

      const data = await response.json();
      setTestResults(data.testResults || []);
      onSubmit?.(code, data);
    } catch (error) {
      setOutput('Error submitting code: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <div className="flex justify-between items-center p-4 bg-black/30 border-b border-neon-cyan/20">
        <div className="flex items-center space-x-4">
          <select
            value={language}
            className="px-3 py-1 bg-black/30 border border-neon-cyan/20 rounded text-gray-300 focus:border-neon-cyan focus:outline-none"
            disabled
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
          </select>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="px-3 py-1 bg-black/30 border border-neon-cyan/20 rounded text-gray-300 focus:border-neon-cyan focus:outline-none"
          >
            <option value="vs-dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          {!readOnly && (
            <>
              <button
                onClick={() => onSave?.(code)}
                className="flex items-center space-x-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan rounded hover:bg-neon-cyan/30 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center space-x-2 px-4 py-2 bg-neon-magenta/20 text-neon-magenta border border-neon-magenta rounded hover:bg-neon-magenta/30 transition-colors disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Run</span>
                  </>
                )}
              </button>
              {onSubmit && (
                <button
                  onClick={handleSubmit}
                  disabled={isRunning}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-500 border border-green-500 rounded hover:bg-green-500/30 transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Submit</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          defaultLanguage={language}
          defaultValue={code}
          theme={theme}
          onChange={(value) => setCode(value || '')}
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true
          }}
        />
      </div>

      {/* Output Panel */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: 'auto' }}
        className="border-t border-neon-cyan/20"
      >
        <div className="p-4 bg-black/30">
          <h3 className="text-neon-cyan font-semibold mb-2">Output</h3>
          <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap">
            {output}
          </pre>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="p-4 bg-black/30 border-t border-neon-cyan/20">
            <h3 className="text-neon-cyan font-semibold mb-2">Test Results</h3>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded ${
                    result.passed
                      ? 'bg-green-500/10 border border-green-500/20'
                      : 'bg-red-500/10 border border-red-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      Test Case {index + 1}
                    </span>
                    {result.passed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  {!result.passed && (
                    <div className="mt-2 text-sm">
                      <div>
                        <span className="text-gray-400">Expected: </span>
                        <span className="text-green-400">{result.expected}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Got: </span>
                        <span className="text-red-400">{result.actual}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
} 