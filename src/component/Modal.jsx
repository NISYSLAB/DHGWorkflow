import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import './modal.css';

ReactModal.setAppElement('#root');

const Modal = ({ closeModal, superState }) => {
    const [curClass, setCurClass] = useState('');
    const [data, setData] = useState({});
    const { modalPayload, ModelOpen } = superState;
    const {
        cb, title, submitText, Children, defaultStyle, defaultName, nameAllowed,
    } = modalPayload;

    useEffect(() => {
        setData({ name: defaultName || '', style: defaultStyle });
        if (ModelOpen === true) {
            setCurClass('closing');
            setTimeout(() => {
                setCurClass('');
            }, 20);
        }
    }, [ModelOpen]);

    const handleCloseModal = () => {
        setCurClass('closing');
        setTimeout(() => {
            closeModal();
        }, 400);
    };

    const submit = (e) => {
        e.preventDefault();
        cb(data.name, data.style);
        handleCloseModal();
    };

    return (
        <ReactModal
            isOpen={ModelOpen}
            contentLabel="onRequestClose Example"
            onRequestClose={handleCloseModal}
            className="Modal"
            overlayClassName={`Overlay ${curClass}`}
        >
            <form onSubmit={submit}>
                <div className={`modal-content ${curClass}`}>
                    <div className="modal-header">
                        <div className="modal-title h4">{title}</div>
                        <button type="button" className="close" onClick={handleCloseModal}>
                            <span aria-hidden="true">×</span>
                            <span className="sr-only">Close</span>
                        </button>
                    </div>
                    <div className="modal-content-body">
                        <Children data={data} setData={setData} nameAllowed={nameAllowed} />
                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="btn btn-primary">{submitText}</button>
                    </div>
                </div>
            </form>
        </ReactModal>
    );
};
export default Modal;
