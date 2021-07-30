import { saveAs } from 'file-saver';
import { actionType as T } from '../../reducer';
import localStorageManager from '../local-storage-manager';
import graphmlBuilder from '../graphml/builder';
import BendingDistanceWeight from '../calculations/bending-dist-weight';
import GraphUndoRedo from './4-undo-redo';

class GraphLoadSave extends GraphUndoRedo {
    autoSaveIntervalId

    constructor(...args) {
        super(...args);
        this.autoSaveIntervalId = null;
    }

    regesterEvents() {
        super.regesterEvents();
        this.cy.on('add remove data dragfreeon', 'node[type="ordin"]', () => this.saveLocalStorage());
        this.cy.on('add remove data', 'edge[type="ordin"]', () => this.saveLocalStorage());
        this.cy.on('nodeediting.resizeend graph-modified', () => this.saveLocalStorage());
    }

    downloadImg(format) {
        this.cy.emit('hide-bend');
        this.cy.$('.eh-handle').remove();
        if (format === 'PNG') saveAs(this.cy.png({ full: true }), `${this.getName()}-DHGWorkflow.png`);
        if (format === 'JPG') saveAs(this.cy.jpg({ full: true }), `${this.getName()}-DHGWorkflow.jpg`);
    }

    shouldNodeBeSaved(nodeID) {
        return this.getById(nodeID).data('type') === 'ordin';
    }

    shouldEdgeBeSaved(edgeID) {
        return this.getById(edgeID).data('type') === 'ordin';
    }

    // eslint-disable-next-line class-methods-use-this
    getRealSourceId(nodeID) {
        return nodeID;
    }

    jsonifyGraph() {
        const graph = {
            nodes: [], edges: [], projectDetails: this.projectDetails, id: this.id,
        };
        this.cy.nodes().forEach((node) => {
            if (this.shouldNodeBeSaved(node.id())) {
                const all = node.json();
                const nodeJson = {
                    label: all.data.label,
                    id: all.data.id,
                    position: all.position,
                    style: {},
                };
                nodeJson.style = this.getStyle(node.id());
                graph.nodes.push(nodeJson);
            }
        });
        this.cy.edges().forEach((edge) => {
            if (this.shouldEdgeBeSaved(edge.id())) {
                const edgeJson = edge.json().data;
                edgeJson.source = this.getRealSourceId(edge.source().id());
                edgeJson.style = this.getStyle(edge.id());
                edgeJson.bendData.bendPoint = BendingDistanceWeight.getCoordinate(
                    edgeJson.bendData.bendWeight, edgeJson.bendData.bendDistance,
                    edge.source().position(), edge.target().position(),
                );
                graph.edges.push(edgeJson);
            }
        });
        return graph;
    }

    getName() {
        return `${this.projectDetails.projectName}`;
    }

    saveToDisk(fileName) {
        const str = graphmlBuilder(this.jsonifyGraph());
        const bytes = new TextEncoder().encode(str);
        const blob = new Blob([bytes], { type: 'application/json;charset=utf-8' });
        saveAs(blob, `${fileName || `${this.getName()}-DHGWorkflow`}.graphml`);
    }

    loadJson(content) {
        const tid = new Date().getTime();
        content.nodes.forEach((node) => {
            this.addNode(node.label, node.style, 'ordin', node.position, { }, node.id, tid);
        });
        content.edges.forEach((edge) => {
            this.addEdge({ ...edge, sourceID: edge.source, targetID: edge.target }, tid);
        });
        this.projectDetails = content.projectDetails;
        this.dispatcher({
            type: T.SET_PROJECT_DETAILS,
            payload: {
                projectDetails: content.projectDetails,
                id: this.id,
            },
        });
    }

    saveLocalStorage() {
        if (this.autoSaveIntervalId !== null) clearTimeout(this.autoSaveIntervalId);
        this.autoSaveIntervalId = setTimeout(() => localStorageManager.save(this.id, this.jsonifyGraph()), 1000);
    }

    loadGraphFromLocalStorage() {
        const graphContent = localStorageManager.get(this.id);
        if (!graphContent) return false;
        this.loadJson(graphContent);
        return true;
    }

    serializeGraph() {
        return btoa(JSON.stringify(this.jsonifyGraph()));
    }
}

export default GraphLoadSave;
