import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import './modal.css';
import EdgeDetails from './EdgeDetails';
import { EdgeStyle } from '../config/defaultStyles';

ReactModal.setAppElement('#root');

const Modal = ({
    isOpen, closeModal, onSubmit, isEdge,
}) => {
    const [curClass, setCurClass] = useState('');
    const [data, setData] = useState({});

    useEffect(() => {
        setData({ name: '', style: EdgeStyle });
        if (isOpen === true) {
            setCurClass('closing');
            setTimeout(() => {
                setCurClass('');
            }, 20);
        }
    }, [isOpen]);

    const handleCloseModal = () => {
        setCurClass('closing');
        setTimeout(() => {
            closeModal();
        }, 400);
    };

    const submit = (e) => {
        e.preventDefault();
        onSubmit(data.name, data.style);
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
                    <div className="modal-content-body">
                        {(!isEdge) ? <EdgeDetails data={data} setData={setData} /> : (
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData({ ...data, name: e.target.value })}
                            />
                        )}
                    </div>
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
