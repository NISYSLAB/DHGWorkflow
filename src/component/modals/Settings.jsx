import React, { useState, useEffect } from 'react';
import Modal from './ParentModal';
import './settings.css';
import { actionType as T } from '../../reducer';
import CodeEdit from '../CodeEdit';
import { nodeValidatorFormat, edgeValidatorFormat } from '../../config/defaultValidators';

const SettingsModal = ({ superState, dispatcher }) => {
    const [nodeValidator, setNodeValidator] = useState('');
    const [edgeValidator, setEdgeValidator] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    useEffect(() => {
        if (superState.curGraphInstance) {
            setNodeValidator(superState.curGraphInstance.getNodeValidator());
            setEdgeValidator(superState.curGraphInstance.getEdgeValidator());
        }
    }, [superState.curGraphInstance]);

    const close = () => dispatcher({ type: T.SET_SETTING_MODAL, payload: false });
    const submit = () => {
        try {
            superState.curGraphInstance.setEdgeNodeValidator({
                nodeValidator: `(node, nodes, edges, type)=>{${nodeValidator}}`,
                edgeValidator: `(edge, nodes, edges, type)=>{${edgeValidator}}`,
            });
            dispatcher({ type: T.SET_SETTING_MODAL, payload: false });
            setErrorMessage('');
        } catch (e) {
            setErrorMessage(e.message);
        }
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
                        pre="function validateNode(node, nodes, edges, type) {"
                        post="}"
                        value={nodeValidator}
                        onChange={(e) => setNodeValidator(e.target.value)}
                        height={200}
                        docString={nodeValidatorFormat}
                    />
                </div>
                <div>
                    <h3>Edge  Validator</h3>
                    <CodeEdit
                        pre="function validateEdge(edge, nodes, edges, type) {"
                        post="}"
                        value={edgeValidator}
                        onChange={(e) => setEdgeValidator(e.target.value)}
                        height={200}
                        docString={edgeValidatorFormat}
                    />
                </div>
                <div className="error">{errorMessage}</div>

                <div className="footer">
                    <button type="submit" className="btn btn-primary" onClick={submit}>Save</button>
                </div>
            </div>
        </Modal>
    );
};

export default SettingsModal;
