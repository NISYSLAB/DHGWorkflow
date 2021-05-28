import React from 'react';
import './header.css';
import toolbarList from '../toolbarActions/toolbarList';

const ActionButton = ({
    Icon, text, action, active, tabIndex,
}) => (
    <div
        role="button"
        tabIndex={tabIndex}
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

const Header = ({ title, state, dispatcher }) => (
    <header className="header">
        <section className="middle titlebar">
            {`${title} - DHGWorkflow Editor`}
        </section>
        <section className="toolbar">
            {
                toolbarList(state, dispatcher).map((tool, i) => {
                    if (tool.type === 'vsep') return <Vsep key={`${`v${i}`}`} />;
                    if (tool.type === 'space') return <Space key={`${`s${i}`}`} />;
                    return (
                        <ActionButton
                            Icon={tool.icon}
                            text={tool.text}
                            active={tool.active}
                            action={() => tool.action(state, dispatcher)}
                            key={tool.text}
                            tabIndex={i + 1}
                        />
                    );
                })
            }
        </section>
        <Hsep />
    </header>

);

export {
    Header, ActionButton, Vsep, Hsep, Space, TextBox,
};
