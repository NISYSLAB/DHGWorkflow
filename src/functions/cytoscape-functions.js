class CyFun {
    setCy(cy) {
        this.cy = cy;
    }

    addNode(name, style) {
        this.cy.add({
            group: 'nodes',
            data: {
                id: (new Date()).getTime(), name, type: 'ordin',
            },
            style,
            position: { x: 100, y: 100 },
        });
    }
}
const cyFun = new CyFun();
export default cyFun;
