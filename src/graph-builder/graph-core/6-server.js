import { actionType as T } from '../../reducer';
import GraphLoadSave from './5-load-save';
import {
    postGraph, updateGraph, forceUpdateGraph, getGraph, getGraphWithHashCheck,
} from '../../serverCon/crud_http';

class GraphServer extends GraphLoadSave {
    set(config) {
        const { serverID } = config;
        super.set(config);
        if (serverID) {
            this.setServerID(serverID);
            this.dispatcher({ type: T.IS_WORKFLOW_ON_SERVER, payload: Boolean(this.serverID) });
        }
    }

    pushToServer() {
        if (this.serverID) {
            updateGraph(this.serverID, this.getGraphML()).then(() => {

            });
        } else {
            postGraph(this.getGraphML()).then((serverID) => {
                this.set({ serverID });
                this.cy.emit('graph-modified');
            });
        }
    }

    forcePushToServer() {
        if (this.serverID) {
            forceUpdateGraph(this.serverID, this.getGraphML()).then(() => {

            });
        } else {
            postGraph(this.getGraphML()).then((serverID) => {
                this.set({ serverID });
            });
        }
    }

    forcePullFromServer() {
        if (this.serverID) {
            getGraph(this.serverID).then((graphXML) => {
                this.setGraphML(graphXML);
            });
        } else {
            // eslint-disable-next-line no-alert
            alert('Not on server');
        }
    }

    pullFromServer() {
        if (this.actionArr.length === 0) { this.forcePullFromServer(); return; }
        if (this.serverID) {
            getGraphWithHashCheck(this.serverID, this.actionArr.at(-1).hash).then((graphXML) => {
                this.setGraphML(graphXML);
            }).catch(() => {

            });
        } else {
            // eslint-disable-next-line no-alert
            alert('Not on server');
        }
    }

    setCurStatus() {
        super.setCurStatus();
        this.dispatcher({ type: T.IS_WORKFLOW_ON_SERVER, payload: Boolean(this.serverID) });
    }
}

export default GraphServer;
