const GraphCanvas = (ParentClass) => class extends ParentClass {
    resetZoom() {
        this.cy.reset();
    }

    fitZoom() {
        this.cy.fit();
    }

    setZoom(v) {
        this.cy.zoom(v / 100);
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
