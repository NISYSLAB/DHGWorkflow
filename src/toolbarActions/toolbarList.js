/* eslint-disable object-curly-newline */
import {
    FaSave, FaUndo, FaRedo, FaTrash, FaFileImport, FaPlus, FaDownload, FaEdit, FaRegTimesCircle,
} from 'react-icons/fa';

import {
    createNode, editElement, deleteElem, downloadImg, saveAction,
    readFile, clearAll, undo, redo,
} from './toolbarFunctions';

const toolbarList = (state) => [
    { type: 'action', text: 'Node', icon: FaPlus, action: createNode, active: true },
    { type: 'vsep' },
    { type: 'file-upload', text: 'Open', icon: FaFileImport, action: readFile, active: true },
    { type: 'action', text: 'Save', icon: FaSave, action: saveAction, active: true },
    { type: 'action', text: 'Clear', icon: FaRegTimesCircle, action: clearAll, active: true },
    { type: 'vsep' },
    { type: 'action', text: 'Undo', icon: FaUndo, action: undo, active: state.undoEnabled },
    { type: 'action', text: 'Redo', icon: FaRedo, action: redo, active: state.redoEnabled },
    { type: 'vsep' },
    {
        type: 'action',
        text: 'Edit',
        icon: FaEdit,
        action: editElement,
        active: (state.eleSelected && state.eleSelectedPayload.type !== 'MIX'),
    },
    { type: 'action', text: 'Delete', icon: FaTrash, action: deleteElem, active: state.eleSelected },
    { type: 'vsep' },
    { type: 'space' },
    { type: 'menu', text: 'Download', icon: FaDownload, action: downloadImg, active: true },
    { type: 'vsep' },
];

export default toolbarList;
