import { actionType as T } from '../../reducer';
import GraphLoadSave from './5-load-save';
import {
    postGraph, updateGraph, forceUpdateGraph, getGraph,
} from '../../serverCon/crud_http';

class GraphServer extends GraphLoadSave {
    constructor(...args) {
        super(...args);
        this.serverWriteTime = null;
    }

    set(config) {
        const { serverID, serverWriteTime } = config;
        super.set(config);
        if (serverWriteTime) this.serverWriteTime = serverWriteTime;
        if (serverID) {
            this.setServerID(serverID);
            this.dispatcher({ type: T.IS_WORKFLOW_ON_SERVER, payload: Boolean(this.serverID) });
        }
    }

    pushToServer() {
        if (this.serverID && this.serverWriteTime) {
            updateGraph(this.serverID, this.getGraphML(), this.serverWriteTime).then((res) => {
                this.set({ serverWriteTime: res });
            });
        } else {
            postGraph(this.getGraphML()).then((res) => {
                this.set({ serverID: res.workflowId, serverWriteTime: res.writeTime });
                this.cy.emit('graph-modified');
            });
        }
    }

    forcePushToServer() {
        if (this.serverID && this.serverWriteTime) {
            forceUpdateGraph(this.serverID, this.getGraphML(), this.serverWriteTime).then((res) => {
                this.set({ serverWriteTime: res });
            });
        } else {
            postGraph(this.getGraphML()).then((res) => {
                this.set({ serverID: res.workflowId, serverWriteTime: res.writeTime });
            });
        }
    }

    forcePullFromServer() {
        const { serverID } = this;
        if (serverID) {
            getGraph(serverID).then((graphXML) => {
                this.setGraphML(graphXML);
            });
        } else {
            // eslint-disable-next-line no-alert
            alert('Not on server');
        }
    }

    pullFromServer() {
        this.forcePullFromServer();
    }

    setCurStatus() {
        super.setCurStatus();
        this.dispatcher({ type: T.IS_WORKFLOW_ON_SERVER, payload: Boolean(this.serverID) });
    }
}

export default GraphServer;
