/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import hotkeys from 'hotkeys-js';
import 'rc-switch/assets/index.css';
import toolbarList from '../toolbarActions/toolbarList';
import '@szhsin/react-menu/dist/index.css';
import './header.css';
import {
    ActionButton, Vsep, Hsep, Space, TextBox, Switcher, DropDown, FileUploader,
} from './HeaderComps';

const setHotKeys = (actions) => {
    let keys = '';
    const map = {};
    actions.forEach((action, i) => {
        if (action.hotkey) {
            action.hotkey.split(',').forEach((key) => {
                [key, key.replace('ctrl', 'command')].forEach((k) => {
                    keys += `${k},`;
                    map[k] = document.getElementById(`action_${i + 1}`);
                });
            });
        }
    });
    hotkeys(keys, (event, handler) => {
        event.preventDefault();
        map[handler.shortcut].click();
    });
};

const Header = ({ state, dispatcher }) => {
    const actions = toolbarList(state);
    React.useEffect(() => {
        setHotKeys(actions, state, dispatcher);
    }, []);

    return (
        <header className="header">
            <section className="middle titlebar">
                {
                    state.graphs[state.curGraphIndex]
                        ? `${state.graphs[state.curGraphIndex].projectDetails.projectName} - DHGWorkflow Editor` : ''
                }
            </section>
            <section className="toolbar">
                {
                    actions.map(({
                        text, active, action, icon, type,
                    }, i) => {
                        const props = {
                            text,
                            active,
                            tabIndex: i + 1,
                            key: text,
                            action: (e) => action(state, dispatcher, e),
                            Icon: icon,
                        };
                        switch (type) {
                        case 'vsep': return <Vsep key={`${`v${i}`}`} />;
                        case 'space': return <Space key={`${`s${i}`}`} />;
                        case 'switch': return <Switcher {...props} />;
                        case 'menu': return <DropDown {...props} />;
                        case 'file-upload': return <FileUploader {...props} />;
                        default: return <ActionButton {...props} />;
                        }
                    })
                }
                <input type="file" id="fileUploader" style={{ display: 'none' }} accept=".jpg, .jpeg, .png" />
            </section>
            <Hsep />
        </header>

    );
};

export {
    Header, ActionButton, Vsep, Hsep, Space, TextBox,
};
