import CoreGraph from './core-graph-builder';
import { actionType as T } from '../reducer';
import AutomoveFn from './automove';

class TailoredGraph extends CoreGraph {
    addTestData() {
        this.addNode('A', {}, 'ordin', { x: 100, y: 100 });
        this.addNode('B', {}, 'ordin', { x: 500, y: 100 });
        return this;
    }

    getRealNode(juncNodeId) {
        return this.getById(juncNodeId).incomers().filter('node')[0];
    }

    static calcPos(juncNode) {
        const parNode = juncNode.incomers('node')[0];
        const meanNbrPosition = { x: 0, y: 0 };
        const setOfPos = new Set();
        juncNode.outgoers('node').forEach((node) => setOfPos.add(JSON.stringify(node.position())));
        setOfPos.forEach((posStr) => {
            const pos = JSON.parse(posStr);
            meanNbrPosition.x += pos.x;
            meanNbrPosition.y += pos.y;
        });
        if (setOfPos.size === 0) return meanNbrPosition;
        meanNbrPosition.x /= setOfPos.size;
        meanNbrPosition.y /= setOfPos.size;
        return AutomoveFn.getClosest(
            parNode.position(), meanNbrPosition,
            parseInt(parNode.style().width.slice(0, -2), 10) / 2,
            parseInt(parNode.style().height.slice(0, -2), 10) / 2,
            parNode.style().shape,
        );
    }

    addAutoMove(juncNode) {
        juncNode.unselectify();
        return this;
    }

    setNodeEvent(node) {
        node.on('drag style', () => {
            node.connectedEdges().connectedNodes('node[type="special"]').forEach((juncNode) => {
                juncNode.position(TailoredGraph.calcPos(juncNode));
            });
        });
        return this;
    }

    addEdgeWithJuncNode(sourceID, targetID) {
        const juncNode = this.getById(sourceID);
        const ed = super.addEdge(sourceID, targetID, juncNode.data('edgeLabel'), juncNode.data('edgeStyle'));
        juncNode.position(TailoredGraph.calcPos(juncNode));
        return ed;
    }

    addEdgeWithoutJuncNode(sourceID, targetID, label, style) {
        const sourceNode = this.getById(sourceID);
        const targetNode = this.getById(targetID);
        const sourceNodeStyle = sourceNode.style();
        const juncNodePos = AutomoveFn.getClosest(
            sourceNode.position(),
            targetNode.position(),
            parseInt(sourceNodeStyle.width.slice(0, -2), 10) / 2,
            parseInt(sourceNodeStyle.height.slice(0, -2), 10) / 2,
            sourceNodeStyle.shape,
        );
        const juncNode = super.addNode('', { 'background-color': style['line-color'] },
            'special', juncNodePos, { edgeLabel: label, edgeStyle: style });
        super.addEdge(sourceID, juncNode.id(), '', {
            ...style,
            'target-arrow-shape': 'none',
        }, 'special');
        this.addAutoMove(juncNode, sourceNode);
        return this.addEdgeWithJuncNode(juncNode.id(), targetID);
    }

    addEdge(sourceID, targetID, label = '', style) {
        const sourceNode = this.getById(sourceID);
        if (sourceNode.data('type') === 'special') return this.addEdgeWithJuncNode(sourceID, targetID);
        const juncNodes = sourceNode.outgoers('node').filter((node) => node.data('edgeLabel') === label);
        if (juncNodes.length) return this.addEdgeWithJuncNode(juncNodes[0].id(), targetID);
        if (label.length) return this.addEdgeWithoutJuncNode(sourceID, targetID, label, style);
        this.dispatcher({
            type: T.Model_Open_Create_Edge,
            cb: (edgeLabel, edgeStyle) => this.addEdgeWithoutJuncNode(sourceID, targetID, edgeLabel, edgeStyle),
        });
        return this;
    }

    updateEdge(id, style, label, shouldUpdateLabel) {
        const junctionNode = this.getById(id).source();
        if (shouldUpdateLabel) this.updateData(junctionNode.data('id'), 'edgeLabel', label);
        this.updateData(junctionNode.data('id'), 'edgeStyle', style);
        this.updateNode([junctionNode.data('id')], { 'background-color': style['line-color'] }, '', false);

        junctionNode
            .outgoers('edge')
            .forEach((edge) => super.updateEdge(edge.data('id'), style, label, shouldUpdateLabel));
    }

    deleteElem(id) {
        const el = this.getById(id);
        if (el.isNode()) {
            el.outgoers().forEach((x) => super.deleteElem(x.id()));
            el.connectedEdges().forEach((x) => this.deleteElem(x.id()));
            super.deleteNode(id);
        } else {
            const junctionNode = el.source();
            super.deleteEdge(id);
            if (junctionNode.outgoers().length === 0) this.deleteNode(junctionNode.id());
        }
    }

    getRealSourceId(nodeID) {
        return this.getById(nodeID).incomers('node')[0].id();
    }
}

export default TailoredGraph;
