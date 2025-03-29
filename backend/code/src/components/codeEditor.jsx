import React, { useState, useEffect } from "react";
import SyntaxHighlighter from "./syntaxHighlighter";
import "../index.css";

export default function CodeEditor({ code, setCode, language }) {
  // Remove the Prism-related imports and useEffect here
  return (
    <div className="w-full max-w-2xl">
      <textarea
        className="w-full h-40 p-3 bg-gray-800 border border-gray-600 text-white rounded font-mono"
        placeholder="Write your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <SyntaxHighlighter code={code} language={language} />
    </div>
  );
}