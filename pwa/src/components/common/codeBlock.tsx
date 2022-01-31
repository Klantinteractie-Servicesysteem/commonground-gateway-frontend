import * as React from "react";

interface CodeBlockProps {
    body: any | null
    type?: string | null
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ body = null, type = 'json' }) => {

    let codeColor = '';

    switch(type) { 
        case 'json': { 
           codeColor = 'orange';
           break; 
        } 
        case 'xml': { 
           codeColor = 'green';
           break; 
        } 
     } 

    return (
        <pre style={{ 'backgroundColor': 'black', 'overflowWrap': 'break-word' }}>
            <code id="responseContent" style={{ color: codeColor }} className="language-json">
                {body}
            </code>
        </pre>
    );
}
export default CodeBlock;