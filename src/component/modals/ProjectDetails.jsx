import React, { useEffect, useState, useCallback } from 'react';
import Modal from './ParentModal';
import './project-details.css';
import { actionType as T } from '../../reducer';
import localStorageManager from '../../graph-builder/local-storage-manager';

const ProjectDetails = ({ superState, dispatcher }) => {
    const curGraph = superState.graphs[superState.curGraphIndex];
    const [projectName, setProjectName] = useState('');
    const [authorName, setAuthorName] = useState('');
    const inputRef = useCallback((node) => node && node.focus(), []);
    const newGraphModal = superState.newGraphModal || superState.graphs.length === 0;
    const editDetailsModal = superState.editDetailsModal || (curGraph && !curGraph.projectName);

    const setProjAuthorName = (a) => {
        setAuthorName(a);
        dispatcher({
            type: T.SET_AUTHOR,
            payload: a,
        });
    };

    useEffect(() => {
        if (superState.editDetailsModal && curGraph) {
            setProjectName(curGraph.projectName);
        } else setProjectName('');
    }, [superState.authorName, superState.editDetailsModal, curGraph]);
    useEffect(() => {
        if (superState.authorName) setAuthorName(superState.authorName);
        else {
            const authorNameE = localStorageManager.getAuthorName();
            setProjAuthorName(authorNameE);
        }
    }, []);

    const submit = (e) => {
        e.preventDefault();
        if (newGraphModal) dispatcher({ type: T.ADD_GRAPH, payload: { projectName } });
        else if (editDetailsModal) {
            superState.curGraphInstance.setProjectName(projectName);
            dispatcher({ type: T.SET_EDIT_DETAILS_MODAL, payload: false });
        }
        setProjAuthorName(authorName);
        localStorageManager.setAuthorName(authorName);
    };

    const openExisting = () => {
        superState.fileRef.current.click();
    };

    const closeModal = () => {
        if (superState.newGraphModal) dispatcher({ type: T.SET_NEW_GRAPH_MODAL, payload: false });
        else if (superState.editDetailsModal) dispatcher({ type: T.SET_EDIT_DETAILS_MODAL, payload: false });
    };
    return (
        <Modal
            ModelOpen={newGraphModal || editDetailsModal}
            closeModal={superState.editDetailsModal || superState.newGraphModal ? closeModal : null}
            title="Project Details"
        >
            <form className="proj-details" onSubmit={submit}>
                <span>Workflow Name</span>
                <input
                    ref={inputRef}
                    placeholder="Title of workflow"
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                />
                <span>Author</span>
                <input
                    placeholder="Author of workflow"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    required
                />
                <div className="expand">
                    <button type="submit" className="btn btn-primary">Save</button>
                    {newGraphModal && (
                        <>
                            <div className="divider" />
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={openExisting}
                            >
                                Open Existing

                            </button>
                        </>
                    )}
                </div>
            </form>
        </Modal>
    );
};

export default ProjectDetails;
