import * as React from "react";
import "./codeBlock.css";
import Prism from "prismjs";
import "../../../styles/prism.css";
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';

interface CodeBlockProps {
  code: any,
  language: "json" | "xml" | "css" | "html" | "yaml"
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {

  React.useEffect(() => {
    Prism.highlightAll();
  }, [Prism])

  return (<>
    <pre>
      <code className={`language-${language}`}>
        {code}
      </code>
    </pre>
    </>);
};
export default CodeBlock;
