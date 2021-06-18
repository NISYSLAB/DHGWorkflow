import { saveAs } from 'file-saver';
import { actionType as T } from '../reducer';
import localStorageManager from './local-storage-manager';

const GraphLoadSave = (ParentClass) => class extends ParentClass {
    constructor() {
        super();
        this.autoSaveIntervalId = null;
    }

    downloadImg(format) {
        if (format === 'PNG') saveAs(this.cy.png(), `${this.getName()}-DHGWorkflow.png`);
        if (format === 'JPG') saveAs(this.cy.png(), `${this.getName()}-DHGWorkflow.jpg`);
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
        const graph = { nodes: [], edges: [], projectDetails: this.projectDetails };
        this.cy.nodes().forEach((node) => {
            if (this.shouldNodeBeSaved(node.id())) {
                const all = node.json();
                const nodeJson = {
                    label: all.data.label,
                    id: all.data.id,
                    position: all.position,
                };
                nodeJson.style = this.getStyle(node.id());
                graph.nodes.push(nodeJson);
            }
        });
        this.cy.edges().forEach((edge) => {
            if (this.shouldEdgeBeSaved(edge.id())) {
                const all = edge.json();
                const edgeJson = {
                    source: this.getRealSourceId(edge.source().id()),
                    target: all.data.target,
                    label: all.data.label,
                };
                edgeJson.style = this.getStyle(edge.id());
                graph.edges.push(edgeJson);
            }
        });
        return graph;
    }

    getName() {
        return `${this.projectDetails.projectName}-${this.projectDetails.author}`;
    }

    saveToDisk() {
        const str = JSON.stringify(this.jsonifyGraph());
        const bytes = new TextEncoder().encode(str);
        const blob = new Blob([bytes], { type: 'application/json;charset=utf-8' });
        saveAs(blob, `${this.getName()}-DHGWorkflow.json`);
    }

    loadJson(content) {
        content.nodes.forEach((node) => {
            this.addNode(node.label, node.style, 'ordin', node.position, { id: node.id });
        });
        content.edges.forEach((edge) => {
            this.addEdge(edge.source, edge.target, edge.label, edge.style);
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
        if (this.autoSaveTimeoutId !== null) clearTimeout(this.autoSaveIntervalId);
        this.autoSaveIntervalId = setTimeout(() => localStorageManager.save(this.id, this.jsonifyGraph()), 1000);
    }

    loadGraphFromLocalStorage() {
        const graphContent = localStorageManager.get(this.id);
        if (!graphContent) return false;
        this.loadJson(graphContent);
        return true;
    }
};

export default GraphLoadSave;
