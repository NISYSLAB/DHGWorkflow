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
    zoomValue: 100,
    projectDetails: {
        name: '',
        author: '',
        set: false,
    },
    undoEnabled: false,
    redoEnabled: false,
};

export default initialState;
