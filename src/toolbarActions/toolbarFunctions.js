import { actionType as T } from '../reducer';
import initialState from '../reducer/initialState';

// const getGraphFun(state) = {};
const getGraphFun = (state) => state.graphObject;

const createNode = (state, setState) => {
    setState({
        type: T.Model_Open_Create_Node,
        cb: (label, style) => {
            getGraphFun(state).addNode(label, style);
        },
    });
};

const editElement = (state, setState) => {
    const shouldUpdateLabel = state.eleSelectedPayload.ids.length === 1;
    const tid = new Date().getTime();
    if (state.eleSelectedPayload.type === 'NODE') {
        setState({
            type: T.Model_Open_Update_Node,
            cb: (label, style) => state.eleSelectedPayload.ids.forEach(
                (id) => getGraphFun(state).updateNode(id, style, label, shouldUpdateLabel, tid),
            ),
            labelAllowed: shouldUpdateLabel,
            label: getGraphFun(state).getLabel(state.eleSelectedPayload.ids[0]),
            style: getGraphFun(state).getStyle(state.eleSelectedPayload.ids[0]),
        });
    }
    if (state.eleSelectedPayload.type === 'EDGE') {
        setState({
            type: T.Model_Open_Update_Edge,
            cb: (label, style) => state.eleSelectedPayload.ids.forEach(
                (id) => getGraphFun(state).updateEdge(id, style, label, shouldUpdateLabel, tid),
            ),
            labelAllowed: shouldUpdateLabel,
            label: getGraphFun(state).getLabel(state.eleSelectedPayload.ids[0]),
            style: getGraphFun(state).getStyle(state.eleSelectedPayload.ids[0]),
        });
    }
};

// const toggleDrawMode = (state, setState) => {
//     getGraphFun(state).enableDraw(!state.drawModeOn);
//     setState({ type: T.TURN_DRAW, payload: !state.drawModeOn });
// };

const deleteElem = (state) => {
    const tid = new Date().getTime();
    state.eleSelectedPayload.ids.forEach((id) => getGraphFun(state).deleteElem(id, tid));
};

const downloadImg = (state, setState, format) => {
    getGraphFun(state).downloadImg(format);
};

const saveAction = (state) => {
    getGraphFun(state).saveToDisk();
};

const readFile = (state, setState, e) => {
    if (e.target && e.target.files && e.target.files[0]) {
        const fr = new FileReader();
        fr.onload = (x) => {
            getGraphFun(state).loadJson(JSON.parse(x.target.result));
        };
        fr.readAsText(e.target.files[0]);
    }
};

const newProject = (state, setState) => {
    if (getGraphFun(state).clearAll()) {
        setState({ type: T.SET_PROJECT_DETAILS, payload: initialState.projectDetails });
    }
};

const clearAll = (state) => {
    getGraphFun(state).clearAll();
};

const editDetails = (state, setState) => {
    setState({ type: T.SET_PROJECT_DETAILS, payload: { ...state.projectDetails, set: false } });
};
const undo = (state) => {
    getGraphFun(state).undo();
};
const redo = (state) => {
    getGraphFun(state).redo();
};

export {
    createNode, editElement, deleteElem, downloadImg, saveAction,
    readFile, newProject, clearAll, editDetails, undo, redo,
};
