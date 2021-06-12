const GraphCanvas = (ParentClass) => class extends ParentClass {
    resetZoom() {
        this.cy.reset();
    }

    setOnZoom(cb) {
        this.cy.removeListener('zoom');
        this.cy.on('zoom', (e) => cb(Math.round(100 * e.target.zoom())));
    }

    fitZoom() {
        this.cy.fit();
    }

    setZoom(v) {
        this.cy.zoom(v / 100);
    }

    getZoom() {
        return Math.round(this.cy.zoom() * 100);
    }

    clearAll() {
        if (this.cy.elements().length === 0) return true;
        // eslint-disable-next-line no-alert
        if (!window.confirm('Do want to clear all elements?')) return false;
        this.cy.elements().remove();
        return true;
    }
};

export default GraphCanvas;
