import CoreGraph from './core-graph-builder';
import { actionType as T } from '../reducer';
import getBoundaryPoint from './calculations/boundary-point';

const TailoredGraph = (ParentClass) => class TG extends CoreGraph(ParentClass) {
    regesterEvents() {
        super.regesterEvents();
        this.cy.on('drag data', 'node[type="ordin"]', (evt) => {
            evt.target.connectedEdges().connectedNodes('node[type="special"]').forEach((juncNode) => {
                juncNode.position(TG.calJuncNodePos(juncNode));
            });
        });
        this.cy.on('bending', (evt) => {
            const juncNode = evt.target.source();
            juncNode.position(TG.calJuncNodePos(juncNode));
        });
    }

    static calJuncNodePos(juncNode) {
        const parNode = juncNode.incomers('node')[0];
        const meanNbrPosition = { x: 0, y: 0 };
        const setOfPos = new Set();
        juncNode.outgoers('edge[type="ordin"]')
            .forEach((edge) => setOfPos.add(JSON.stringify(TG.getBendEdgePoint(edge))));
        setOfPos.forEach((posStr) => {
            const pos = JSON.parse(posStr);
            meanNbrPosition.x += pos.x;
            meanNbrPosition.y += pos.y;
        });
        if (setOfPos.size === 0) return juncNode.position();
        meanNbrPosition.x /= setOfPos.size;
        meanNbrPosition.y /= setOfPos.size;
        return getBoundaryPoint(
            parNode.position(), meanNbrPosition,
            parNode.data('style').width / 2,
            parNode.data('style').height / 2,
            parNode.data('style').shape,
        );
    }

    getRealNode(juncNodeId) {
        return this.getById(juncNodeId).incomers().filter('node')[0];
    }

    addAutoMove(juncNode) {
        juncNode.unselectify();
        return this;
    }

    addEdgeWithJuncNode(sourceID, targetID, edgeStyle = {}, tid) {
        const juncNode = this.getById(sourceID);
        const ed = super.addEdgeWithLabel(
            sourceID, targetID,
            juncNode.data('edgeLabel'),
            {
                ...juncNode.data('edgeStyle'),
                bendDistance: edgeStyle.bendDistance,
                bendWeight: edgeStyle.bendWeight,
                bendPoint: edgeStyle.bendPoint,
            },
            'ordin',
            undefined, tid,
        );
        juncNode.position(TG.calJuncNodePos(juncNode));
        return ed;
    }

    addEdgeWithoutJuncNode(sourceID, targetID, label, style, tid) {
        const sourceNode = this.getById(sourceID);
        const targetNode = this.getById(targetID);
        const sourceNodeStyle = sourceNode.data('style');
        const juncNodePos = getBoundaryPoint(
            sourceNode.position(),
            targetNode.position(),
            sourceNodeStyle.width / 2,
            sourceNodeStyle.height / 2,
            sourceNodeStyle.shape,
        );
        const juncNode = super.addNode('', { backgroundColor: style.backgroundColor },
            'special', juncNodePos, { edgeLabel: label, edgeStyle: style }, undefined, tid);
        juncNode.ungrabify();
        super.addEdgeWithLabel(sourceID, juncNode.id(), '', {
            ...style,
            'target-arrow-shape': 'none',
        }, 'special', undefined, tid);
        this.addAutoMove(juncNode, sourceNode);
        return this.addEdgeWithJuncNode(juncNode.id(), targetID, style, tid);
    }

    addEdge(sourceID, targetID, label = '', style, type = 'ordin', id, tid = this.getTid()) {
        if (this.getById(targetID).data('type') !== 'ordin') return this;
        const sourceNode = this.getById(sourceID);
        // ↓ Condition never statisfies ↓
        if (type === 'special') return super.addEdgeWithLabel(sourceID, targetID, label, style, type, id, tid);
        if (sourceNode.data('type') === 'special') return this.addEdgeWithJuncNode(sourceID, targetID, style, tid);
        const juncNodes = sourceNode.outgoers('node').filter((node) => node.data('edgeLabel') === label);
        if (juncNodes.length) return this.addEdgeWithJuncNode(juncNodes[0].id(), targetID, style, tid);
        if (label.length) return this.addEdgeWithoutJuncNode(sourceID, targetID, label, style, tid);
        this.dispatcher({
            type: T.Model_Open_Create_Edge,
            cb: (edgeLabel, edgeStyle) => {
                const message = this.validiateEdge(edgeLabel, edgeStyle, sourceID, targetID, null, 'New');
                if (message.ok) this.addEdge(sourceID, targetID, edgeLabel, edgeStyle, tid);
                return message;
            },
        });
        return this;
    }

    updateEdge(id, style, label, shouldUpdateLabel, tid = this.getTid()) {
        const junctionNode = this.getById(id).source();
        if (shouldUpdateLabel) this.updateData(junctionNode.data('id'), 'edgeLabel', label, tid);
        this.updateData(junctionNode.data('id'), 'edgeStyle', style, tid);
        this.updateNode([junctionNode.data('id')], { backgroundColor: style.backgroundColor }, '', false, tid);

        junctionNode
            .outgoers('edge')
            .forEach((edge) => super.updateEdge(edge.data('id'), style, label, shouldUpdateLabel, tid));
    }

    deleteElem(id, tid = this.getTid()) {
        const el = this.getById(id);
        if (el.isNode()) {
            if (el.removed()) return;
            el.outgoers('node').forEach((x) => super.deleteElem(x.id(), tid));
            el.connectedEdges().forEach((x) => this.deleteElem(x.id(), tid));
            super.deleteNode(id, tid);
        } else {
            if (el.removed()) return;
            const junctionNode = el.source();
            super.deleteEdge(id, tid);
            if (junctionNode) if (junctionNode.outgoers().length === 0) this.deleteNode(junctionNode.id(), tid);
        }
    }

    getRealSourceId(nodeID) {
        if (this.getById(nodeID).data('type') === 'ordin') return nodeID;
        if (this.getById(nodeID).incomers('node').length === 0) return nodeID;
        return this.getById(nodeID).incomers('node')[0].id();
    }

    getEdgesBetweenNodes(n1, n2) {
        const [c1, c2] = [n1, n2]
            .map((n) => this.getById(this.getRealSourceId(n)))
            .map((r) => r.outgoers('node[type="special"]').union(r));
        return c1.edgesWith(c2);
    }

    getNodesEdges() {
        const nodes = this.cy.$('node[type="ordin"]').map((node) => ({
            label: node.data('label'),
            style: node.data('style'),
            id: node.data('id'),
        }));
        const edges = {};
        this.cy.$('edge[type="ordin"]').forEach((edge) => {
            const label = edge.data('label');
            const sourceLabel = this.getById(this.getRealSourceId(edge.source().id())).data('label');
            const targetLabel = edge.target().data('label');
            const style = edge.data('style');
            const id = edge.data('id');
            if (!edges[label]) {
                edges[label] = {
                    targetLabel: [targetLabel], sourceLabel, id, label, style,
                };
            } else edges[label].targetLabel.push(targetLabel);
        });
        return [nodes, Object.values(edges)];
    }
};

export default TailoredGraph;
