import { NodeStyle, EdgeStyle } from '../config/defaultStyles';
import { actionType as T } from '../reducer';

class CoreGraph {
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

    updateEl(ids, style, name) {
        if (ids.length === 1) {
            this.cy.$(`#${ids[0]}`).data('name', name);
            this.cy.$(`#${ids[0]}`).data('label', name);
        }
        ids.forEach((id) => {
            this.cy.$(`#${id}`).style(style);
        });
        return this;
    }

    modifyNewEdge() { return this; }
}

export default CoreGraph;
