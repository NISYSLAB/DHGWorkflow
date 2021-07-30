import React, { useEffect, useState, useCallback } from 'react';
import Modal from './ParentModal';
import './project-details.css';
import { actionType as T } from '../../reducer';

const ProjectDetails = ({ superState, dispatcher }) => {
    const curGraph = superState.graphs[superState.curGraphIndex];
    const [projectName, setProjectName] = useState('');
    const [author, setAuthor] = useState('');
    const inputRef = useCallback((node) => node && node.focus(), []);
    useEffect(() => {
        if (!curGraph) {
            setProjectName(''); setAuthor('');
        } else {
            setProjectName(curGraph.projectDetails.projectName || '');
        }
    }, [!curGraph || !curGraph.projectDetails.set]);

    const addNewGraph = () => {
        dispatcher({
            type: T.ADD_GRAPH,
            payload: { id: new Date().getTime(), projectDetails: { projectName, set: true } },
        });
    };

    const setProjectDetails = (projectDetails) => {
        dispatcher({
            type: T.SET_PROJECT_DETAILS,
            payload: {
                projectDetails,
                id: curGraph.id,
            },
        });
    };

    const submit = (e) => {
        e.preventDefault();
        if (!curGraph) addNewGraph();
        else setProjectDetails({ projectName, set: true });
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
            ModelOpen={!curGraph || !curGraph.projectDetails.set}
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
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
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
