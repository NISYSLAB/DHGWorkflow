class CoreGraph {
    setCy(cy) {
        this.cy = cy;
        window.cyx = cy;
    }

    setDispatcher(dispatcher) {
        this.dispatcher = dispatcher;
    }

    addNode(name, style, type, position, sid, data) {
        const id = sid || (new Date()).getTime();
        this.cy.add({
            group: 'nodes',
            data: {
                id, name, type, ...data,
            },
            style,
            position,
        });
    }

    addEdge(source, target, name, style = {}) {
        this.cy.add({
            group: 'edges',
            data: { source, target, label: name },
            style,
        });
    }

    modifyNewEdge() { return this; }
}

export default CoreGraph;
