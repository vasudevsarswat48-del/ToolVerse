'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, Trash2, FileText, RefreshCw } from 'lucide-react';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
  'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
  'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit',
  'voluptate', 'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
  'mollit', 'anim', 'id', 'est', 'laborum'
];

type GenerationType = 'paragraphs' | 'sentences' | 'words';

export default function LoremIpsumTool() {
  const [type, setType] = useState<GenerationType>('paragraphs');
  const [count, setCount] = useState<number>(3);
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);
  const [seed, setSeed] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const getRandomWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];

  const generatedText = useMemo(() => {
    // Reference seed to allow regenerating on click
    void seed;

    let words: string[] = [];

    const generateSentence = (minWords = 8, maxWords = 15) => {
      const len = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
      const sentenceWords = Array.from({ length: len }, () => getRandomWord());
      const sentence = sentenceWords.join(' ');
      return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
    };

    const generateParagraph = (minSentences = 4, maxSentences = 7) => {
      const numSentences = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
      return Array.from({ length: numSentences }, () => generateSentence()).join(' ');
    };

    if (type === 'words') {
      words = Array.from({ length: count }, () => getRandomWord());
      if (startWithLorem && words.length > 0) {
        const defaultStart = ['lorem', 'ipsum', 'dolor', 'sit', 'amet'];
        words = defaultStart.slice(0, count).concat(words.slice(defaultStart.length));
      }
      return words.join(' ');
    }

    if (type === 'sentences') {
      const sentences = Array.from({ length: count }, () => generateSentence());
      if (startWithLorem && sentences.length > 0) {
        sentences[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
      }
      return sentences.join(' ');
    }

    // Paragraphs
    const paragraphs = Array.from({ length: count }, () => generateParagraph());
    if (startWithLorem && paragraphs.length > 0) {
      paragraphs[0] =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
    }
    return paragraphs.join('\n\n');
  }, [type, count, startWithLorem, seed]);

  const wordCount = useMemo(() => {
    if (!generatedText.trim()) return 0;
    return generatedText.trim().split(/\s+/).length;
  }, [generatedText]);

  const handleCopy = async () => {
    if (!generatedText) return;
    await navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    setSeed((prev) => prev + 1);
  };

  const handleClear = () => {
    setCount(0);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>Lorem Ipsum Placeholder Generator</span>
        </div>

        <button
          onClick={handleClear}
          disabled={count === 0}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 disabled:opacity-40 transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      {/* Control Configuration Panel */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
          Configuration
        </span>

        <div className="flex flex-wrap items-center gap-6">
          {/* Type Selector */}
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400">Generate:</span>
            {(['paragraphs', 'sentences', 'words'] as GenerationType[]).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setType(mode);
                  if (count === 0) setCount(3);
                }}
                className={`px-3 py-1.5 text-xs font-semibold capitalize rounded-lg transition border ${
                  type === mode
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Quantity Input */}
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <label htmlFor="count-input" className="text-slate-400">
              Amount:
            </label>
            <input
              id="count-input"
              type="number"
              min={1}
              max={100}
              value={count || ''}
              onChange={(e) => setCount(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-20 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono text-xs focus:border-cyan-500 focus:outline-none transition"
            />
          </div>

          {/* Start with Lorem Ipsum Checkbox */}
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500/20"
            />
            <span>Start with &quot;Lorem ipsum...&quot;</span>
          </label>
        </div>
      </div>

      {/* Output Display Area */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
            <span>{generatedText.length} chars</span>
            <span>•</span>
            <span>{wordCount} words</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRegenerate}
              className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Regenerate
            </button>

            <button
              onClick={handleCopy}
              disabled={!generatedText}
              className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 disabled:opacity-40 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Text
                </>
              )}
            </button>
          </div>
        </div>

        <textarea
          value={generatedText}
          readOnly
          placeholder="Generated text will appear here..."
          className="w-full h-80 bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none font-sans text-xs resize-none leading-relaxed"
        />
      </div>
    </div>
  );
}
