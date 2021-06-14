import T from './actionType';
import NodeDetails from '../component/modals/NodeDetails';
import EdgeDetails from '../component/modals/EdgeDetails';
import { NodeStyle, EdgeStyle } from '../config/defaultStyles';
import { initialGraphState } from './initialState';

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

    case T.SET_UNDO: return { ...state, undoEnabled: action.payload };
    case T.SET_REDO: return { ...state, redoEnabled: action.payload };

    case T.ADD_GRAPH: {
        return {
            ...state,
            graphs: [
                ...state.graphs,
                {
                    ...initialGraphState,
                    component: action.payload.component,
                    projectDetails: action.payload.projectDetails,
                    id: action.payload.id,
                    instance: action.payload.instance,
                },
            ],
        };
    }
    case T.ADD_GRAPH_INSTANCE: {
        const newState = { ...state };
        newState.graphs[action.index].instance = action.instance;
        return { ...newState };
    }

    case T.NEW_GRAPH: return { ...state, curGraphIndex: state.graphs.length };
    case T.CHANGE_TAB: return { ...state, curGraphIndex: action.payload };
    case T.REMOVE_GRAPH: return {
        ...state,
        graphs: state.graphs.filter((e, i) => i !== action.payload),
        curGraphIndex: state.curGraphIndex < action.payload
            ? state.curGraphIndex
            : Math.max(0, state.curGraphIndex - 1),
    };

    case T.SET_PROJECT_DETAILS: {
        const newState = { ...state };
        newState.graphs = newState.graphs.map((g) => {
            if (g.id === action.payload.id) {
                if (g.instance) g.instance.setProjectDetail(action.payload.projectDetails);
                return { ...g, projectDetails: action.payload.projectDetails };
            }
            return g;
        });
        return { ...newState };
    }

    default:
        return state;
    }
};
export default reducer;
