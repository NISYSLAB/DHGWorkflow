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

// eslint-disable-next-line
const dummyAction = () => alert('Dummy Action activated.');

const app = () => (
    <div>
        <Header title="MyGraph">
            <ActionButton Icon={FaPlus} text="Node" active action={dummyAction} />
            <ActionButton Icon={FaEdit} text="Edit" active action={dummyAction} />
            <Vsep />
            <ActionButton Icon={FaFileImport} text="Open" active action={dummyAction} />
            <ActionButton Icon={FaSave} text="Save" active action={dummyAction} />
            <Vsep />
            <ActionButton Icon={FaUndo} text="Undo" active action={dummyAction} />
            <ActionButton Icon={FaRedo} text="Redo" action={dummyAction} />
            <Vsep />
            <ActionButton Icon={FaTrash} text="Delete" action={dummyAction} />
            <Vsep />
            <ActionButton Icon={ImZoomOut} text="In" active action={dummyAction} />
            <ActionButton Icon={ImZoomIn} text="Out" active action={dummyAction} />
            <ActionButton Icon={BiReset} text="Reset" active action={dummyAction} />
            <TextBox>100%</TextBox>
            <Space />
            <ActionButton Icon={FaDownload} text="JPG" active action={dummyAction} />
            <ActionButton Icon={FaDownload} text="PNG" active action={dummyAction} />
            <Vsep />
            <ActionButton Icon={FaFileExport} text="Export" />
        </Header>
        <section className="body">
            <div className="graph-container" />
        </section>
    </div>
);

export default app;
