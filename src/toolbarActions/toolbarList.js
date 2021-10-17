/* eslint-disable no-alert */
import {
    FaSave, FaUndo, FaRedo, FaTrash, FaFileImport, FaPlus, FaDownload, FaEdit, FaRegTimesCircle, FaShare, FaRegSun,
    FaHistory,
} from 'react-icons/fa';

import {
    FiChevronDown, FiChevronsDown, FiChevronsUp, FiChevronUp,
} from 'react-icons/fi';

import {
    createNode, editElement, deleteElem, downloadImg, saveAction,
    readFile, clearAll, undo, redo, openShareModal, openSettingModal,
    viewHistory,
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
        type: 'menu',
        text: 'Save',
        icon: FaSave,
        action: (s, d) => [
            { fn: () => state.curGraphInstance && state.curGraphInstance.pushToServer(), name: 'Save on Server' },
            { fn: () => saveAction(s, d), name: 'Save' },
            { fn: () => saveAction(s, d, prompt('File Name:')), name: 'Save As' },
        ],
        active: true,
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
    {
        type: 'action',
        text: 'History',
        icon: FaHistory,
        action: viewHistory,
        active: true,
    },
    { type: 'vsep' },
    {
        type: 'action',
        text: 'Push',
        icon: FiChevronUp,
        action: () => state.curGraphInstance && state.curGraphInstance.pushToServer(),
        active: state.curGraphInstance && state.isWorkflowOnServer,
    },
    {
        type: 'action',
        text: 'Pull',
        icon: FiChevronDown,
        action: () => state.curGraphInstance && state.curGraphInstance.pullFromServer(),
        active: state.curGraphInstance && state.isWorkflowOnServer,
    },
    {
        type: 'action',
        text: 'Force Push',
        icon: FiChevronsUp,
        action: () => state.curGraphInstance && state.curGraphInstance.forcePushToServer(),
        active: state.curGraphInstance && state.isWorkflowOnServer,
    },
    {
        type: 'action',
        text: 'Force Pull',
        icon: FiChevronsDown,
        action: () => state.curGraphInstance && state.curGraphInstance.forcePullFromServer(),
        active: state.curGraphInstance && state.isWorkflowOnServer,
    },
    { type: 'vsep' },
    { type: 'space' },
    {
        type: 'action',
        text: 'Settings',
        icon: FaRegSun,
        action: openSettingModal,
        active: true,
    },
    {
        type: 'action',
        text: 'Share',
        icon: FaShare,
        action: openShareModal,
        active: true,
    },
    {
        type: 'menu',
        text: 'Export',
        icon: FaDownload,
        action: (s, d) => [
            { fn: () => downloadImg(s, d, 'JPG'), name: 'JPG' },
            { fn: () => downloadImg(s, d, 'PNG'), name: 'PNG' },
        ],
        active: true,
    },
    { type: 'vsep' },
];

export default toolbarList;
