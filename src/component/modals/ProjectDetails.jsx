import React, { useState } from 'react';
import Modal from './ParentModal';
import './project-details.css';
import { actionType as T } from '../../reducer';

const ProjectDeails = ({ superState, dispatcher }) => {
    const [projectName, setProjectName] = useState('');
    const [author, setAuthor] = useState('');
    const submit = (e) => {
        e.preventDefault();
        const graphRef = React.createRef();
        const id = `graph_${superState.curGraphIndex}`;
        const component = <div style={{ zIndex: 1 }} id={id} ref={graphRef} key={superState.curGraphIndex} />;
        dispatcher({
            type: T.ADD_GRAPH,
            payload: { id, component, projectDetails: { projectName, author, set: true } },
        });
    };
    const openExisting = () => {
        document.querySelector('input[type="file"]').click();
    };
    return (
        <Modal
            ModelOpen={
                !superState.graphs[superState.curGraphIndex]
                || !superState.graphs[superState.curGraphIndex].projectDetails.set
            }
            title="Project Details"
        >
            <form className="proj-details" onSubmit={submit}>
                <span>Workflow Name</span>
                <input
                    placeholder="Title of workflow"
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                />
                <span>Author</span>
                <input
                    placeholder="Author of workflow"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                />
                <div className="expand">
                    <button type="submit" className="btn btn-primary">Save</button>
                    <div className="divider" />
                    <button type="button" className="btn btn-secondary" onClick={openExisting}>Open Existing</button>
                </div>
            </form>
        </Modal>
    );
};

export default ProjectDeails;
