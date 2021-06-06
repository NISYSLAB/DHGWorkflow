import React, { useState } from 'react';
import Modal from './ParentModal';
import { actionType as T } from '../../reducer';

const ProjectDeails = ({ superState, dispatcher }) => {
    const [name, setName] = useState('');
    const [author, setAuthor] = useState('');
    const submit = (e) => {
        e.preventDefault();
        dispatcher({ type: T.SET_PROJECT_DETAILS, payload: { name, author } });
    };
    return (
        <Modal ModelOpen={superState.projectDetails.name === ''} title="Project Details">
            <form className="proj-details" onSubmit={submit}>
                Workflow Name:
                <input required value={name} onChange={(e) => setName(e.target.value)} />
                Author:
                <input required value={author} onChange={(e) => setAuthor(e.target.value)} />
                <button type="submit">Save</button>
            </form>
        </Modal>
    );
};

export default ProjectDeails;
