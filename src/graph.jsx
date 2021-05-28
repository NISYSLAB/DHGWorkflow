/* eslint-disable prefer-destructuring */
import React from 'react';
import cytoscape from 'cytoscape';
import edgehandles from 'cytoscape-edgehandles';
import automove from 'cytoscape-automove';
import cyOptions from './config/cytoscape-options';
import cyFun from './functions/graph-builder';

class GraphComp extends React.Component {
    componentDidMount() {
        if (typeof cytoscape('core', 'edgehandles') !== 'function') {
            cytoscape.use(edgehandles);
        }
        if (typeof cytoscape('core', 'automove') !== 'function') {
            cytoscape.use(automove);
        }
        this.cy = cytoscape({ ...cyOptions, container: document.getElementById('cy') });
        const { dispatcher } = this.props;
        cyFun.setCy(this.cy);
        cyFun.setDispatcher(dispatcher);
        window.cye = this.cy.edgehandles({
            preview: false,
            handlePosition() {
                return 'none';
            },
            complete: (a, b, c) => cyFun.modifyNewEdge(a, b, c),
        });
        // cyFun.addTestData();
    }

    render() {
        return (
            <div style={{ height: '100%', width: '100%' }} id="cy" />
        );
    }
}

export default GraphComp;
