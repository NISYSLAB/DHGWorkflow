import React, { useEffect, useRef } from 'react';
import { useState } from 'react/cjs/react.development';
import { edgeValidator, nodeValidator } from './config/defaultValidators';
import MyGraph from './graph-builder';
import { actionType as T } from './reducer';

function Graph({
    el, superState, dispatcher, graphID, serverID, graphML, projectDetails, graphContainerRef, active,
}) {
    const [instance, setInstance] = useState(null);
    const ref = useRef();
    const setConatinerDim = (element) => {
        const elToAss = element;
        elToAss.style.width = `${graphContainerRef.current.offsetWidth - 2}px`;
        elToAss.style.height = `${graphContainerRef.current.offsetHeight - 2}px`;
    };

    const initialiseNewGraph = () => {
        const myGraph = new MyGraph(
            graphID, ref.current, dispatcher, superState, projectDetails, nodeValidator, edgeValidator,
        );
        if (graphID) myGraph.loadGraphFromLocalStorage();
        if (serverID) myGraph.forcePullFromServer();
        if (graphML) myGraph.setGraphML(graphML);
        return myGraph;
    };

    useEffect(() => instance && instance.set({ superState }), [instance, superState]);
    useEffect(() => active && instance && instance.setCurStatus(), [active && instance]);
    useEffect(() => {
        if (active && instance) dispatcher({ type: T.SET_CUR_INSTANCE, payload: instance });
    }, [active && instance]);

    useEffect(() => {
        if (ref.current) {
            setConatinerDim(ref.current);
            window.addEventListener('resize', () => setConatinerDim(ref.current));
            setInstance(initialiseNewGraph());
        }
    }, [ref]);

    const { id } = el;

    return (
        <div
            style={{ zIndex: 1, display: active ? 'block' : 'none' }}
            key={id}
            className="graph-element"
            ref={ref}
        />
    );
}
export default Graph;
