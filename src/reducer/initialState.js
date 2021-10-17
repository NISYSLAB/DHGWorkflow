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
    shareModal: false,
    settingsModal: false,
    editDetailsModal: false,
    newGraphModal: false,

    eleSelected: false,
    drawModeOn: true,
    undoEnabled: false,
    redoEnabled: false,
    graphs: [],
    curGraphIndex: 0,
    viewHistory: false,
    authorName: '',
    isWorkflowOnServer: false,
    curGraphInstance: null,
    zoomLevel: 100,
};

const initialGraphState = {
    projectName: '',
    graphID: null,
    serverID: null,
    graphML: null,

    component: null,
    instance: null,
    id: null,
};

export { initialState, initialGraphState };
