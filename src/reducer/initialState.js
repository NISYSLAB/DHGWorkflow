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
    shareModal: false,
    graphs: [],
    curGraphIndex: 0,
    settingsModal: false,
    viewHistory: false,
    authorName: '',
    isWorkflowOnServer: false,
    curGraphInstance: null,
    zoomLevel: 100,
};

const initialGraphState = {
    projectDetails: {
        projectName: '',
        set: false,
    },
    component: null,
    instance: null,
    id: null,
    serverID: null,
};

export { initialState, initialGraphState };
