import React from 'react';
import Modal from './ParentModal';
import { actionType as T } from '../../reducer';
import './project-details.css';
import cyFun from '../../graph-builder';

const ProjectDeails = ({ superState, dispatcher }) => {
    const setName = (e) => {
        dispatcher({
            type: T.SET_PROJECT_DETAILS,
            payload: { ...superState.projectDetails, name: e.target.value },
        });
    };
    const setAuthor = (e) => {
        dispatcher({
            type: T.SET_PROJECT_DETAILS,
            payload: { ...superState.projectDetails, author: e.target.value },
        });
    };
    const submit = (e) => {
        e.preventDefault();
        dispatcher({ type: T.SET_PROJECT_DETAILS, payload: { ...superState.projectDetails, set: true } });
        cyFun.saveLocalStorage();
    };
    const openExisting = () => {
        document.querySelector('input[type="file"]').click();
    };
    return (
        <Modal ModelOpen={!superState.projectDetails.set} title="Project Details">
            <form className="proj-details" onSubmit={submit}>
                <span>Workflow Name</span>
                <input
                    placeholder="Title of workflow"
                    required
                    value={superState.projectDetails.name}
                    onChange={setName}
                />
                <span>Author</span>
                <input
                    placeholder="Author of workflow"
                    required
                    value={superState.projectDetails.author}
                    onChange={setAuthor}
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
