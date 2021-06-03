/* eslint-disable */
import React from 'react';
import cytoscape from 'cytoscape';
import edgehandles from 'cytoscape-edgehandles';
import automove from 'cytoscape-automove';
import gridGuide from 'cytoscape-grid-guide';
import cyOptions from './config/cytoscape-options';
import cyFun from './graph-builder';
import ZoomComp from './component/ZoomSetter';
import Konva from 'konva';
import nodeEditing from 'cytoscape-node-editing'
import $ from "jquery";

class GraphComp extends React.Component {
    constructor() {
        super();
        this.graphContainerRef = React.createRef();
        this.graphRef = React.createRef();
    }
    componentDidMount() {
        if (typeof cytoscape('core', 'edgehandles') !== 'function') {
            cytoscape.use(edgehandles);
        }
        if (typeof cytoscape('core', 'nodeEditing') !== 'function') {
            nodeEditing(cytoscape, $, Konva);
        }
        if (typeof cytoscape('core', 'gridGuide') !== 'function') {
            gridGuide(cytoscape);
        }
        if (typeof cytoscape('core', 'automove') !== 'function') {
            cytoscape.use(automove);
        }
        this.graphRef.current.style.width = this.graphContainerRef.current.offsetWidth + "px"
        this.graphRef.current.style.height = this.graphContainerRef.current.offsetHeight + "px"
        this.cy = cytoscape({ ...cyOptions, container: this.graphRef.current });
        this.cy.nodeEditing({ 
            resizeToContentCueEnabled: () => false, 
            setWidth: function(node, width) { 
                if(node.data('type')!='special') node.css('width', width);
            },
            setHeight: function(node, height) {
                if(node.data('type')!='special') node.css('height', height);
            }, 
            isNoResizeMode: function (node) { return node.data('type')==='special' }, // no active grapples
            isNoControlsMode: function (node) { return node.data('type')==='special' }, // no controls - do not draw grapples
        });

        this.cy.gridGuide({snapToGridOnRelease :false});
        const { dispatcher } = this.props;
        cyFun.setCy(this.cy);
        cyFun.setDispatcher(dispatcher);
        window.cye = this.cy.edgehandles({
            preview: false,
            handlePosition() {
                return 'none';
            },
            complete: (a, b, c) => {c.remove() ; cyFun.addEdge(a.id(), b.id())},
        });
        cyFun.addTestData();
    }

    render() {
        const { dispatcher, superState } = this.props;
        return (
            <div className="graph-container" style={{ flex: 1 }} ref={this.graphContainerRef}>
                <div style={{ zIndex: 1 }} id="cy" ref={this.graphRef} />
                <ZoomComp dispatcher={dispatcher} superState={superState} />
            </div>
        );
    }
}

export default GraphComp;
