import React from 'react';
import './codeEdit.css';

const CodeEdit = ({
    pre, post, value, onChange, height,
}) => {
    const inputRef = React.createRef();
    return (
        <div
            className="textField"
            onClick={() => inputRef.current.focus()}
            onKeyDown={() => inputRef.current.focus()}
            role="textbox"
            tabIndex={0}
        >
            <textarea
                className="preTextField"
                value={pre}
                readOnly
                spellCheck="false"
            />
            <textarea
                className="mainTextField"
                spellCheck="false"
                {...{ value, onChange }}
                data-gramm_editor="false"
                style={{ height }}
                ref={inputRef}
            />
            <textarea
                className="postTextField"
                readOnly
                value={post}
                spellCheck="false"
            />
        </div>
    );
};

export default CodeEdit;
