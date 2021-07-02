import React, { useState } from 'react';
import Modal from './ParentModal';
import './settings.css';
import { actionType as T } from '../../reducer';
import CodeEdit from '../CodeEdit';

const SettingsModal = ({ superState, dispatcher }) => {
    const [nodeValidator, setNodeValidator] = useState('');
    const [edgeValidator, setEdgeValidator] = useState('');
    const close = () => dispatcher({ type: T.SET_SETTING_MODAL, payload: false });
    const submit = () => {
        dispatcher({ type: T.SET_SETTING_MODAL, payload: false });
    };

    return (
        <Modal
            ModelOpen={superState.settingsModal}
            closeModal={close}
            title="Settings"
        >
            <div className="setting-container">
                <div>
                    <h3>Node Validator</h3>
                    <CodeEdit
                        pre="function validateNode(node, nodes, edges) {"
                        post="}"
                        value={nodeValidator}
                        onChange={(e) => setNodeValidator(e.target.value)}
                        height={150}
                    />
                </div>
                <div>
                    <h3>Edge  Validator</h3>
                    <CodeEdit
                        pre="function validateEdge(edge, nodes, edges) {"
                        post="}"
                        value={edgeValidator}
                        onChange={(e) => setEdgeValidator(e.target.value)}
                        height={150}
                    />
                </div>
                <div className="footer">
                    <button type="submit" className="btn btn-primary" onClick={submit}>Save</button>
                </div>
            </div>
        </Modal>
    );
};

export default SettingsModal;
