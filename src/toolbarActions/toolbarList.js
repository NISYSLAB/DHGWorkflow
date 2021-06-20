import {
    FaSave, FaUndo, FaRedo, FaTrash, FaFileImport, FaPlus, FaDownload, FaEdit, FaRegTimesCircle, FaShare,
} from 'react-icons/fa';

import {
    createNode, editElement, deleteElem, downloadImg, saveAction,
    readFile, clearAll, undo, redo, openShareModal,
} from './toolbarFunctions';

const toolbarList = (state) => [
    {
        type: 'action',
        text: 'Node',
        icon: FaPlus,
        action: createNode,
        active: true,
        hotkey: 'Ctrl+G',
    },
    { type: 'vsep' },
    {
        type: 'file-upload',
        text: 'Open',
        icon: FaFileImport,
        action: readFile,
        active: true,
        hotkey: 'Ctrl+O',
    },
    {
        type: 'action',
        text: 'Save',
        icon: FaSave,
        action: saveAction,
        active: true,
        hotkey: 'Ctrl+S',
    },
    {
        type: 'action',
        text: 'Clear',
        icon: FaRegTimesCircle,
        action: clearAll,
        active: true,
        hotkey: 'Ctrl+Backspace',
    },
    { type: 'vsep' },
    {
        type: 'action',
        text: 'Undo',
        icon: FaUndo,
        action: undo,
        active: state.undoEnabled,
        hotkey: 'Ctrl+Z',
    },
    {
        type: 'action',
        text: 'Redo',
        icon: FaRedo,
        action: redo,
        active: state.redoEnabled,
        hotkey: 'Ctrl+Shift+Z,Ctrl+Y',
    },
    { type: 'vsep' },
    {
        type: 'action',
        text: 'Edit',
        icon: FaEdit,
        action: editElement,
        active: (state.eleSelected && state.eleSelectedPayload.type !== 'MIX'),
        hotkey: 'Ctrl+E',
    },
    {
        type: 'action',
        text: 'Delete',
        icon: FaTrash,
        action: deleteElem,
        active: state.eleSelected,
        hotkey: 'Delete,Backspace,Del,Clear',
    },
    { type: 'vsep' },
    { type: 'space' },
    {
        type: 'action',
        text: 'Share',
        icon: FaShare,
        action: openShareModal,
        active: true,
    },
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
