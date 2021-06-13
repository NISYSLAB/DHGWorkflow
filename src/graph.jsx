import React, { useEffect } from 'react';
import cytoscape from 'cytoscape';
import edgehandles from 'cytoscape-edgehandles';
import gridGuide from 'cytoscape-grid-guide';
import Konva from 'konva';
import nodeEditing from 'cytoscape-node-editing';
import $ from 'jquery';
import cyOptions from './config/cytoscape-options';
import MyGraph from './graph-builder';
import ZoomComp from './component/ZoomSetter';

import { actionType as T } from './reducer';
import './graph.css';

const GraphComp = (props) => {
    const graphContainerRef = React.createRef();
    const { dispatcher, superState } = props;

    const initialiseNewGraph = (element, id) => {
        // eslint-disable-next-line no-param-reassign
        element.style.width = `${graphContainerRef.current.offsetWidth}px`;
        // eslint-disable-next-line no-param-reassign
        element.style.height = `${graphContainerRef.current.offsetHeight}px`;
        const cy = cytoscape({ ...cyOptions, container: element });
        cy.nodeEditing({
            resizeToContentCueEnabled: () => false,
            setWidth(node, width) {
                if (node.data('type') !== 'special') node.css('width', width);
            },
            setHeight(node, height) {
                if (node.data('type') !== 'special') node.css('height', height);
            },
            isNoResizeMode(node) { return node.data('type') === 'special'; },
            isNoControlsMode(node) { return node.data('type') === 'special'; },
        });

        cy.gridGuide({ snapToGridOnRelease: false });
        const myGraph = new (MyGraph(Object))(id, cy, dispatcher, superState);
        cy.edgehandles({
            preview: false,
            handlePosition() {
                return 'none';
            },
            complete: (a, b, c) => { c.remove(); myGraph.addEdge(a.id(), b.id()); },
        });
        myGraph.loadGraphFromLocalStorage();
        return myGraph;
    };
    useEffect(() => {
        superState.graphs.forEach((e, i) => {
            if (e.instance) return;
            const { id } = e;
            const graph = initialiseNewGraph(document.getElementById(id), id);
            dispatcher({ type: T.ADD_GRAPH_INSTANCE, instance: graph, index: i });
        });
    }, [superState.graphs.length]);

    useEffect(() => {
        if (typeof cytoscape('core', 'edgehandles') !== 'function') {
            cytoscape.use(edgehandles);
        }
        if (typeof cytoscape('core', 'nodeEditing') !== 'function') {
            nodeEditing(cytoscape, $, Konva);
        }
        if (typeof cytoscape('core', 'gridGuide') !== 'function') {
            gridGuide(cytoscape);
        }
    }, []);

    return (
        <>
            <div className="tab-par">
                {superState.graphs.map((el, i) => (
                    <div
                        key={el.id}
                        className={`tab ${superState.curGraphIndex === i ? 'selected' : 'none'}`}
                        onClick={() => dispatcher({ type: T.CHANGE_TAB, payload: i })}
                        onKeyDown={(ev) => ev.key === 13 && dispatcher({ type: T.CHANGE_TAB, payload: i })}
                        role="button"
                        tabIndex={0}
                    >
                        <span className="tab-text">
                            {el.projectDetails.projectName}
                            {' - '}
                            {el.projectDetails.author}
                        </span>
                        <span
                            className="tab-close"
                            onClick={(e) => { e.stopPropagation(); dispatcher({ type: T.REMOVE_GRAPH, payload: i }); }}
                            onKeyDown={(ev) => ev.key === 13 && dispatcher({ type: T.REMOVE_GRAPH, payload: i })}
                            role="button"
                            tabIndex={0}
                        >
                            {' '}
                            X

                        </span>
                    </div>
                ))}
            </div>
            <div className="graph-container" ref={graphContainerRef}>
                {superState.graphs.map((el, i) => (
                    <div
                        style={{ zIndex: 1, display: superState.curGraphIndex === i ? 'block' : 'none' }}
                        id={el.id}
                        key={el.id}
                    />
                ))}
                <ZoomComp dispatcher={dispatcher} superState={superState} />
            </div>
        </>
    );
};

export default GraphComp;
