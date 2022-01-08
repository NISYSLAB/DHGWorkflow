import { toast } from 'react-toastify';
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
                toast.success('Updated workflow on server successfully.', { position: 'bottom-center' });
            }).catch((e) => {
                toast.error(e, { position: 'bottom-center' });
            });
        } else {
            postGraph(this.getGraphML()).then((serverID) => {
                this.set({ serverID });
                this.cy.emit('graph-modified');
                toast.success('Saved workflow on server successfully.', { position: 'bottom-center' });
            }).catch((e) => {
                toast.error(e, { position: 'bottom-center' });
            });
        }
    }

    forcePushToServer() {
        // eslint-disable-next-line
        if (!window.confirm(
            'Forced push may result in workflow overwite and loss of changes pushed by others. Confirm?',
        )) return;
        if (this.serverID) {
            forceUpdateGraph(this.serverID, this.getGraphML()).then(() => {
                toast.success('(Force) Updated workflow on server successfully.', { position: 'bottom-center' });
            }).catch((e) => {
                toast.error(e, { position: 'bottom-center' });
            });
        } else {
            postGraph(this.getGraphML()).then((serverID) => {
                this.set({ serverID });
                toast.success('(Force) Saved workflow on server successfully.', { position: 'bottom-center' });
            }).catch((e) => {
                toast.error(e, { position: 'bottom-center' });
            });
        }
    }

    forcePullFromServer() {
        // eslint-disable-next-line
        if (!window.confirm(
            'Forced pull may result in workflow overwite and loss of unsaved changes. Confirm?',
        )) return;
        if (this.serverID) {
            getGraph(this.serverID).then((graphXML) => {
                this.setGraphML(graphXML);
                toast.success('Pulled workflow from server successfully.', { position: 'bottom-center' });
            }).catch((e) => {
                toast.error(e, { position: 'bottom-center' });
            });
        } else {
            toast.info('Please save to server first.', { position: 'bottom-center' });
        }
    }

    pullFromServer() {
        if (this.actionArr.length === 0) { this.forcePullFromServer(); return; }
        if (this.serverID) {
            getGraphWithHashCheck(this.serverID, this.actionArr.at(-1).hash).then((graphXML) => {
                this.setGraphML(graphXML);
                toast.success('(Force) Pulled workflow from successfully.', { position: 'bottom-center' });
            }).catch((e) => {
                toast.error(e, { position: 'bottom-center' });
            });
        } else {
            toast.info('Please save to server first.', { position: 'bottom-center' });
        }
    }

    setCurStatus() {
        super.setCurStatus();
        this.dispatcher({ type: T.IS_WORKFLOW_ON_SERVER, payload: Boolean(this.serverID) });
    }
}

export default GraphServer;
