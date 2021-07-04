import BendingDistanceWeight from './calculations/bending-dist-weight';
import GA from './graph-actions';
import { actionType as T } from '../reducer';

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
                ...data, id, label, type, style,
            },
            position,
        });
        this.addAction(
            { actionName: GA.DEL_NODE, parameters: [node.id()] },
            {
                actionName: GA.ADD_NODE,
                parameters: [label, style, type, position, data, node.id()],
            },
            tid,
        );
        return node;
    }

    parseBendinDW(rawStyle, sourceId, targetId) {
        if (rawStyle.bendDistance && rawStyle.bendWeight) return rawStyle;
        if (rawStyle.bendPoint) {
            const { x, y } = rawStyle.bendPoint;
            const { d, w } = BendingDistanceWeight.getWeightDistance(
                { x, y }, this.getById(sourceId).position(), this.getById(targetId).position(),
            );
            return { ...rawStyle, bendDistance: d, bendWeight: w };
        }
        return { ...rawStyle, bendDistance: 0, bendWeight: 0.5 };
    }

    addEdgeWithLabel(source, target, label, rawStyle = {}, type = 'ordin', id, tid = this.getTid()) {
        const style = this.parseBendinDW(rawStyle, source, target);
        const edge = this.cy.add({
            group: 'edges',
            data: {
                source, target, label, type, id, style,
            },
        });
        this.addAction(
            { actionName: GA.DEL_EDGE, parameters: [edge.id()] },
            { actionName: GA.ADD_EDGE, parameters: [source, target, label, style, type, edge.id()] },
            tid,
        );

        return edge;
    }

    addEdge(source, target, label, rawStyle = {}, type = 'ordin', id, tid = this.getTid()) {
        if (type === 'ordin' && label) {
            return this.addEdgeWithLabel(source, target, label, rawStyle, type, id, tid);
        }
        this.dispatcher({
            type: T.Model_Open_Create_Edge,
            cb: (edgeLabel, edgeStyle) => this.addEdgeWithLabel(source, target, edgeLabel, edgeStyle, type, id, tid),
        });
        return undefined;
    }

    getStyle(id) {
        return this.getById(id).data('style');
    }

    getLabel(id) {
        return this.getById(id).data('label') || this.getById(id).data('label');
    }

    updateNode(id, style, label, shouldUpdateLabel, tid = this.getTid()) {
        this.addAction(
            {
                actionName: GA.UPDATE_NODE,
                parameters: [id, this.getStyle(id), this.getById(id).data('label'), shouldUpdateLabel],
            },
            { actionName: GA.UPDATE_NODE, parameters: [id, style, label, shouldUpdateLabel] },
            tid,
        );
        if (shouldUpdateLabel) this.getById(id).data('label', label);
        this.getById(id).data('style', style);
    }

    updateEdge(id, style, label, shouldUpdateLabel, tid = this.getTid()) {
        this.addAction(
            {
                actionName: GA.UPDATE_EDGE,
                parameters: [id, this.getStyle(id), this.getById(id).data('label'), shouldUpdateLabel],
            },
            { actionName: GA.UPDATE_EDGE, parameters: [id, style, label, shouldUpdateLabel] },
            tid,
        );
        if (shouldUpdateLabel) this.getById(id).data('label', label);
        this.getById(id).data('style', style);
    }

    updateData(id, key, val, tid = this.getTid()) {
        this.addAction(
            { actionName: GA.UPDATE_DATA, parameters: [id, key, this.getById(id).data(key)] },
            { actionName: GA.UPDATE_DATA, parameters: [id, key, val] }, tid,
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
                actionName: GA.ADD_NODE,
                parameters: [
                    node.data('label'), this.getStyle(node.id()), node.data('type'),
                    node.position(), node.json().data, id,
                ],
            },
            { actionName: GA.DEL_NODE, parameters: [id] }, tid,
        );
        node.remove();
    }

    deleteEdge(id, tid = this.getTid()) {
        if (this.getById(id).length === 0 || this.getById(id).removed()) return;
        const jsonEd = this.getById(id).json();
        this.addAction(
            {
                actionName: GA.ADD_EDGE,
                parameters: [
                    jsonEd.data.source, jsonEd.data.target, jsonEd.data.label, this.getStyle(id), jsonEd.data.type, id,
                ],
            },
            { actionName: GA.DEL_EDGE, parameters: [id] }, tid,
        );
        this.getById(id).remove();
    }

    deleteElem(id, tid = this.getTid()) {
        if (this.getById(id).isNode()) return this.deleteNode(id, tid);
        return this.deleteEdge(id, tid);
    }

    setPos(id, pos) {
        this.getById(id).position(pos);
        this.getById(id).emit('moved');
    }

    setDim(id, dim, pos) {
        const style = this.getById(id).data('style');
        this.getById(id).data('style', { ...style, height: dim.height, width: dim.width });
        this.setPos(id, pos);
    }
};

export default GraphComponent;
