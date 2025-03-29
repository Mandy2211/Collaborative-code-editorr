import React, { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-cpp";

const SyntaxHighlighter = ({ code, language = "javascript" }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  return (
    <pre className={`language-${language}`}>
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
};

export default SyntaxHighlighter;