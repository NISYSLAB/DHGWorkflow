import { NodeStyle, EdgeStyle } from '../config/defaultStyles';
import { actionType as T } from '../reducer';

class CoreGraph {
    getById(x) {
        return this.cy.getElementById(x);
    }

    setCy(cy) {
        this.cy = cy;
        window.cyx = cy;
        const selectDeselect = () => {
            const els = this.cy.$(':selected');
            if (els.length === 0) { return this.dispatcher({ type: T.ELE_UNSELECTED }); }
            let type;
            if (els.every((e) => e.isNode())) type = 'NODE';
            else if (els.every((e) => e.isEdge())) type = 'EDGE';
            else type = 'MIX';
            const ids = els.map((e) => e.data('id'));
            return this.dispatcher({
                type: T.ELE_SELECTED,
                payload: {
                    ids, type,
                },
            });
        };
        this.cy.on('select', selectDeselect);
        this.cy.on('unselect', selectDeselect);
        this.cy.on('zoom', (e) => {
            this.dispatcher({ type: T.SET_ZOOM, payload: Math.round(100 * e.target.zoom()) });
        });
    }

    setDispatcher(dispatcher) {
        this.dispatcher = dispatcher;
    }

    addNode(label, style, type, position, sid, data) {
        const id = sid || (new Date()).getTime();
        this.cy.add({
            group: 'nodes',
            data: {
                id, label, type, ...data,
            },
            style,
            position,
        });
    }

    addEdge(source, target, label, style = {}) {
        this.cy.add({
            group: 'edges',
            data: { source, target, label },
            style,
        });
    }

    getStyle(id) {
        const allStyles = this.getById(id).style();
        const styles = {};
        Object.entries(NodeStyle).forEach((p) => { styles[p[0]] = allStyles[p[0]]; });
        Object.entries(EdgeStyle).forEach((p) => { styles[p[0]] = allStyles[p[0]]; });
        return styles;
    }

    getLabel(id) {
        return this.getById(id).data('label') || this.getById(id).data('label');
    }

    updateNode(id, style, label, shouldUpdateLabel) {
        if (shouldUpdateLabel) this.getById(id).data('label', label);
        this.getById(id).style(style);
    }

    updateEdge(id, style, label, shouldUpdateLabel) {
        if (shouldUpdateLabel) this.getById(id).data('label', label);
        this.getById(id).style(style);
    }

    updateData(id, key, val) {
        this.getById(id).data(key, val);
        return this;
    }

    modifyNewEdge() { return this; }

    enableDraw(enable) {
        if (enable) window.cye.enable();
        else window.cye.disable();
        return this;
    }

    deleteNode(id) {
        const el = this.getById(id);
        el.connectedEdges().forEach((edge) => this.deleteEdge(edge.id()));
        el.remove();
    }

    deleteEdge(id) {
        this.getById(id).remove();
    }

    deleteElem(id) {
        if (this.getById(id).isNode()) return this.deleteNode(id);
        return this.deleteEdge(id);
    }

    resetZoom() {
        this.cy.reset();
    }

    fitZoom() {
        this.cy.fit();
    }

    setZoom(v) {
        this.cy.zoom(v / 100);
    }
}

export default CoreGraph;
