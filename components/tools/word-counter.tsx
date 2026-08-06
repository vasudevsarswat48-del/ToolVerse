"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export const WordCounter = () => {
  const [text, setText] = useState("");

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const sentences = text.split(/[.!?]+/).filter(Boolean).length;
  const paragraphs = text.split(/\n+/).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface-100 p-4 rounded-xl text-center border border-surface-border">
          <p className="text-2xl font-bold text-accent">{words}</p>
          <p className="text-xs text-gray-400 mt-1">Words</p>
        </div>
        <div className="bg-surface-100 p-4 rounded-xl text-center border border-surface-border">
          <p className="text-2xl font-bold text-white">{chars}</p>
          <p className="text-xs text-gray-400 mt-1">Characters</p>
        </div>
        <div className="bg-surface-100 p-4 rounded-xl text-center border border-surface-border">
          <p className="text-2xl font-bold text-white">{sentences}</p>
          <p className="text-xs text-gray-400 mt-1">Sentences</p>
        </div>
        <div className="bg-surface-100 p-4 rounded-xl text-center border border-surface-border">
          <p className="text-2xl font-bold text-white">{paragraphs}</p>
          <p className="text-xs text-gray-400 mt-1">Paragraphs</p>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        className="w-full h-64 glass-input p-4 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-y"
      />

      <div className="flex gap-3 justify-end">
        <Button variant="outline" size="sm" onClick={() => setText("")}>
          Clear Text
        </Button>
      </div>
    </div>
  );
};
export default WordCounter;