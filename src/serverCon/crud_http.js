import ec from './config';

function getGraph(id) {
    return new Promise((resolve, reject) => {
        fetch(`${ec.baseURL + ec.getGraph(id)}`).then((x) => {
            resolve(x.text());
        }).catch((e) => reject(e));
    });
}

function postGraph(graphml) {
    return new Promise((resolve, reject) => {
        fetch(`${ec.baseURL + ec.postGraph}/`, {
            headers: {
                'Content-Type': 'application/xml',
            },
            method: 'POST',
            body: graphml,

        }).then((x) => {
            resolve(x.json());
        }).catch((e) => reject(e));
    });
}

function updateGraph(id, graphml, writeTime) {
    return new Promise((resolve, reject) => {
        fetch(ec.baseURL + ec.updateGraph(id), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/xml',
                'X-Write-Time': writeTime,
            },
            body: graphml,
        }).then((x) => {
            resolve(x.text());
        }).catch((e) => reject(e));
    });
}

function forceUpdateGraph(id, graphml) {
    return new Promise((resolve, reject) => {
        fetch(ec.baseURL + ec.updateGraph(id), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/xml',
            },
            body: graphml,
        }).then((x) => {
            resolve(x.text());
        }).catch((e) => reject(e));
    });
}

export {
    getGraph, postGraph, updateGraph, forceUpdateGraph,
};
