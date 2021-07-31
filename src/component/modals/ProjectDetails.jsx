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

    const setProjectDetails = (projectDetails) => {
        dispatcher({
            type: T.SET_PROJECT_DETAILS,
            payload: {
                projectDetails,
                id: curGraph.id,
            },
        });
    };

    const setProjAuthorName = (author) => {
        dispatcher({
            type: T.SET_AUTHOR,
            payload: author,
        });
    };

    useEffect(() => {
        if (!curGraph) setProjectName('');
        else setProjectName(curGraph.projectDetails.projectName || '');

        if (superState.authorName) setAuthorName(superState.authorName);
        else {
            const authorNameE = localStorageManager.getAuthorName();
            setAuthorName(authorNameE);
            setProjAuthorName(authorNameE);
        }
    }, [curGraph, !curGraph || !curGraph.projectDetails.set]);

    const addNewGraph = () => {
        dispatcher({
            type: T.ADD_GRAPH,
            payload: { id: new Date().getTime(), projectDetails: { projectName, set: true } },
        });
    };

    const submit = (e) => {
        e.preventDefault();
        if (!curGraph) addNewGraph();
        else setProjectDetails({ projectName, set: true });
        setProjAuthorName(authorName);
        localStorageManager.setAuthorName(authorName);
    };

    const openExisting = () => {
        superState.fileRef.current.click();
    };
    const closeModal = () => {
        if (!curGraph) dispatcher({ type: T.CHANGE_TAB, payload: 0 });
        else {
            setProjectDetails({
                ...curGraph.projectDetails,
                set: Boolean(curGraph.projectDetails.projectName),
            });
        }
    };
    return (
        <Modal
            ModelOpen={!superState.authorName || !curGraph || !curGraph.projectDetails.set}
            closeModal={!curGraph && superState.curGraphIndex === 0 ? null : closeModal}
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
                    {curGraph ? <></> : (
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
