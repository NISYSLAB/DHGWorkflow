import {
    postGraph, updateGraph, forceUpdateGraph, getGraph,
} from '../serverCon/crud_http';
import graphMLParser from '../graph-builder/graphml/parser';

const getGraphFun = (superState) => superState.graphs[superState.curGraphIndex]
                                        && superState.graphs[superState.curGraphIndex].instance;

function pushToServer(state) {
    const curG = getGraphFun(state);
    if (curG.serverID && curG.serverWriteTime) {
        updateGraph(curG.serverID, curG.getGraphML(), curG.serverWriteTime).then((res) => {
            curG.set({ serverWriteTime: res });
        });
    } else {
        postGraph(curG.getGraphML()).then((res) => {
            curG.set({ serverID: res.workflowId, serverWriteTime: res.writeTime });
            curG.cy.emit('graph-modified');
        });
    }
}

function forcePushToServer(state) {
    const curG = getGraphFun(state);
    if (curG.serverID && curG.serverWriteTime) {
        forceUpdateGraph(curG.serverID, curG.getGraphML(), curG.serverWriteTime).then((res) => {
            curG.set({ serverWriteTime: res });
        });
    } else {
        postGraph(curG.getGraphML()).then((res) => {
            curG.set({ serverID: res.workflowId, serverWriteTime: res.writeTime });
        });
    }
}

function forcePullFromServer(state) {
    const curG = getGraphFun(state);
    if (curG.serverID) {
        getGraph(curG.serverID).then((graphXML) => {
            graphMLParser(graphXML).then((graphObject) => {
                curG.setGraphML(graphObject);
            });
        });
        // graphMLParser(graphXML);
        // console.log(graphMLParser(graphXML));
        // curG.setGraphML(graphMLParser(graphXML));
    } else {
        // eslint-disable-next-line no-alert
        alert('Not on server');
    }
}

function pullFromServer(state) {
    forcePullFromServer(state);
}

export {
    pushToServer, forcePushToServer, pullFromServer, forcePullFromServer,
};
