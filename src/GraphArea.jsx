import React, { useEffect, useRef } from 'react';
import { useState } from 'react/cjs/react.development';
import { edgeValidator, nodeValidator } from './config/defaultValidators';
import MyGraph from './graph-builder';
import { actionType as T } from './reducer';

function Graph({
    el, i, superState, dispatcher, graphID, serverID, graphML, graphName, graphContainerRef, active,
}) {
    const [instance, setInstance] = useState(null);
    const ref = useRef();
    const setConatinerDim = (element) => {
        const elToAss = element;
        elToAss.style.width = `${graphContainerRef.current.offsetWidth - 2}px`;
        elToAss.style.height = `${graphContainerRef.current.offsetHeight - 2}px`;
    };

    const initialiseNewGraph = (element, id, projectDetails) => {
        const myGraph = new MyGraph(
            id, element, dispatcher, superState, projectDetails, nodeValidator, edgeValidator,
        );
        myGraph.loadGraphFromLocalStorage();
        dispatcher({ type: T.ADD_GRAPH_INSTANCE, instance: myGraph, index: i });
        return myGraph;
    };

    useEffect(() => instance && instance.set({ superState }), [superState]);
    useEffect(() => active && instance && instance.setCurStatus(), [active]);
    useEffect(() => {
        if (ref.current) {
            setConatinerDim(ref.current);
            window.addEventListener('resize', () => setConatinerDim(ref.current));
            setInstance(initialiseNewGraph(ref.current, el.id, { projectName: '', set: true }));
        }
    }, [ref]);

    const { id } = el;

    return (
        <div
            style={{ zIndex: 1, display: superState.curGraphIndex === i ? 'block' : 'none' }}
            key={id}
            className="graph-element"
            ref={ref}
        />
    );
}
export default Graph;
