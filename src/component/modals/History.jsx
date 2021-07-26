import React, { useEffect, useState } from 'react';
import Modal from './ParentModal';
import './settings.css';
import { actionType as T } from '../../reducer';
import GA from '../../graph-builder/graph-actions';
import './history.css';

const HistoryModal = ({ superState, dispatcher }) => {
    const [historyList, setHistoryList] = useState([]);
    const [historyView, setHistoryView] = useState([]);
    // const [getLabelFromID, setgetLabelFromID] = useState('null');
    const getLabelFromID = (x) => {
        if (superState.graphs[superState.curGraphIndex] && superState.graphs[superState.curGraphIndex].instance) {
            return superState.graphs[superState.curGraphIndex].instance.getLabelFromID(x);
        }
        return '';
    };
    useEffect(() => {
        if (superState.graphs[superState.curGraphIndex] && superState.graphs[superState.curGraphIndex].instance) {
            setHistoryList([...superState.graphs[superState.curGraphIndex].instance.actionArr.reverse()]);
        }
    }, [superState.viewHistory, superState.graphs, superState.curGraphIndex]);

    const filterAction = ({ equivalent }) => [
        GA.ADD_NODE, GA.ADD_EDGE,
        GA.UPDATE_NODE, GA.UPDATE_EDGE,
        GA.DEL_NODE, GA.DEL_EDGE,
        GA.SET_DIM, GA.SET_BENDW,
    ].includes(equivalent.actionName);

    const stringifyAction = (equivalent) => {
        const par = equivalent.parameters;
        switch (equivalent.actionName) {
        case GA.ADD_NODE: return `Created new Node: ${par[0]}`;
        case GA.ADD_EDGE: return `Created new Edge ${
            getLabelFromID(par[0].id)
        } between ${getLabelFromID(par[0].sourceID)} and ${getLabelFromID(par[0].targetID)}`;
        case GA.UPDATE_NODE: return `Updated Label/Style for ${getLabelFromID(par[0])} node`;
        case GA.UPDATE_EDGE: return `Updated Edge ${getLabelFromID(par[0])}`;
        // case GA.UPDATE_DATA: return `${par}`;
        case GA.DEL_NODE: return `Deleted Node: ${getLabelFromID(par[0])}`;
        case GA.DEL_EDGE: return `Deleted Edge: ${getLabelFromID(par[0])}`;
        case GA.SET_POS: return `Moved node ${getLabelFromID(par[0])} on canvas`;
        case GA.SET_DIM: return `Changed dimension of node ${getLabelFromID(par[0])}`;
        case GA.SET_BENDW: return `Modified Bend Point of node ${getLabelFromID(par[0])}`;
        default: return '';
        }
    };

    const prefixTid = (tid, str) => {
        const DT = new Date(parseInt(tid, 10));
        const date = DT.toLocaleDateString();
        const time = DT.toLocaleTimeString();
        return `${date} ${time}: ${str}`;
    };

    const parseAction = ({ equivalent, tid }) => prefixTid(tid, stringifyAction(equivalent));

    useEffect(() => {
        setHistoryView(historyList.filter(filterAction).map(parseAction));
    }, [historyList]);

    const close = () => dispatcher({ type: T.SET_HISTORY_MODAL, payload: false });

    return (
        <Modal
            ModelOpen={superState.viewHistory}
            closeModal={close}
            title="History"
        >
            <div className="hist-container">
                <ul style={{ listStyleType: 'circle' }}>
                    {historyView.map((h) => <li>{h}</li>)}
                </ul>
            </div>
        </Modal>
    );
};

export default HistoryModal;
