import React, { useState, useEffect } from 'react';
import './graph-comp-details.css';
import ParentModal from './ParentModal';

const ModalComp = ({ closeModal, superState }) => {
    const [data, setData] = useState({});
    const { modalPayload, ModelOpen } = superState;
    const {
        cb, title, submitText, Children, defaultStyle, defaultLabel, labelAllowed,
    } = modalPayload;

    useEffect(() => {
        setData({ label: defaultLabel || '', style: defaultStyle });
    }, [defaultLabel, defaultStyle]);

    const submit = (e) => {
        e.preventDefault();
        cb(data.label, data.style);
        closeModal();
    };

    return (
        <ParentModal closeModal={closeModal} ModelOpen={ModelOpen} title={title}>
            <form onSubmit={submit}>
                <div className="modal-content-body">
                    <Children data={data} setData={setData} labelAllowed={labelAllowed} />
                </div>
                <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">{submitText}</button>
                </div>
            </form>
        </ParentModal>
    );
};
export default ModalComp;
