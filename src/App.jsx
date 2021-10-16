import React, { useReducer } from 'react';
import './App.css';
import ReactTooltip from 'react-tooltip';
import GraphWorkspace from './GraphWorkspace';
import GraphCompDetails from './component/modals/GraphCompDetails';
import { Header } from './component/Header';
import { reducer, initialState, actionType as T } from './reducer';
import ProjectDetails from './component/modals/ProjectDetails';
import ShareModal from './component/modals/ShareModal';
import SettingsModal from './component/modals/Settings';
import FileDragDrop from './component/File-drag-drop';
import HistoryModal from './component/modals/History';

const app = () => {
    const [superState, dispatcher] = useReducer(reducer, initialState);
    return (
        <div className="container">
            <ProjectDetails superState={superState} dispatcher={dispatcher} />
            <ShareModal superState={superState} dispatcher={dispatcher} />
            <SettingsModal superState={superState} dispatcher={dispatcher} />
            <HistoryModal superState={superState} dispatcher={dispatcher} />
            <GraphCompDetails
                closeModal={() => dispatcher({ type: T.Model_Close })}
                superState={superState}
            />
            <FileDragDrop dispatcher={dispatcher} />
            <Header superState={superState} dispatcher={dispatcher} />
            <section className="body" style={{ display: 'flex', overflow: 'hidden' }}>
                <GraphWorkspace dispatcher={dispatcher} superState={superState} />
            </section>
            <ReactTooltip place="bottom" type="dark" effect="solid" />
        </div>
    );
};

export default app;
