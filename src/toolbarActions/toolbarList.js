/* eslint-disable object-curly-newline */
import { BiReset } from 'react-icons/bi';
import { ImZoomOut, ImZoomIn } from 'react-icons/im';
import {
    FaSave, FaUndo, FaRedo, FaTrash, FaFileExport, FaFileImport, FaPlus, FaDownload, FaEdit,
} from 'react-icons/fa';
import { dummyAction, createNode, editElement } from './toolbarFunctions';

const toolbarList = (state) => [
    { type: 'action', text: 'Node', icon: FaPlus, action: createNode, active: true },
    { type: 'vsep' },
    { type: 'action',
        text: 'Edit',
        icon: FaEdit,
        action: editElement,
        active: (state.eleSelected && state.eleSelectedPayload.type !== 'MIX'),
    },
    { type: 'action', text: 'Open', icon: FaFileImport, action: dummyAction, active: true },
    { type: 'action', text: 'Save', icon: FaSave, action: dummyAction, active: true },
    { type: 'vsep' },
    { type: 'action', text: 'Undo', icon: FaUndo, action: dummyAction, active: true },
    { type: 'action', text: 'Redo', icon: FaRedo, action: dummyAction, active: true },
    { type: 'vsep' },
    { type: 'action', text: 'Delete', icon: FaTrash, action: dummyAction, active: true },
    { type: 'vsep' },
    { type: 'action', text: 'In', icon: ImZoomOut, action: dummyAction, active: true },
    { type: 'action', text: 'Out', icon: ImZoomIn, action: dummyAction, active: true },
    { type: 'action', text: 'Reset', icon: BiReset, action: dummyAction, active: true },
    { type: 'space' },
    { type: 'action', text: 'JPG', icon: FaDownload, action: dummyAction, active: true },
    { type: 'action', text: 'PNG', icon: FaDownload, action: dummyAction, active: true },
    { type: 'vsep' },
    { type: 'action', text: 'Export', icon: FaFileExport, action: dummyAction, active: true },
];

export default toolbarList;
