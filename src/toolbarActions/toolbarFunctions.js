import CyFun from '../graph-builder';
import { actionType as T } from '../reducer';

const createNode = (_, setState) => {
    setState({
        type: T.Model_Open_Create_Node,
        cb: (label, style) => {
            CyFun.addNode(label, style, 'ordin', { x: 100, y: 100 });
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
            label: CyFun.getName(state.eleSelectedPayload.ids[0]),
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
            label: CyFun.getName(state.eleSelectedPayload.ids[0]),
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

// eslint-disable-next-line no-alert
const dummyAction = (x) => alert(x);

export {
    createNode, dummyAction, editElement, toggleDrawMode, deleteElem,
};
