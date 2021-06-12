/* eslint-disable */
import React from 'react';
import cytoscape from 'cytoscape';
import edgehandles from 'cytoscape-edgehandles';
import gridGuide from 'cytoscape-grid-guide';
import cyOptions from './config/cytoscape-options';
import MyGraph from './graph-builder';
import ZoomComp from './component/ZoomSetter';
import Konva from 'konva';
import nodeEditing from 'cytoscape-node-editing'
import $ from "jquery";
import { useEffect } from 'react';
import { actionType as T } from './reducer';

const GraphComp = (props)=>{
    const graphContainerRef = React.createRef();
    const graphRef = React.createRef();
    const { dispatcher, superState } = props;
    

    const initialiseNewGraph = (element)=>{
        element.style.width = graphContainerRef.current.offsetWidth + "px"
        element.style.height = graphContainerRef.current.offsetHeight + "px"
        const cy = cytoscape({ ...cyOptions, container: element });
        cy.nodeEditing({ 
            resizeToContentCueEnabled: () => false, 
            setWidth: function(node, width) { 
                if(node.data('type')!='special') node.css('width', width);
            },
            setHeight: function(node, height) {
                if(node.data('type')!='special') node.css('height', height);
            }, 
            isNoResizeMode: function (node) { return node.data('type')==='special' }, 
            isNoControlsMode: function (node) { return node.data('type')==='special' },
        });

        cy.gridGuide({snapToGridOnRelease :false});
        const myGraph = new (MyGraph(Object))(cy, dispatcher, superState);
        // myGraph.set({cy, dispatcher, superState});
        // myGraph.regesterEvents();
        cy.edgehandles({
            preview: false,
            handlePosition() {
                return 'none';
            },
            complete: (a, b, c) => {c.remove() ; myGraph.addEdge(a.id(), b.id())},
        });
        // dispatcher({type: "SET_GRAPH", payload: myGraph})
        return myGraph;
    }
    useEffect(()=>{
        if(superState.graphs[superState.curGraphIndex] &&  !superState.graphs[superState.curGraphIndex].instance){
            const id = superState.graphs[superState.curGraphIndex].id;
            const projectDetails = superState.graphs[superState.curGraphIndex].projectDetails;
            console.log(id, superState.graphs[superState.curGraphIndex])
            const graph = initialiseNewGraph(document.getElementById(id));
            dispatcher({type: T.ADD_GRAPH_INSTANCE, instance: graph, projectDetails: {}})
        }
    },[superState.graphs.length])
    
    useEffect(()=>{
        if (typeof cytoscape('core', 'edgehandles') !== 'function') {
            cytoscape.use(edgehandles);
        }
        if (typeof cytoscape('core', 'nodeEditing') !== 'function') {
            nodeEditing(cytoscape, $, Konva);
        }
        if (typeof cytoscape('core', 'gridGuide') !== 'function') {
            gridGuide(cytoscape);
        }
        
        // initialiseNewGraph(graphRef.current);
        
    }, [])
    return (
        <div className="graph-container" style={{ flex: 1 }} ref={graphContainerRef}>
            {/* <div style={{ zIndex: 1 }} id="cy" ref={graphRef} /> */}
            {superState.graphs.map(e=>e.component)}
            <ZoomComp dispatcher={dispatcher} superState={superState} />
        </div>
    );
}

export default GraphComp;
