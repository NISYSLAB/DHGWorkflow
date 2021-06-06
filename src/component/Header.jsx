import React from 'react';
import Switch from 'rc-switch';

import 'rc-switch/assets/index.css';
import {
    Menu,
    MenuItem,
    MenuButton,
} from '@szhsin/react-menu';
import toolbarList from '../toolbarActions/toolbarList';
import '@szhsin/react-menu/dist/index.css';
import './header.css';

function DropDown({
    Icon, text, action, active, tabIndex,
}) {
    return (
        <Menu menuButton={(
            <MenuButton>
                <ActionButton {...{
                    Icon, text, action, active, tabIndex,
                }}
                />
            </MenuButton>
        )}
        >
            <MenuItem onClick={() => action('JPG')}>JPG</MenuItem>
            <MenuItem onClick={() => action('PNG')}>PNG</MenuItem>
        </Menu>
    );
}

const FileUploader = ({
    Icon, text, action, active, tabIndex,
}) => {
    const fileRef = React.createRef();
    return (
        <>
            <input type="file" ref={fileRef} style={{ display: 'none' }} onChange={action} />
            <ActionButton {...{
                Icon, text, active, tabIndex, action: () => fileRef.current.click(),
            }}
            />
        </>
    );
};

const Switcher = ({
    text, action, active, tabIndex,
}) => (
    <div
        role="button"
        tabIndex={tabIndex}
        className={`tool ${active ? 'active' : ''}`}
        onClick={action}
        onKeyDown={(ev) => ev.key === 13 && action()}
    >
        <Switch
            onChange={action}
            checked={active}
            className="react-switch"
        />
        <div>
            {text}
        </div>
    </div>
);

const ActionButton = ({
    Icon, text, action, active, tabIndex,
}) => (
    <div
        role="button"
        tabIndex={tabIndex}
        className={`tool ${active ? 'active' : ''}`}
        onClick={() => (active && action())}
        onKeyDown={(ev) => ev.key === 13 && action()}
    >
        <div className="icon"><Icon size="25" /></div>
        <div style={{ fontSize: 16 }}>{text}</div>
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
            {title ? `${title} - DHGWorkflow Editor` : ''}
        </section>
        <section className="toolbar">
            {
                toolbarList(state, dispatcher).map((tool, i) => {
                    if (tool.type === 'vsep') return <Vsep key={`${`v${i}`}`} />;
                    if (tool.type === 'space') return <Space key={`${`s${i}`}`} />;
                    if (tool.type === 'switch') {
                        return (
                            <Switcher
                                text={tool.text}
                                active={tool.active}
                                action={() => tool.action(state, dispatcher)}
                                key={tool.text}
                                tabIndex={i + 1}
                            />
                        );
                    }
                    if (tool.type === 'menu') {
                        return (
                            <DropDown
                                Icon={tool.icon}
                                text={tool.text}
                                active={tool.active}
                                action={(e) => tool.action(state, dispatcher, e)}
                                key={tool.text}
                                tabIndex={i + 1}
                            />
                        );
                    }
                    if (tool.type === 'file-upload') {
                        return (
                            <FileUploader
                                Icon={tool.icon}
                                text={tool.text}
                                active={tool.active}
                                action={(e) => tool.action(e, state, dispatcher)}
                                key={tool.text}
                                tabIndex={i + 1}
                            />
                        );
                    }
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
            <input type="file" id="fileUploader" style={{ display: 'none' }} accept=".jpg, .jpeg, .png" />
        </section>
        <Hsep />
    </header>

);

// var fr = new FileReader();
// fr.onload = function(e) {
//     console.log(e.target.result);
// };
// fr.readAsText(file);
export {
    Header, ActionButton, Vsep, Hsep, Space, TextBox,
};
