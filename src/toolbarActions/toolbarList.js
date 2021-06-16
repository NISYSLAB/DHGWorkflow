import {
    FaSave, FaUndo, FaRedo, FaTrash, FaFileImport, FaPlus, FaDownload, FaEdit, FaRegTimesCircle,
} from 'react-icons/fa';

import {
    createNode, editElement, deleteElem, downloadImg, saveAction,
    readFile, clearAll, undo, redo,
} from './toolbarFunctions';

const toolbarList = (state) => [
    {
        type: 'action',
        text: 'Node',
        icon: FaPlus,
        action: createNode,
        active: true,
        hotkey: 'ctrl+g',
    },
    { type: 'vsep' },
    {
        type: 'file-upload',
        text: 'Open',
        icon: FaFileImport,
        action: readFile,
        active: true,
        hotkey: 'ctrl+o',
    },
    {
        type: 'action',
        text: 'Save',
        icon: FaSave,
        action: saveAction,
        active: true,
        hotkey: 'ctrl+s',
    },
    {
        type: 'action',
        text: 'Clear',
        icon: FaRegTimesCircle,
        action: clearAll,
        active: true,
        hotkey: 'ctrl+backspace',
    },
    { type: 'vsep' },
    {
        type: 'action',
        text: 'Undo',
        icon: FaUndo,
        action: undo,
        active: state.undoEnabled,
        hotkey: 'ctrl+z',
    },
    {
        type: 'action',
        text: 'Redo',
        icon: FaRedo,
        action: redo,
        active: state.redoEnabled,
        hotkey: 'ctrl+y,ctrl+shift+z',
    },
    { type: 'vsep' },
    {
        type: 'action',
        text: 'Edit',
        icon: FaEdit,
        action: editElement,
        active: (state.eleSelected && state.eleSelectedPayload.type !== 'MIX'),
        hotkey: 'ctrl+e',
    },
    {
        type: 'action',
        text: 'Delete',
        icon: FaTrash,
        action: deleteElem,
        active: state.eleSelected,
        hotkey: 'backspace,del,clear,delete',
    },
    { type: 'vsep' },
    { type: 'space' },
    {
        type: 'menu',
        text: 'Download',
        icon: FaDownload,
        action: downloadImg,
        active: true,
    },
    { type: 'vsep' },
];

export default toolbarList;
