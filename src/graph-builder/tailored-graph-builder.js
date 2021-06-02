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

    modifyNewEdge(src, dest, edge) {
        const position = edge.sourceEndpoint();
        const destid = dest.data('id');
        const srcid = src.data('id');
        edge.remove();
        if (src.data('type') !== 'special') {
            this.dispatcher({
                type: T.Model_Open_Create_Edge,
                cb: (edgeLabel, edgeStyle) => {
                    const tid = this.addNode('', { 'background-color': edgeStyle['line-color'] },
                        'special', position, { edgeLabel, edgeStyle }).id();
                    this.addEdge(srcid, tid, '', {
                        ...edgeStyle,
                        'target-arrow-shape': 'none',
                    });
                    this.addAutoMove(this.getById(tid), this.getById(srcid));
                    this.addEdge(tid, destid, edgeLabel, edgeStyle);
                },
            });
        } else {
            const edgeLabel = src.data('edgeLabel');
            const edgeStyle = src.data('edgeStyle');
            this.addEdge(srcid, destid, edgeLabel, edgeStyle);
        }
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
}

export default TailoredGraph;
