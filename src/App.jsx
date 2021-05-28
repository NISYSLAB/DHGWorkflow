import React, { useReducer } from 'react';
import './App.css';
import GraphComp from './graph';
import Modal from './component/Modal';
import { Header } from './component/Header';
import { reducer, initialState, actionType as T } from './reducer';

const app = () => {
    const [state, dispatcher] = useReducer(reducer, initialState);
    return (
        <div>
            <Modal
                isOpen={state.ModelOpen}
                closeModal={() => dispatcher({ type: T.CloseModal })}
                onSubmit={state.modelCallback}
                isEdge={state.isEdge}
            />
            <Header title="MyGraph" state={state} dispatcher={dispatcher} />
            <section className="body">
                <div className="graph-container">
                    <GraphComp dispatcher={dispatcher} />
                </div>
            </section>
        </div>
    );
};

export default app;
