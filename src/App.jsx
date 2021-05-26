import React from 'react';
import './App.css';
import Header from './component/Header';

const app = () => (
    <div>
        <Header title="MyGraph" />
        <section className="body">
            <div className="graph-container" />
        </section>
    </div>
);

export default app;
