import { NodeStyle, EdgeStyle } from '../config/defaultStyles';

const GraphComponent = (ParentClass) => class extends ParentClass {
    static getPos() {
        const allNodes = this.cy.$('node');
        const start = { x: 100, y: 100 };
        let found = true;
        while (found) {
            found = false;
            for (let i = 0; i < allNodes.length; i += 1) {
                const nodePos = allNodes[i].position();
                found = found || (nodePos.x === start.x && nodePos.y === start.y);
            }
            if (found) {
                start.x += 10;
                start.y += 10;
            }
        }
        return start;
    }

    addNode(label, style, type = 'ordin', position = this.getPos(), data = {}) {
        const node = this.cy.add({
            group: 'nodes',
            data: {
                label, type, ...data,
            },
            style,
            position,
        });
        this.setNodeEvent(node);
        return node;
    }

    addEdge(source, target, label, style = {}, type = 'ordin') {
        // this.();
        return this.cy.add({
            group: 'edges',
            data: {
                source, target, label, type,
            },
            style,
        });
    }

    getStyle(id) {
        const el = this.getById(id);
        const allStyles = el.style();
        const styles = {};
        if (el.isNode()) Object.entries(NodeStyle).forEach((p) => { styles[p[0]] = allStyles[p[0]]; });
        if (el.isEdge()) Object.entries(EdgeStyle).forEach((p) => { styles[p[0]] = allStyles[p[0]]; });
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
};

export default GraphComponent;
