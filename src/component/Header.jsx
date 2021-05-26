import React from 'react';
import './header.css';

const ActionButton = ({
    Icon, text, action, active,
}) => (
    <div
        role="button"
        tabIndex={0}
        className={`tool ${active ? 'active' : ''}`}
        onClick={action}
        onKeyDown={(ev) => ev.key === 13 && action()}
    >
        <div className="icon"><Icon size="25" /></div>
        <div>{text}</div>
    </div>
);

const TextBox = ({ children }) => (
    <div className="tool" style={{ width: 'auto' }}>
        <div className="middle tool-text-only" style={{ fontSize: 16, color: '#888', height: '100%' }}>
            {children}
        </div>
    </div>
);

const Vsep = () => <div className="Vsep sep" />;
const Hsep = () => <div className="hsep sep" />;
const Space = () => <div className="space" />;

const Header = ({ children, title }) => (
    <header className="header">
        <section className="middle titlebar">
            {title}
            - LoopSim Editor
        </section>
        <section className="toolbar">
            {children}
        </section>
        <Hsep />
    </header>

);

export {
    Header, ActionButton, Vsep, Hsep, Space, TextBox,
};
