import CoreGraph from './core-graph-builder';
import { actionType as T } from '../reducer';
import AutomoveFn from './automove';

class TailoredGraph extends CoreGraph {
    addTestData() {
        this.addNode('A', {}, 'ordin', { x: 100, y: 100 });
        this.addNode('B', {}, 'ordin', { x: 500, y: 100 });
        return this;
    }

    getRealNode(juncNodeId) {
        return this.getById(juncNodeId).incomers().filter('node')[0];
    }

    addAutoMove(juncNode, parNode) {
        this.cy.automove({
            nodesMatching: juncNode,
            reposition: 'drag',
            dragWith: parNode,
        });
        const autoMoveAction = this.cy.automove({
            nodesMatching: juncNode,
            reposition(node) {
                const pos = node.position();
                const P = parNode.position();
                const [h, w] = [parNode.height(), parNode.width()];
                const R = AutomoveFn.getClosest(P, pos, w / 2, h / 2, parNode.style().shape);
                return { x: Math.round(R.x), y: Math.round(R.y) };
            },
            when: 'matching',
        });
        parNode.scratch('automove', [autoMoveAction]);
        juncNode.unselectify();
    }

    addEdgeWithJuncNode(sourceID, targetID) {
        const sourceNode = this.getById(sourceID);
        return super.addEdge(sourceID, targetID, sourceNode.data('edgeLabel'), sourceNode.data('edgeStyle'));
    }

    addEdgeWithoutJuncNode(sourceID, targetID, label, style) {
        const sourceNode = this.getById(sourceID);
        const targetNode = this.getById(targetID);
        const sourceNodeStyle = sourceNode.style();
        const juncNodePos = AutomoveFn.getClosest(
            sourceNode.position(),
            targetNode.position(),
            parseInt(sourceNodeStyle.width.slice(0, -2), 10) / 2,
            parseInt(sourceNodeStyle.height.slice(0, -2), 10) / 2,
            sourceNodeStyle['target-arrow-shape'],
        );
        const juncNode = super.addNode('', { 'background-color': style['line-color'] },
            'special', juncNodePos, { edgeLabel: label, edgeStyle: style });
        super.addEdge(sourceID, juncNode.id(), '', {
            ...style,
            'target-arrow-shape': 'none',
        }, 'special');
        this.addAutoMove(juncNode, sourceNode);
        return this.addEdgeWithJuncNode(juncNode.id(), targetID);
    }

    addEdge(sourceID, targetID, label = '', style) {
        const sourceNode = this.getById(sourceID);
        if (sourceNode.data('type') === 'special') return this.addEdgeWithJuncNode(sourceID, targetID);
        const juncNodes = sourceNode.outgoers('node').filter((node) => node.data('edgeLabel') === label);
        if (juncNodes.length) return this.addEdgeWithJuncNode(juncNodes[0].id(), targetID);
        if (label.length) return this.addEdgeWithoutJuncNode(sourceID, targetID, label, style);
        this.dispatcher({
            type: T.Model_Open_Create_Edge,
            cb: (edgeLabel, edgeStyle) => this.addEdgeWithoutJuncNode(sourceID, targetID, edgeLabel, edgeStyle),
        });
        return this;
    }

    updateEdge(id, style, label, shouldUpdateLabel) {
        const junctionNode = this.getById(id).source();
        if (shouldUpdateLabel) this.updateData(junctionNode.data('id'), 'edgeLabel', label);
        this.updateData(junctionNode.data('id'), 'edgeStyle', style);
        this.updateNode([junctionNode.data('id')], { 'background-color': style['line-color'] }, '', false);

        junctionNode
            .outgoers('edge')
            .forEach((edge) => super.updateEdge(edge.data('id'), style, label, shouldUpdateLabel));
    }

    deleteElem(id) {
        const el = this.getById(id);
        if (el.isNode()) {
            el.outgoers().forEach((x) => super.deleteElem(x.id()));
            el.connectedEdges().forEach((x) => this.deleteElem(x.id()));
            super.deleteNode(id);
        } else {
            const junctionNode = el.source();
            super.deleteEdge(id);
            if (junctionNode.outgoers().length === 0) this.deleteNode(junctionNode.id());
        }
    }

    getRealSourceId(nodeID) {
        return this.getById(nodeID).incomers('node')[0].id();
    }
}

export default TailoredGraph;
