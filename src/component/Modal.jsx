import React, { useState } from 'react';
import ReactModal from 'react-modal';
import './modal.css';

ReactModal.setAppElement('#root');

const Modal = () => {
    const [showModal, setShowModel] = useState(false);
    const [curClass, setCurClass] = useState('');
    const handleOpenModal = () => {
        setCurClass('closing');
        setShowModel(true);
        setTimeout(() => {
            setCurClass('');
        }, 20);
    };

    const handleCloseModal = () => {
        setCurClass('closing');
        setTimeout(() => {
            setShowModel(false);
        }, 400);
    };

    return (
        <ReactModal
            isOpen={showModal}
            contentLabel="onRequestClose Example"
            onRequestClose={handleCloseModal}
            className="Modal"
            overlayClassName={`Overlay ${curClass}`}
        >
            <div className={`modal-content ${curClass}`}>
                <div className="modal-header">
                    <div className="modal-title h4">Modal heading</div>
                    <button type="button" className="close" onClick={handleCloseModal}>
                        <span aria-hidden="true">×</span>
                        <span className="sr-only">Close</span>
                    </button>
                </div>
                <div className="modal-body">Woohoo, you&apos;re reading this text in a modal!</div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary">Close</button>
                    <button type="button" className="btn btn-primary">Save Changes</button>
                </div>
            </div>
        </ReactModal>
    );
};
export default Modal;
