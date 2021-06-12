const initialState = {
    ModelOpen: false,
    modalPayload: {
        cb: () => {},
        title: '',
        submitText: '',
        Children: '',
        defaultStyle: {},
        defaultLabel: '',
        labelAllowed: null,
    },
    eleSelected: false,
    drawModeOn: true,
    undoEnabled: false,
    redoEnabled: false,
    graphs: [],
    curGraphIndex: 0,
};

const initialGraphState = {
    projectDetails: {
        name: '',
        author: '',
        set: false,
    },
    component: null,
    instance: null,
};

export { initialState, initialGraphState };
