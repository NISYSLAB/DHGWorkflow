import React, { useState, useEffect } from 'react';
import Modal from './ParentModal';
import './settings.css';
import { actionType as T } from '../../reducer';
import CodeEdit from '../CodeEdit';
import { nodeValidatorFormat, edgeValidatorFormat } from '../../config/defaultValidators';

const SettingsModal = ({ superState, dispatcher }) => {
    const [nodeValidator, setNodeValidator] = useState('');
    const [edgeValidator, setEdgeValidator] = useState('');
    useEffect(() => {
        if (superState.graphs[superState.curGraphIndex] && superState.graphs[superState.curGraphIndex].instance) {
            setNodeValidator(superState.graphs[superState.curGraphIndex].instance.getNodeValidator());
            setEdgeValidator(superState.graphs[superState.curGraphIndex].instance.getEdgeValidator());
        }
    }, [superState.graphs[superState.curGraphIndex] && superState.graphs[superState.curGraphIndex].instance]);

    const close = () => dispatcher({ type: T.SET_SETTING_MODAL, payload: false });
    const submit = () => {
        superState.graphs[superState.curGraphIndex].instance.setEdgeNodeValidator({
            nodeValidator: `(node, nodes, edges)=>{${nodeValidator}}`,
            edgeValidator: `(edge, nodes, edges)=>{${nodeValidator}}`,
        });
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
                        height={200}
                        docString={nodeValidatorFormat}
                    />
                </div>
                <div>
                    <h3>Edge  Validator</h3>
                    <CodeEdit
                        pre="function validateEdge(edge, nodes, edges) {"
                        post="}"
                        value={edgeValidator}
                        onChange={(e) => setEdgeValidator(e.target.value)}
                        height={200}
                        docString={edgeValidatorFormat}
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
