import CoreGraph from './core-graph-builder';
import { actionType as T } from '../reducer';

class TailoredGraph extends CoreGraph {
    addTestData() {
        this.addNode('A', {}, 'ordin', { x: 100, y: 100 }, 1);
        this.addNode('B', {}, 'ordin', { x: 500, y: 100 }, 2);
        return this;
    }

    getRealNode(juncNodeId) {
        return this.cy.$(`#${juncNodeId}`).incomers().filter('node')[0];
    }

    addAutoMove(juncNode, parNode) {
        this.cy.automove({
            nodesMatching: juncNode,
            reposition: 'drag',
            dragWith: parNode,
        });
        this.cy.automove({
            nodesMatching: juncNode,
            reposition(node) {
                const pos = node.position();
                const P = parNode.position();
                const [h, w] = [parNode.height(), parNode.width()];
                const A = { y: P.y + h / 2, x: P.x + w / 2 };
                const B = { y: P.y - h / 2, x: P.x - w / 2 };
                pos.x = Math.min(A.x, Math.max(pos.x, B.x));
                pos.y = Math.min(A.y, Math.max(pos.y, B.y));
                if (pos.x < A.x && pos.y < A.y && pos.x > B.x && pos.y > B.y) {
                    const arr = [[Math.abs(pos.x - A.x), 'X', A.x],
                        [Math.abs(pos.x - B.x), 'X', B.x],
                        [Math.abs(pos.y - A.y), 'Y', A.y], [Math.abs(pos.y - B.y), 'Y', B.y]];
                    arr.sort((a, b) => a[0] - b[0]);
                    if (arr[0][1] === 'X') { [[, , pos.x]] = arr; }
                    if (arr[0][1] === 'Y') { [[, , pos.y]] = arr; }
                }
                return pos;
            },
            when: 'matching',
        });
    }

    modifyNewEdge(src, dest, edge) {
        const position = edge.sourceEndpoint();
        const destid = dest.data('id');
        let srcid = src.data('id');
        if (src.data('type') !== 'special') {
            const tid = (new Date()).getTime();
            this.dispatcher({
                type: T.Model_Open_Create_Edge,
                cb: (edgeName, edgeStyle) => {
                    this.addNode('', { 'background-color': edgeStyle['line-color'] },
                        'special', position, tid, { edgeName, edgeStyle });
                    this.addEdge(srcid, tid, edgeName, {
                        ...edgeStyle,
                        'target-arrow-shape': 'none',
                    });
                    this.addAutoMove(this.cy.$(`#${tid}`), this.cy.$(`#${srcid}`));
                    srcid = tid;
                    this.getRealNode(tid);
                    edge.remove();
                    this.addEdge(srcid, destid, edgeName, edgeStyle);
                },
            });
        } else {
            const edgeName = src.data('edgeName');
            const edgeStyle = src.data('edgeStyle');
            edge.remove();
            this.addEdge(srcid, destid, edgeName, edgeStyle);
        }
    }

    updateEdge(ids, style, label, shouldUpdateLabel) {
        const allIds = [];
        ids.forEach((id) => {
            const junctionNode = this.cy.getElementById(id).source();
            if (shouldUpdateLabel) this.updateData(junctionNode.data('id'), 'edgeName', label);
            this.updateData(junctionNode.data('id'), 'edgeStyle', style);
            this.updateNode([junctionNode.data('id')], { 'background-color': style['line-color'] }, 'de', false);
            junctionNode.connectedEdges().forEach((edge) => {
                if (edge.target() !== junctionNode) allIds.push(edge.data('id'));
            });
        });
        super.updateEdge(allIds, style, label, shouldUpdateLabel);
    }
}

export default TailoredGraph;
