/* eslint-disable */
import React from 'react';
import cytoscape from 'cytoscape';
import edgehandles from 'cytoscape-edgehandles';
import gridGuide from 'cytoscape-grid-guide';
import cyOptions from './config/cytoscape-options';
import cyFun from './graph-builder';
import ZoomComp from './component/ZoomSetter';
import Konva from 'konva';
import nodeEditing from 'cytoscape-node-editing'
import $ from "jquery";
import { useEffect } from 'react';

const GraphComp = (props)=>{
    const graphContainerRef = React.createRef();
    const graphRef = React.createRef();
    const { dispatcher, superState } = props;
    useEffect(()=>{
        cyFun.setSuperState(superState)
    }, [superState])
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
        graphRef.current.style.width = graphContainerRef.current.offsetWidth + "px"
        graphRef.current.style.height = graphContainerRef.current.offsetHeight + "px"
        const cy = cytoscape({ ...cyOptions, container: graphRef.current });
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
        cyFun.setCy(cy);
        cyFun.setDispatcher(dispatcher);
        window.cye = cy.edgehandles({
            preview: false,
            handlePosition() {
                return 'none';
            },
            complete: (a, b, c) => {c.remove() ; cyFun.addEdge(a.id(), b.id())},
        });
        if(!cyFun.loadGraphFromLocalStorage()){
            cyFun.addTestData();
        }
        window.xxx=cyFun
    }, [])

    return (
        <div className="graph-container" style={{ flex: 1 }} ref={graphContainerRef}>
            <div style={{ zIndex: 1 }} id="cy" ref={graphRef} />
            <ZoomComp dispatcher={dispatcher} superState={superState} />
        </div>
    );
}

export default GraphComp;
