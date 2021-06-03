import T from './actionType';
import NodeDetails from '../component/NodeDetails';
import EdgeDetails from '../component/EdgeDetails';
import { NodeStyle, EdgeStyle } from '../config/defaultStyles';

const reducer = (state, action) => {
    switch (action.type) {
    case T.Model_Open_Create_Node:
        return {
            ...state,
            ModelOpen: true,
            modalPayload: {
                title: 'Create Node',
                submitText: 'Create Node',
                Children: NodeDetails,
                defaultStyle: NodeStyle,
                defaultLabel: '',
                labelAllowed: true,
                cb: action.cb,
            },
        };
    case T.Model_Open_Create_Edge:
        return {
            ...state,
            ModelOpen: true,
            modalPayload: {
                title: 'Create Edge',
                submitText: 'Create Edge',
                Children: EdgeDetails,
                defaultStyle: EdgeStyle,
                defaultLabel: '',
                labelAllowed: true,
                cb: action.cb,
            },
        };
    case T.Model_Open_Update_Node: {
        return {
            ...state,
            ModelOpen: true,
            modalPayload: {
                title: 'Edit Node',
                submitText: 'Edit Node',
                Children: NodeDetails,
                defaultStyle: action.style,
                defaultLabel: action.label,
                labelAllowed: action.labelAllowed,
                cb: action.cb,
            },
        };
    }
    case T.Model_Open_Update_Edge: {
        return {
            ...state,
            ModelOpen: true,
            modalPayload: {
                title: 'Edit Edge',
                submitText: 'Edit Edge',
                Children: EdgeDetails,
                defaultStyle: action.style,
                defaultLabel: action.label,
                labelAllowed: action.labelAllowed,
                cb: action.cb,
            },
        };
    }
    case T.Model_Close: return { ...state, ModelOpen: false };
    case T.ELE_SELECTED: return { ...state, eleSelected: true, eleSelectedPayload: action.payload };
    case T.ELE_UNSELECTED: return { ...state, eleSelected: false };
    case T.TURN_DRAW: return { ...state, drawModeOn: action.payload };

    case T.SET_ZOOM: return { ...state, zoomValue: action.payload };
    default:
        return state;
    }
};
export default reducer;
