const zealit = require('zealit');

const actionType = {
    $$typeof: '',
    Model_Open_Create_Node: 'OpenModal_CreateNode',
    Model_Open_Create_Edge: 'OpenModal_CreateEdge',
    Model_Open_Update_Edge: 'OpenModal_UpdateEdge',
    Model_Open_Update_Node: 'OpenModal_UpdateNode',
    Model_Close: 'CloseModal',
    ELE_UNSELECTED: 'ELE_UNSELECTED',
    ELE_SELECTED: 'ELE_SELECTED',
    TURN_DRAW: 'TURN_DRAW',
};
export default zealit(actionType);
