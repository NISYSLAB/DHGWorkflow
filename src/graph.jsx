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
import TabBar from './component/TabBar';
import { edgeValidator, nodeValidator } from './config/defaultValidators';

const GraphComp = (props) => {
    const graphContainerRef = React.useRef();
    const { dispatcher, superState } = props;
    const setConatinerDim = (element) => {
        /* eslint-disable no-param-reassign */
        element.style.width = `${graphContainerRef.current.offsetWidth - 2}px`;
        element.style.height = `${graphContainerRef.current.offsetHeight - 2}px`;
        /* eslint-enable no-param-reassign */
    };

    useEffect(() => {
        window.addEventListener('resize', () => graphContainerRef.current.childNodes
            .forEach((el) => el.classList.contains('graph-element') && setConatinerDim(el)));
    }, []);

    const initialiseNewGraph = (element, id, projectDetails) => {
        setConatinerDim(element);
        const cy = cytoscape({ ...cyOptions, container: element });
        cy.nodeEditing({
            resizeToContentCueEnabled: () => false,
            setWidth(node, width) {
                node.data('style', { ...node.data('style'), width });
            },
            setHeight(node, height) {
                node.data('style', { ...node.data('style'), height });
            },
            isNoResizeMode(node) { return node.data('type') !== 'ordin'; },
            isNoControlsMode(node) { return node.data('type') !== 'ordin'; },
        });

        cy.gridGuide({
            snapToGridOnRelease: false,
            zoomDash: true,
            panGrid: true,
        });
        const myGraph = new (MyGraph(Object))(
            id, cy, dispatcher, superState, projectDetails, nodeValidator, edgeValidator,
        );
        cy.edgehandles({
            preview: false,
            handlePosition() {
                return 'none';
            },
            handleNodes: 'node[type = "ordin"],node[type = "special"]',
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
    }, [superState.graphs.length]);

    useEffect(() => {
        if (superState.graphs[superState.curGraphIndex] && superState.graphs[superState.curGraphIndex].instance) {
            superState.graphs[superState.curGraphIndex].instance.setCurStatus();
        }
    }, [superState.curGraphIndex]);

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
        const graphFromParams = Object.fromEntries(new URLSearchParams(window.location.search).entries()).g;
        if (graphFromParams) {
            const graphContent = JSON.parse(atob(graphFromParams));
            const gid = new Date().getTime().toString();
            localStorageManager.addToFront(gid);
            localStorageManager.save(gid, graphContent);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        const allSavedGs = localStorageManager.getAllGraphs().map((graphId) => ({
            id: graphId,
            projectDetails: { projectName: '', author: '', set: true },
        }));
        dispatcher({
            type: T.ADD_GRAPH_BULK,
            payload: allSavedGs,
        });
    }, []);

    return (
        <div
            style={{
                flex: 1,
                flexDirection: 'column',
                display: 'flex',
                width: '100%',
            }}
        >
            <TabBar superState={superState} dispatcher={dispatcher} />
            <div style={{ flex: 1, background: 'white' }} className="graph-container" ref={graphContainerRef}>
                {superState.graphs.map((el, i) => (
                    <div
                        style={{ zIndex: 1, display: superState.curGraphIndex === i ? 'block' : 'none' }}
                        id={el.id}
                        key={el.id}
                        className="graph-element"
                    />
                ))}
                <ZoomComp dispatcher={dispatcher} superState={superState} />
            </div>
        </div>
    );
};

export default GraphComp;
