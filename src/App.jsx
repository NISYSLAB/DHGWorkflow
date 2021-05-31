import React, { useReducer } from 'react';
import './App.css';
import GraphComp from './graph';
import Modal from './component/Modal';
import { Header } from './component/Header';
import { reducer, initialState, actionType as T } from './reducer';

const app = () => {
    const [superState, dispatcher] = useReducer(reducer, initialState);
    return (
        <div className="container">
            {superState.ModelOpen ? (
                <Modal
                    closeModal={() => dispatcher({ type: T.Model_Close })}
                    superState={superState}
                />
            ) : ''}
            <Header title="MyGraph" state={superState} dispatcher={dispatcher} />
            <section className="body">
                <div className="graph-container">
                    <GraphComp dispatcher={dispatcher} superState={superState} />
                </div>
            </section>
        </div>
    );
};

export default app;
