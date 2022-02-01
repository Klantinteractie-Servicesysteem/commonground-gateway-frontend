import * as React from "react";
import './codeBlock.css';

interface CodeBlockProps {
  code: any,
  type?: string | null
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code = null, type = 'json' }) => {

  return (
    <pre className="codeBlock">
      <code id={"codeBlock--" + type} className={"language-" + (type && type + ' ' + 'codeBlock-code--' + type)}>
        {code}
      </code>
    </pre>
  );
}
export default CodeBlock;