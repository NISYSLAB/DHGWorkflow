// import GraphUndoRedo from './graph-undo-redo';
import Core from './1-core';

class GraphCanvas extends Core {
    setZoomUI;

    resetZoom() {
        this.cy.reset();
    }

    setOnZoom(cb) {
        this.cy.removeListener('zoom');
        this.setZoomUI = cb;
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
        this.cy.elements().forEach((el) => this.deleteElem(el.id(), 0));
        this.actionArr = [];
        this.cy.emit('graph-modified');
        return true;
    }

    resetAllComp() {
        this.cy.elements().remove();
    }

    setCurStatus() {
        super.setCurStatus();
        this.setZoomUI(Math.round(this.cy.zoom() * 100));
    }
}

export default GraphCanvas;
