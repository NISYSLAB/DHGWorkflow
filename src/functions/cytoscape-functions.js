class CyFun {
    setCy(cy) {
        this.cy = cy;
        window.cyx = cy;
    }

    addTestData() {
        this.addNode('A', {}, 'ordin', { x: 100, y: 100 });
        this.addNode('B', {}, 'ordin', { x: 500, y: 100 });
    }

    addNode(name, style, type, position, sid) {
        const id = sid || (new Date()).getTime();
        console.log(name, type, id);
        this.cy.add({
            group: 'nodes',
            data: {
                id, name, type,
            },
            style,
            position,
        });
    }

    adE2(source, target, style = {}) {
        this.cy.add({
            group: 'edges',
            data: { source, target },
            style,
        });
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

    addEdge(src, dest, edge) {
        const position = edge.sourceEndpoint();
        const destid = dest.data('id');
        let srcid = src.data('id');
        if (src.data('type') !== 'special') {
            const tid = (new Date()).getTime();
            this.addNode('', {}, 'special', position, tid);
            this.adE2(srcid, tid, { 'target-arrow-shape': 'none' });
            this.addAutoMove(this.cy.$(`#${tid}`), this.cy.$(`#${srcid}`));
            srcid = tid;
            this.getRealNode(tid);
        }
        edge.remove();
        this.adE2(srcid, destid);
    }
}
const cyFun = new CyFun();
export default cyFun;
