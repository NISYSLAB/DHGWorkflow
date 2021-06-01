/* eslint-disable object-curly-newline */
import {
    FaSave, FaUndo, FaRedo, FaTrash, FaFileExport, FaFileImport, FaPlus, FaDownload, FaEdit,
} from 'react-icons/fa';
import { dummyAction, createNode, editElement, toggleDrawMode, deleteElem, downloadImg } from './toolbarFunctions';

const toolbarList = (state) => [
    { type: 'action', text: 'Node', icon: FaPlus, action: createNode, active: true },
    { type: 'vsep' },
    { type: 'action', text: 'Open', icon: FaFileImport, action: dummyAction, active: false },
    { type: 'action', text: 'Save', icon: FaSave, action: dummyAction, active: false },
    { type: 'vsep' },
    { type: 'action', text: 'Undo', icon: FaUndo, action: dummyAction, active: false },
    { type: 'action', text: 'Redo', icon: FaRedo, action: dummyAction, active: false },
    { type: 'vsep' },
    { type: 'action',
        text: 'Edit',
        icon: FaEdit,
        action: editElement,
        active: (state.eleSelected && state.eleSelectedPayload.type !== 'MIX'),
    },
    { type: 'action', text: 'Delete', icon: FaTrash, action: deleteElem, active: state.eleSelected },
    { type: 'vsep' },
    { type: 'switch', text: 'Draw', action: toggleDrawMode, active: state.drawModeOn },
    { type: 'space' },
    { type: 'menu', text: 'Download', icon: FaDownload, action: downloadImg, active: false },
    { type: 'vsep' },
    // { type: 'action', text: 'Export', icon: FaFileExport, action: dummyAction, active: false },
];

export default toolbarList;
