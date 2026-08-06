"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export const JsonFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (err: any) {
      setError("Invalid JSON: " + err.message);
      setOutput("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-2 font-medium">Input JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            className="w-full h-80 glass-input p-4 rounded-xl font-mono text-xs placeholder-gray-600 resize-none"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-2 font-medium">Formatted Output</label>
          <textarea
            readOnly
            value={output}
            placeholder="Result will appear here..."
            className="w-full h-80 glass-input p-4 rounded-xl font-mono text-xs placeholder-gray-600 bg-black/40 resize-none"
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-400 font-mono">{error}</p>}

      <div className="flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={() => { setInput(""); setOutput(""); setError(""); }}>
          Clear
        </Button>
        <Button variant="primary" size="sm" onClick={handleFormat}>
          Beautify JSON
        </Button>
      </div>
    </div>
  );
};
export default JsonFormatter;