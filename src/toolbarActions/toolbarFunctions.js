import CyFun from '../graph-builder';
import { actionType as T } from '../reducer';
import initialState from '../reducer/initialState';

const createNode = (_, setState) => {
    setState({
        type: T.Model_Open_Create_Node,
        cb: (label, style) => {
            CyFun.addNode(label, style);
        },
    });
};

const editElement = (state, setState) => {
    const shouldUpdateLabel = state.eleSelectedPayload.ids.length === 1;
    if (state.eleSelectedPayload.type === 'NODE') {
        setState({
            type: T.Model_Open_Update_Node,
            cb: (label, style) => state.eleSelectedPayload.ids.forEach(
                (id) => CyFun.updateNode(id, style, label, shouldUpdateLabel),
            ),
            labelAllowed: shouldUpdateLabel,
            label: CyFun.getLabel(state.eleSelectedPayload.ids[0]),
            style: CyFun.getStyle(state.eleSelectedPayload.ids[0]),
        });
    }
    if (state.eleSelectedPayload.type === 'EDGE') {
        setState({
            type: T.Model_Open_Update_Edge,
            cb: (label, style) => state.eleSelectedPayload.ids.forEach(
                (id) => CyFun.updateEdge(id, style, label, shouldUpdateLabel),
            ),
            labelAllowed: shouldUpdateLabel,
            label: CyFun.getLabel(state.eleSelectedPayload.ids[0]),
            style: CyFun.getStyle(state.eleSelectedPayload.ids[0]),
        });
    }
};

const toggleDrawMode = (state, setState) => {
    CyFun.enableDraw(!state.drawModeOn);
    setState({ type: T.TURN_DRAW, payload: !state.drawModeOn });
};

const deleteElem = (state) => {
    state.eleSelectedPayload.ids.forEach((id) => CyFun.deleteElem(id));
};

const downloadImg = (state, setState, format) => {
    CyFun.downloadImg(format);
};

const saveAction = () => {
    CyFun.saveToDisk();
};

const readFile = (e) => {
    if (e.target && e.target.files && e.target.files[0]) {
        const fr = new FileReader();
        fr.onload = (x) => {
            CyFun.loadJson(JSON.parse(x.target.result));
        };
        fr.readAsText(e.target.files[0]);
    }
};

const newProject = (state, setState) => {
    if (CyFun.clearAll()) {
        setState({ type: T.SET_PROJECT_DETAILS, payload: initialState.projectDetails });
    }
};

const clearAll = () => {
    CyFun.clearAll();
};

const editDetails = (state, setState) => {
    setState({ type: T.SET_PROJECT_DETAILS, payload: { ...state.projectDetails, set: false } });
};

// eslint-disable-next-line no-alert
const dummyAction = (x) => alert(x);

export {
    createNode, dummyAction, editElement, toggleDrawMode, deleteElem,
    downloadImg, saveAction, readFile, newProject, clearAll, editDetails,
};
