import React, { useState } from "react";
import axios from "axios";
import CodeEditor from "./components/codeEditor";
import "./index.css";

function App() {
  const [code, setCode] = useState("// Write your code here...");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("javascript");

  const executeCode = async () => {
    setLoading(true);
    setOutput("");
    try {
      const response = await axios.post("http://localhost:5000/execute", {
        code,
        language,
      });
      setOutput(response.data.output || "No output");
    } catch (error) {
      setOutput("Error executing code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-5">
     
      <h1 className="text-2xl font-bold mb-4">Multi-Language Online Compiler</h1>

      {/* Language Selector */}
      <select
        className="mb-3 p-2 bg-gray-800 text-white border border-gray-600 rounded"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
      </select>

      {/* Code Editor */}
      <CodeEditor code={code} setCode={setCode} language={language} />

      {/* Run Button */}
      <button
        onClick={executeCode}
        className="mt-3 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white"
      >
        Run Code
      </button>

      {loading && <p className="mt-3 text-yellow-400">Executing...</p>}

      {/* Output Display */}
      <div className="mt-5 w-full max-w-2xl p-3 bg-gray-800 border border-gray-600 rounded">
        <h3 className="text-lg font-bold">Output:</h3>
        <pre className="whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  );
}

export default App;
