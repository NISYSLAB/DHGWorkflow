/* eslint-disable prefer-destructuring */
import React from 'react';
import cytoscape from 'cytoscape';
import edgehandles from 'cytoscape-edgehandles';
import cyOptions from './config/cytoscape-options';
import cyFun from './functions/cytoscape-functions';

class GraphComp extends React.Component {
    componentDidMount() {
        if (typeof cytoscape('core', 'edgehandles') !== 'function') {
            cytoscape.use(edgehandles);
        }
        this.cy = cytoscape({ ...cyOptions, container: document.getElementById('cy') });
        this.cy.edgehandles({
            preview: false,
            handlePosition() {
                return 'none';
            },
        });
        cyFun.setCy(this.cy);
    }

    render() {
        return (
            <div style={{ height: '100%', width: '100%' }} id="cy" />
        );
    }
}

export default GraphComp;
