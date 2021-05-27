/* eslint-disable no-console */

class CoreGraph {
    setCy(cy) {
        this.cy = cy;
        window.cyx = cy;
    }

    addNode(name, style, type, position, sid, data) {
        const id = sid || (new Date()).getTime();
        console.log(name, type, id);
        this.cy.add({
            group: 'nodes',
            data: {
                id, name, type, ...data,
            },
            style,
            position,
        });
    }

    addEdge(source, target, name, color, style = {}) {
        this.cy.add({
            group: 'edges',
            data: { source, target, label: name },
            style: { ...style, 'line-color': color, 'target-arrow-color': color },
        });
    }

    modifyNewEdge() { return this; }
}

export default CoreGraph;
