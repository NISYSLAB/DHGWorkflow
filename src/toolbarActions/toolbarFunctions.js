import { actionType as T } from '../reducer';

const getGraphFun = (superState) => superState.curGraphInstance;

const createNode = (state, setState) => {
    setState({
        type: T.Model_Open_Create_Node,
        cb: (label, style) => {
            const message = getGraphFun(state).validiateNode(label, style, null, 'New');
            if (message.ok) getGraphFun(state).addNode(label, style);
            return message;
        },
    });
};

const editElement = (state, setState) => {
    const shouldUpdateLabel = state.eleSelectedPayload.ids.length === 1;
    const tid = new Date().getTime();
    if (state.eleSelectedPayload.type === 'NODE') {
        setState({
            type: T.Model_Open_Update_Node,
            cb: (label, style) => {
                const retMessage = { ok: true, err: null };
                state.eleSelectedPayload.ids.forEach((id) => {
                    const message = getGraphFun(state).validiateNode(
                        shouldUpdateLabel ? label : null, style, id, 'Update',
                    );
                    retMessage.ok = retMessage.ok && message.ok;
                    retMessage.err = retMessage.err || message.err;
                });
                if (retMessage.ok) {
                    state.eleSelectedPayload.ids.forEach(
                        (id) => getGraphFun(state).updateNode(id, style, label, shouldUpdateLabel, tid),
                    );
                }
                return retMessage;
            },
            labelAllowed: shouldUpdateLabel,
            label: getGraphFun(state).getLabel(state.eleSelectedPayload.ids[0]),
            style: getGraphFun(state).getStyle(state.eleSelectedPayload.ids[0]),
        });
    }
    if (state.eleSelectedPayload.type === 'EDGE') {
        setState({
            type: T.Model_Open_Update_Edge,
            cb: (label, style) => {
                const retMessage = { ok: true, err: null };
                state.eleSelectedPayload.ids.forEach((id) => {
                    const message = getGraphFun(state).validiateEdge(
                        shouldUpdateLabel ? label : null, style, null, null, id, 'Update',
                    );
                    retMessage.ok = retMessage.ok && message.ok;
                    retMessage.err = retMessage.err || message.err;
                });
                if (retMessage.ok) {
                    state.eleSelectedPayload.ids.forEach(
                        (id) => getGraphFun(state).updateEdge(id, style, label, shouldUpdateLabel, tid),
                    );
                }
                return retMessage;
            },
            labelAllowed: shouldUpdateLabel,
            label: getGraphFun(state).getLabel(state.eleSelectedPayload.ids[0]),
            style: getGraphFun(state).getStyle(state.eleSelectedPayload.ids[0]),
        });
    }
};

const deleteElem = (state) => {
    const tid = new Date().getTime();
    state.eleSelectedPayload.ids.forEach((id) => getGraphFun(state).deleteElem(id, tid));
};

const downloadImg = (state, setState, format) => {
    getGraphFun(state).downloadImg(format);
};

const saveAction = (state, d, fileName) => {
    getGraphFun(state).saveToDisk(fileName);
};

const readFile = (state, setState, e) => {
    if (e.target && e.target.files && e.target.files[0]) {
        const fr = new FileReader();
        const projectName = e.target.files[0]
            .name.split('.').slice(0, -1).join('.').split('-')[0];
        fr.onload = (x) => {
            setState({
                type: T.ADD_GRAPH,
                payload: { projectName, graphML: x.target.result },
            });
        };
        fr.readAsText(e.target.files[0]);
    }
};

const newProject = (state, setState) => {
    setState({ type: T.NEW_GRAPH });
};

const clearAll = (state) => {
    getGraphFun(state).clearAll();
};

const editDetails = (state, setState) => {
    setState({
        type: T.SET_EDIT_DETAILS_MODAL,
        payload: true,
    });
};

const undo = (state) => {
    if (getGraphFun(state))getGraphFun(state).undo();
};
const redo = (state) => {
    getGraphFun(state).redo();
};

const openShareModal = (state, setState) => {
    setState({ type: T.SET_SHARE_MODAL, payload: true });
};

const openSettingModal = (state, setState) => {
    setState({ type: T.SET_SETTING_MODAL, payload: true });
};

const viewHistory = (state, setState) => {
    setState({ type: T.SET_HISTORY_MODAL, payload: true });
};

export {
    createNode, editElement, deleteElem, downloadImg, saveAction,
    readFile, newProject, clearAll, editDetails, undo, redo,
    openShareModal, openSettingModal, viewHistory,
};
