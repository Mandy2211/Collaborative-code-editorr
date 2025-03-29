const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/execute", (req, res) => {
  const { code, language } = req.body;
  let fileName, command;

// Choose file extension and execution command
switch (language) {
  case "javascript":
    fileName = "temp.js";
    command = `node ${fileName}`;
    break;
  case "python":
    fileName = "temp.py";
    command = `python3 ${fileName}`;
    break;
  case "cpp":
    fileName = "temp.cpp";
    const outputFile = process.platform === "win32" ? "temp.exe" : "temp.out";
    command = `g++ ${fileName} -o ${outputFile} && ${process.platform === "win32" ? outputFile : "./" + outputFile}`;
    break;
  case "java":
    fileName = "Temp.java";
    command = `javac ${fileName} && java Temp`;
    break;
  default:
    return res.json({ output: "Unsupported language" });
}


  // Write code to file
  fs.writeFileSync(fileName, code);

  exec(command, (error, stdout, stderr) => {
    fs.unlinkSync(fileName); // Delete the file

    // For Java, delete compiled class file
    if (language === "java") fs.unlinkSync("Temp.class");

    if (error) return res.json({ output: stderr || "Execution error" });
    res.json({ output: stdout || "No output" });
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
