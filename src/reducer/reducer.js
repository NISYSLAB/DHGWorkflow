import T from './actionType';

const reducer = (state, action) => {
    if (action.type === T.OpenModal) {
        return {
            ...state, ModelOpen: true, modelCallback: action.modelCallback, isEdge: action.isEdge,
        };
    }
    if (action.type === T.CloseModal) {
        return { ...state, ModelOpen: false };
    }
    return state;
};
export default reducer;
