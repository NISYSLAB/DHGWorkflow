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
import localStorageManager from './graph-builder/local-storage-manager';

const GraphComp = (props) => {
    const graphContainerRef = React.createRef();
    const { dispatcher, superState } = props;

    const initialiseNewGraph = (element, id, projectDetails) => {
        // eslint-disable-next-line no-param-reassign
        element.style.width = `${graphContainerRef.current.offsetWidth - 2}px`;
        // eslint-disable-next-line no-param-reassign
        element.style.height = `${graphContainerRef.current.offsetHeight - 2}px`;
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
        const myGraph = new (MyGraph(Object))(id, cy, dispatcher, superState, projectDetails);
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
            const graph = initialiseNewGraph(document.getElementById(id), id, e.projectDetails);
            dispatcher({ type: T.ADD_GRAPH_INSTANCE, instance: graph, index: i });
        });
        // console.log(superState.graphs);
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
        localStorageManager.getAllGraphs().forEach((graphId) => {
            dispatcher({
                type: T.ADD_GRAPH,
                payload: {
                    id: graphId,
                    projectDetails: { projectName: '', author: '', set: true },
                },
            });
        });
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
                            onClick={(e) => {
                                e.stopPropagation();
                                localStorageManager.remove(superState.graphs[i] ? superState.graphs[i].id : null);
                                dispatcher({ type: T.REMOVE_GRAPH, payload: i });
                            }}
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
