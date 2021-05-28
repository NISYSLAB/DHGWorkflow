import CyFun from '../functions/graph-builder';
import { actionType as T } from '../reducer';

const createNode = (state, setState) => {
    setState({
        type: T.OpenModal,
        modelCallback: (name) => {
            CyFun.addNode(name, {}, 'ordin', { x: 100, y: 100 });
        },
    });
};
// eslint-disable-next-line no-alert
const dummyAction = (x) => alert(x);

export { createNode, dummyAction };
