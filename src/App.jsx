import React from 'react';
import './App.css';
import {
    FaSave, FaUndo, FaRedo, FaTrash, FaFileExport, FaFileImport, FaPlus, FaDownload, FaEdit,
} from 'react-icons/fa';
import { BiReset } from 'react-icons/bi';
import { ImZoomOut, ImZoomIn } from 'react-icons/im';
import {
    Header, ActionButton, Vsep, Space, TextBox,
} from './component/Header';

const app = () => (
    <div>
        <Header title="MyGraph">
            <ActionButton Icon={FaPlus} text="Node" />
            <ActionButton Icon={FaEdit} text="Edit" />
            <Vsep />
            <ActionButton Icon={FaFileImport} text="Open" />
            <ActionButton Icon={FaSave} text="Save" />
            <Vsep />
            <ActionButton Icon={FaUndo} text="Undo" />
            <ActionButton Icon={FaRedo} text="Redo" />
            <Vsep />
            <ActionButton Icon={FaTrash} text="Delete" />
            <Vsep />
            <ActionButton Icon={ImZoomOut} text="In" />
            <ActionButton Icon={ImZoomIn} text="Out" />
            <ActionButton Icon={BiReset} text="Reset" />
            <TextBox>100%</TextBox>
            <Space />
            <ActionButton Icon={FaDownload} text="JPG" />
            <ActionButton Icon={FaDownload} text="PNG" />
            <Vsep />
            <ActionButton Icon={FaFileExport} text="Export" />
        </Header>
        <section className="body">
            <div className="graph-container" />
        </section>
    </div>
);

export default app;
