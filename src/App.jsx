import React, { useReducer } from 'react';
import './App.css';
import GraphComp from './graph';
import GraphCompDetails from './component/modals/GraphCompDetails';
import { Header } from './component/Header';
import { reducer, initialState, actionType as T } from './reducer';
import ProjectDeails from './component/modals/ProjectDetails';

const app = () => {
    const [superState, dispatcher] = useReducer(reducer, initialState);
    return (
        <div className="container">
            <ProjectDeails superState={superState} dispatcher={dispatcher} />
            <GraphCompDetails
                closeModal={() => dispatcher({ type: T.Model_Close })}
                superState={superState}
            />
            <Header state={superState} dispatcher={dispatcher} />
            <section className="body" style={{ display: 'flex' }}>
                <GraphComp dispatcher={dispatcher} superState={superState} />
            </section>
        </div>
    );
};

export default app;
