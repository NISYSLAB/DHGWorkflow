import React from 'react';
import {
    MdEdit, MdClose, MdAdd,
} from 'react-icons/md';
import localStorageManager from '../graph-builder/local-storage-manager';
import { actionType as T } from '../reducer';
import { newProject, editDetails } from '../toolbarActions/toolbarFunctions';
import './tabBar.css';

const TabBar = ({ superState, dispatcher }) => {
    const closeTab = (i, e) => {
        e.stopPropagation();
        // eslint-disable-next-line no-alert
        if (!window.confirm('Do you confirm to close the tab? This action is irreversable.')) return;
        localStorageManager.remove(superState.graphs[i] ? superState.graphs[i].id : null);
        dispatcher({ type: T.REMOVE_GRAPH, payload: i });
    };
    const editCur = (e) => {
        e.stopPropagation();
        editDetails(superState, dispatcher);
    };
    return (
        <div className="tab-par">
            <button
                className="tab"
                onClick={newProject.bind(this, superState, dispatcher)}
                type="button"
            >
                <MdAdd size={25} />
            </button>
            {superState.graphs.map((el, i) => (
                <div
                    key={el.id}
                    className={`tab tab-graph ${superState.curGraphIndex === i ? 'selected' : 'none'}`}
                    onClick={() => dispatcher({ type: T.CHANGE_TAB, payload: i })}
                    onKeyDown={(ev) => ev.key === 13 && dispatcher({ type: T.CHANGE_TAB, payload: i })}
                    role="button"
                    tabIndex={0}
                >
                    <span className="tab-text">
                        {el.projectDetails.projectName}
                        {' - '}
                        {el.projectDetails.author}
                    </span>

                    {superState.curGraphIndex === i ? (
                        <button
                            className="tab-close"
                            onClick={editCur}
                            type="button"
                        >
                            <MdEdit size={16} />
                        </button>
                    ) : <></>}
                    <button
                        className="tab-close"
                        onClick={closeTab.bind(this, i)}
                        type="button"
                    >
                        <MdClose size={20} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default TabBar;
