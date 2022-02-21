import * as React from "react";
import "./codeBlock.css";

interface CodeBlockProps {
  code: any,
  language: "json" | "xml"
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {

  return (
    <pre className="codeBlock">
      <code className={`codeBlock-code--${language}`}>
        {code}
      </code>
    </pre>
  );
};
export default CodeBlock;
