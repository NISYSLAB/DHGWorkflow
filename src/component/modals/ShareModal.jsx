import React, { useEffect, useState } from 'react';
import Modal from './ParentModal';
import './shareModal.css';
import { actionType as T } from '../../reducer';

const ShareModal = ({ superState, dispatcher }) => {
    const [serializedGraph, setSerializedGraph] = useState('');
    const [copyText, setCopyText] = useState('Copy');
    const cond = superState.shareModal && superState.curGraphInstance;
    useEffect(() => {
        if (cond) {
            setSerializedGraph(superState.curGraphInstance.serializeGraph());
            setCopyText('Copy');
        }
    }, [cond]);

    const closeModal = () => {
        dispatcher({ type: T.SET_SHARE_MODAL, payload: false });
    };
    const link = `${window.location.protocol}//${window.location.host}${window.location.pathname}?g=${serializedGraph}`;
    const copy = () => {
        navigator.clipboard.writeText(link).then(() => {
            setCopyText('Copied!');
            document.getElementsByClassName('preDiv')[0].focus();
            document.getElementsByClassName('preDiv')[0].select();
        });
    };

    return (
        <Modal
            ModelOpen={superState.shareModal}
            title="Shareable Link"
            closeModal={closeModal}
        >
            <div className="share-modal">
                <input readOnly className="preDiv" value={link} />
                <button onClick={copy} type="button" className="copyBtn">{copyText}</button>
            </div>

        </Modal>
    );
};

export default ShareModal;
