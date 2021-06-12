import { NodeStyle, EdgeStyle } from '../config/defaultStyles';
// import GraphUndoRedo from './graph-undo-redo';
const GraphUndoRedo = {};
GraphUndoRedo.ADD_NODE = 'ADD_NODE';
GraphUndoRedo.ADD_EDGE = 'ADD_EDGE';
GraphUndoRedo.UPDATE_NODE = 'UPDATE_NODE';
GraphUndoRedo.UPDATE_EDGE = 'UPDATE_EDGE';
GraphUndoRedo.UPDATE_DATA = 'UPDATE_DATA';
GraphUndoRedo.DEL_NODE = 'DEL_NODE';
GraphUndoRedo.DEL_EDGE = 'DEL_EDGE';
const GraphComponent = (ParentClass) => class GC extends ParentClass {
    constructor() {
        super();
        this.getTid = () => new Date().getTime();
    }

    getPos() {
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

    addNode(label, style, type = 'ordin', position = this.getPos(), data = {}, id, tid = this.getTid()) {
        const node = this.cy.add({
            group: 'nodes',
            data: {
                id, label, type, ...data,
            },
            style,
            position,
        });
        this.setNodeEvent(node);
        this.addAction(
            { actionName: GraphUndoRedo.DEL_NODE, parameters: [node.id()] },
            {
                actionName: GraphUndoRedo.ADD_NODE,
                parameters: [label, style, type, position, data, node.id()],
            },
            tid,
        );
        return node;
    }

    addEdge(source, target, label, style = {}, type = 'ordin', id, tid = this.getTid()) {
        const edge = this.cy.add({
            group: 'edges',
            data: {
                source, target, label, type, id,
            },
            style,
        });
        this.addAction(
            { actionName: GraphUndoRedo.DEL_EDGE, parameters: [edge.id()] },
            { actionName: GraphUndoRedo.ADD_EDGE, parameters: [source, target, label, style, type, edge.id()] },
            tid,
        );

        return edge;
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

    updateNode(id, style, label, shouldUpdateLabel, tid = this.getTid()) {
        this.addAction(
            {
                actionName: GraphUndoRedo.UPDATE_NODE,
                parameters: [id, this.getStyle(id), this.getById(id).data('label'), shouldUpdateLabel],
            },
            { actionName: GraphUndoRedo.UPDATE_NODE, parameters: [id, style, label, shouldUpdateLabel] },
            tid,
        );
        if (shouldUpdateLabel) this.getById(id).data('label', label);
        this.getById(id).style(style);
    }

    updateEdge(id, style, label, shouldUpdateLabel, tid = this.getTid()) {
        this.addAction(
            {
                actionName: GraphUndoRedo.UPDATE_EDGE,
                parameters: [id, this.getStyle(id), this.getById(id).data('label'), shouldUpdateLabel],
            },
            { actionName: GraphUndoRedo.UPDATE_EDGE, parameters: [id, style, label, shouldUpdateLabel] },
            tid,
        );
        if (shouldUpdateLabel) this.getById(id).data('label', label);
        this.getById(id).style(style);
    }

    updateData(id, key, val, tid = this.getTid()) {
        this.addAction(
            { actionName: GraphUndoRedo.UPDATE_DATA, parameters: [id, key, this.getById(id).data(key)] },
            { actionName: GraphUndoRedo.UPDATE_DATA, parameters: [id, key, val] }, tid,
        );
        this.getById(id).data(key, val);
        return this;
    }

    deleteNode(id, tid = this.getTid()) {
        const node = this.getById(id);
        node.connectedEdges('[type="ordin"]').forEach((edge) => this.deleteEdge(edge.id(), tid));
        node.connectedEdges().forEach((edge) => this.deleteEdge(edge.id(), tid));
        this.addAction(
            {
                actionName: GraphUndoRedo.ADD_NODE,
                parameters: [
                    node.data('label'), this.getStyle(node.id()), node.data('type'),
                    node.position(), node.json().data, id,
                ],
            },
            { actionName: GraphUndoRedo.DEL_NODE, parameters: [id] }, tid,
        );
        node.remove();
    }

    deleteEdge(id, tid = this.getTid()) {
        if (this.getById(id).length === 0 || this.getById(id).removed()) return;
        const jsonEd = this.getById(id).json();
        this.addAction(
            {
                actionName: GraphUndoRedo.ADD_EDGE,
                parameters: [
                    jsonEd.data.source, jsonEd.data.target, jsonEd.data.label, this.getStyle(id), jsonEd.data.type, id,
                ],
            },
            { actionName: GraphUndoRedo.DEL_EDGE, parameters: [id] }, tid,
        );
        this.getById(id).remove();
    }

    deleteElem(id, tid = this.getTid()) {
        if (this.getById(id).isNode()) return this.deleteNode(id, tid);
        return this.deleteEdge(id, tid);
    }
};

export default GraphComponent;
