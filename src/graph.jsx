import React from 'react';
import cytoscape from 'cytoscape';
import edgehandles from 'cytoscape-edgehandles';
import automove from 'cytoscape-automove';
import gridGuide from 'cytoscape-grid-guide';
import cyOptions from './config/cytoscape-options';
import cyFun from './graph-builder';
import ZoomComp from './component/ZoomSetter';

class GraphComp extends React.Component {
    componentDidMount() {
        if (typeof cytoscape('core', 'edgehandles') !== 'function') {
            cytoscape.use(edgehandles);
        }
        if (typeof cytoscape('core', 'gridGuide') !== 'function') {
            gridGuide(cytoscape);
        }
        if (typeof cytoscape('core', 'automove') !== 'function') {
            cytoscape.use(automove);
        }
        this.cy = cytoscape({ ...cyOptions, container: document.getElementById('cy') });
        this.cy.gridGuide();
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
        cyFun.addTestData();
    }

    render() {
        const { dispatcher, superState } = this.props;
        return (
            <div style={{ height: '100%', width: '100%', position: '' }}>
                <div style={{ height: '100%', width: '100%', zIndex: 999 }} id="cy" />
                <ZoomComp dispatcher={dispatcher} superState={superState} />
            </div>
        );
    }
}

export default GraphComp;
