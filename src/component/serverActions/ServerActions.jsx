import React, { useEffect, useRef, useState } from 'react';
import { MdEdit, MdDone } from 'react-icons/md';
import './serverActions.css';

const ServerActions = () => {
    const inputRef = useRef();
    const [isReadOnly, setIsReadOnly] = useState(true);
    useEffect(() => { inputRef.current.readOnly = isReadOnly; }, [isReadOnly]);
    const edit = () => {
        setIsReadOnly(false);
        inputRef.current.focus();
    };
    const save = () => {
        setIsReadOnly(true);
    };
    return (
        <div className="server-actions-container">
            <input className="server-id" readOnly ref={inputRef} />
            {
                isReadOnly
                    ? (
                        <div
                            className="edit-icon"
                            role="button"
                            onKeyDown={edit}
                            onClick={edit}
                            tabIndex={0}
                        >
                            <MdEdit size="25" />
                        </div>
                    )
                    : (
                        <div
                            className="edit-icon"
                            role="button"
                            onKeyDown={save}
                            onClick={save}
                            tabIndex={0}
                        >
                            <MdDone size="25" />
                        </div>
                    )
            }
        </div>
    );
};

export default ServerActions;
