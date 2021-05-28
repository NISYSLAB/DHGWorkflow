import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import './modal.css';

ReactModal.setAppElement('#root');

const Modal = ({ isOpen, closeModal, onSubmit }) => {
    const [curClass, setCurClass] = useState('');
    const [elName, setElName] = useState('');
    useEffect(() => {
        if (isOpen === true) {
            setCurClass('closing');
            setTimeout(() => {
                setCurClass('');
            }, 20);
        }
    }, [isOpen]);

    const handleCloseModal = () => {
        setCurClass('closing');
        setElName('');
        setTimeout(() => {
            closeModal();
        }, 400);
    };

    const submit = (e) => {
        e.preventDefault();
        onSubmit(elName);
        handleCloseModal();
    };

    return (
        <ReactModal
            isOpen={isOpen}
            contentLabel="onRequestClose Example"
            onRequestClose={handleCloseModal}
            className="Modal"
            overlayClassName={`Overlay ${curClass}`}
        >
            <form onSubmit={submit}>
                <div className={`modal-content ${curClass}`}>
                    <div className="modal-header">
                        <div className="modal-title h4">Modal heading</div>
                        <button type="button" className="close" onClick={handleCloseModal}>
                            <span aria-hidden="true">×</span>
                            <span className="sr-only">Close</span>
                        </button>
                    </div>
                    <input
                        type="text"
                        value={elName}
                        onChange={(e) => setElName(e.target.value)}
                    />
                    <div className="modal-body">Woohoo, you&apos;re reading this text in a modal!</div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary">Close</button>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                    </div>
                </div>
            </form>
        </ReactModal>
    );
};
export default Modal;
