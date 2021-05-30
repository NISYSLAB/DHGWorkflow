import CyFun from '../graph-builder';
import { actionType as T } from '../reducer';

const createNode = (_, setState) => {
    setState({
        type: T.Model_Open_Create_Node,
        cb: (name, style) => {
            CyFun.addNode(name, style, 'ordin', { x: 100, y: 100 });
        },
    });
};

const editElement = (state, setState) => {
    const shouldUpdateLabel = state.eleSelectedPayload.ids.length === 1;
    if (state.eleSelectedPayload.type === 'NODE') {
        setState({
            type: T.Model_Open_Update_Node,
            cb: (name, style) => CyFun.updateNode(state.eleSelectedPayload.ids, style, name, shouldUpdateLabel),
            nameAllowed: shouldUpdateLabel,
            name: CyFun.getName(state.eleSelectedPayload.ids[0]),
            style: CyFun.getStyle(state.eleSelectedPayload.ids[0]),
        });
    }
    if (state.eleSelectedPayload.type === 'EDGE') {
        setState({
            type: T.Model_Open_Update_Edge,
            cb: (name, style) => CyFun.updateEdge(state.eleSelectedPayload.ids, style, name, shouldUpdateLabel),
            nameAllowed: shouldUpdateLabel,
            name: CyFun.getName(state.eleSelectedPayload.ids[0]),
            style: CyFun.getStyle(state.eleSelectedPayload.ids[0]),
        });
    }
};
// eslint-disable-next-line no-alert
const dummyAction = (x) => alert(x);

export { createNode, dummyAction, editElement };
