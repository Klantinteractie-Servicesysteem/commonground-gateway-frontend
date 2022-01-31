import * as React from "react";
import './codeBlock.css';

interface CodeBlockProps {
    body: any | null
    type?: string | null
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ body = null, type = 'json' }) => {

    return (
        <pre className="codeblock-pre">
            <code id="responseContent" className={"language-" + (type && type + ' ' + 'codeblock-pre-color-' + type)}>
                {body}
            </code>
        </pre>
    );
}
export default CodeBlock;