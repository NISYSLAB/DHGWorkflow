import { NodeStyle, EdgeStyle } from '../config/defaultStyles';
import { actionType as T } from '../reducer';

class CoreGraph {
    $(X) {
        return this.cy.$(X);
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

    getStyle(id) {
        const allStyles = this.cy.$(`#${id}`).style();
        const styles = {};
        Object.entries(NodeStyle).forEach((p) => { styles[p[0]] = allStyles[p[0]]; });
        Object.entries(EdgeStyle).forEach((p) => { styles[p[0]] = allStyles[p[0]]; });
        return styles;
    }

    getName(id) {
        return this.cy.$(`#${id}`).data('name') || this.cy.$(`#${id}`).data('label');
    }

    updateNode(ids, style, name, shouldUpdateName) {
        ids.forEach((id) => {
            if (shouldUpdateName) this.cy.$(`#${id}`).data('name', name);
            this.cy.$(`#${id}`).style(style);
        });
        return this;
    }

    updateEdge(ids, style, label, shouldUpdateLabel) {
        ids.forEach((id) => {
            if (shouldUpdateLabel) this.cy.$(`#${id}`).data('label', label);
            this.cy.$(`#${id}`).style(style);
        });
        return this;
    }

    updateData(id, key, val) {
        this.$(`#${id}`).data(key, val);
        return this;
    }

    modifyNewEdge() { return this; }

    enableDraw(enable) {
        if (enable) window.cye.enable();
        else window.cye.disable();
        return this;
    }

    deleteNode(id) {
        const el = this.$(`#${id}`);
        el.connectedEdges().forEach((edge) => this.deleteEdge(edge.id()));
        el.remove();
    }

    deleteEdge(id) {
        this.$(`#${id}`).remove();
    }

    deleteElem(id) {
        if (this.$(`#${id}`).isNode()) return this.deleteNode(id);
        return this.deleteEdge(id);
    }
}

export default CoreGraph;
