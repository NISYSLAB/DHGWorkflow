import React, { useReducer } from 'react';
import './App.css';
import ReactTooltip from 'react-tooltip';
import GraphComp from './graph';
import GraphCompDetails from './component/modals/GraphCompDetails';
import { Header } from './component/Header';
import { reducer, initialState, actionType as T } from './reducer';
import ProjectDetails from './component/modals/ProjectDetails';
import ShareModal from './component/modals/ShareModal';
import SettingsModal from './component/modals/Settings';

const app = () => {
    const [superState, dispatcher] = useReducer(reducer, initialState);
    return (
        <div className="container">
            <ProjectDetails superState={superState} dispatcher={dispatcher} />
            <ShareModal superState={superState} dispatcher={dispatcher} />
            <SettingsModal superState={superState} dispatcher={dispatcher} />
            <GraphCompDetails
                closeModal={() => dispatcher({ type: T.Model_Close })}
                superState={superState}
            />
            <Header state={superState} dispatcher={dispatcher} />
            <section className="body" style={{ display: 'flex', overflow: 'hidden' }}>
                <GraphComp dispatcher={dispatcher} superState={superState} />
            </section>
            <ReactTooltip place="bottom" type="dark" effect="solid" />
        </div>
    );
};

export default app;
