import * as React from "react";

interface JsonCodeProps {
    body: any | null
}

export const JsonCode: React.FC<JsonCodeProps> = ({ body = null }) => {
    return (
        <pre style={{ 'backgroundColor': 'black', 'overflowWrap': 'break-word' }}>
            <code id="responseContent" style={{ color: 'orange' }} className="language-json">
                {body}
            </code>
        </pre>
    );
}
export default JsonCode;