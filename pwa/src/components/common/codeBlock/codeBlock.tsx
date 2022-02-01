import * as React from "react";
import './codeBlock.css';

interface CodeBlockProps {
  code: any,
  type?: string | null
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code = null, type = 'json' }) => {

  return (
    <pre className="codeblock-pre">
      <code id="responseContent" className={"language-" + (type && type + ' ' + 'codeblock-pre-color-' + type)}>
        {code}
      </code>
    </pre>
  );
}
export default CodeBlock;